// server/controllers/paymentController.js
import { createRazorpayOrder, verifyPaymentSignature } from '../utils/razorpay.js';
import { savePaymentRecord, updatePaymentRecord, updateServicePaymentStatus } from '../services/paymentService.js';

export const createOrder = async (req, res) => {
  try {
    console.log("=== INITIATING RAZORPAY PAYMENT ===");
    
    // 🌟 ১. Key Check: সার্ভারে .env ফাইল ঠিক আছে কিনা চেক করা
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.error("❌ CRITICAL ERROR: Razorpay keys are MISSING in the server's environment variables!");
      return res.status(500).json({ message: 'Server configuration error: Razorpay keys missing.' });
    }

    const { amount, currency, receipt, description, service, serviceId } = req.body;
    const userId = req.user?.id;

    // 🌟 ২. Amount Fix: ফ্রন্টএন্ড থেকে যদি 49900 আসে, সেটিকে আর 100 দিয়ে গুণ করা যাবে না!
    const finalAmount = amount || 49900; 
    const finalCurrency = currency || 'INR';

    // যদি ফ্রন্টএন্ড থেকে 499 পাঠানো হয়, তবেই 100 দিয়ে গুণ করব। 49900 আসলে সরাসরি ব্যবহার করব।
    const amountInPaise = finalAmount < 10000 ? Number(finalAmount) * 100 : Number(finalAmount);

    console.log(`Creating order for Amount: ${amountInPaise} paise`);

    // 🌟 ৩. Order Create
    const order = await createRazorpayOrder({
      amount: amountInPaise,
      currency: finalCurrency,
      receipt: receipt || `rcpt_${Date.now()}`,
      notes: {
        description,
        service,
        serviceId,
        userId: userId || 'guest',
      },
    });

    console.log("✅ Order created successfully! ID:", order.id);

    // 🌟 ৪. Database Save (এটি ফেইল করলেও পেমেন্ট আটকাবে না)
    try {
      await savePaymentRecord({
        order_id: order.id,
        user_id: userId || null,
        amount: order.amount,
        currency: order.currency,
        service: service || 'kundli',
        service_id: serviceId || null,
        status: 'created',
        created_at: new Date(),
      });
    } catch (dbErr) {
      console.warn('⚠️ Payment record save skipped (payments table may not exist):', dbErr.message);
    }

    return res.status(200).json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
      },
      razorpayKey: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('❌ Order creation error:', error);
    return res.status(500).json({ message: 'Failed to create order. See server logs.', error: error.message });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, service, serviceId } = req.body;

    const isValid = verifyPaymentSignature({ razorpay_order_id, razorpay_payment_id, razorpay_signature });

    if (!isValid) {
      await updatePaymentRecord(razorpay_order_id, { status: 'failed', payment_id: razorpay_payment_id }).catch(()=>{});
      return res.status(400).json({ success: false, message: 'Invalid signature.' });
    }

    await updatePaymentRecord(razorpay_order_id, { status: 'completed', payment_id: razorpay_payment_id }).catch(()=>{});

    if (service && serviceId) {
      await updateServicePaymentStatus(service, serviceId).catch(()=>{});
    }

    return res.status(200).json({ success: true, message: 'Payment verified and completed.' });
  } catch (error) {
    console.error('Payment verification error:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};