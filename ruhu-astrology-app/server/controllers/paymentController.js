// server/controllers/paymentController.js
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { supabase } from '../utils/supabase.js'; // Supabase client instance

// Initialize Razorpay with keys from environment
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * Create Razorpay order
 * POST /api/payment/create-order
 */
export const createOrder = async (req, res) => {
  try {
    const { amount, currency, receipt, description, service, serviceId } = req.body;

    if (!amount || !currency) {
      return res.status(400).json({ message: 'Amount and currency are required.' });
    }

    // Get user ID from auth middleware (assuming we have it set)
    const userId = req.user?.id;

    // Create order in Razorpay
    const options = {
      amount: Number(amount), // amount in paise
      currency,
      receipt,
      notes: {
        description,
        service,
        serviceId,
        userId: userId || 'guest',
      },
    };
    const order = await razorpay.orders.create(options);

    // 🚀 TODO: [SUPABASE DB] Insert order record into 'payments' table with status 'created'
    // const { data, error } = await supabase
    //   .from('payments')
    //   .insert({
    //     order_id: order.id,
    //     user_id: userId,
    //     amount: amount,
    //     currency: currency,
    //     service: service,
    //     service_id: serviceId,
    //     status: 'created',
    //     created_at: new Date(),
    //   });

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
    console.error('Razorpay order creation error:', error);
    return res.status(500).json({ message: 'Failed to create order.' });
  }
};

/**
 * Verify payment signature and update status
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

    // Generate expected signature
    const secret = process.env.RAZORPAY_KEY_SECRET;
    const generatedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Invalid signature.' });
    }

    // Payment successful
    // 🚀 TODO: [SUPABASE DB] Update payment record status to 'completed'
    // const { error } = await supabase
    //   .from('payments')
    //   .update({
    //     status: 'completed',
    //     payment_id: razorpay_payment_id,
    //     updated_at: new Date(),
    //   })
    //   .eq('order_id', razorpay_order_id);

    // 🚀 TODO: [SUPABASE DB] Update associated service request (e.g., kundali_requests) to 'paid' status
    // if (service === 'kundli' && serviceId) {
    //   await supabase.from('kundali_requests').update({ payment_status: 'paid' }).eq('id', serviceId);
    // }

    return res.status(200).json({
      success: true,
      message: 'Payment verified and completed.',
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};