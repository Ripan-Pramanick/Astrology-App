// server/controllers/paymentController.js
import { createRazorpayOrder, verifyPaymentSignature } from '../utils/razorpay.js';
import { savePaymentRecord, updatePaymentRecord, updateServicePaymentStatus } from '../services/paymentService.js';

/**
 * Create a new Razorpay order
 * POST /api/payment/create-order
 */
export const createOrder = async (req, res) => {
  try {
    const { amount, currency, receipt, description, service, serviceId } = req.body;
    const userId = req.user?.id; // from auth middleware

    const finalAmount = amount || 1100;
    const finalCurrency = currency || 'INR';
    if (!finalAmount) {
      return res.status(400).json({ message: 'Amount is required.' });
    }

    // Razorpay needs amount in PAISE (multiply by 100)
    const amountInPaise = Number(finalAmount) * 100;

    // Create order in Razorpay
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

    // Save order record in database - non-blocking (don't crash if table missing)
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
      // Log but don't fail - payment can proceed even if DB record fails
      console.warn('Payment record save skipped (payments table may not exist):', dbErr.message);
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
    console.error('Order creation error:', error);
    return res.status(500).json({ message: 'Failed to create order.' });
  }
};

/**
 * Verify payment after success
 * POST /api/payment/verify
 */
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      service,
      serviceId,
    } = req.body;

    const isValid = verifyPaymentSignature({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    if (!isValid) {
      // Update payment record as failed
      await updatePaymentRecord(razorpay_order_id, {
        status: 'failed',
        payment_id: razorpay_payment_id,
      });
      return res.status(400).json({ success: false, message: 'Invalid signature.' });
    }

    // Payment is successful
    // Update payment record
    await updatePaymentRecord(razorpay_order_id, {
      status: 'completed',
      payment_id: razorpay_payment_id,
    });

    // Update associated service request (e.g., kundali_requests)
    if (service && serviceId) {
      await updateServicePaymentStatus(service, serviceId);
    }

    return res.status(200).json({
      success: true,
      message: 'Payment verified and completed.',
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};