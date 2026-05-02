// server/utils/razorpay.js
import Razorpay from 'razorpay';
import crypto from 'crypto';

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * Create a Razorpay order
 * @param {Object} options - Order options (amount, currency, receipt, notes)
 * @returns {Promise} Razorpay order object
 */
export const createRazorpayOrder = async (options) => {
  return razorpay.orders.create(options);
};

/**
 * Verify Razorpay payment signature
 * @param {Object} params - { razorpay_order_id, razorpay_payment_id, razorpay_signature }
 * @returns {boolean} True if signature matches
 */
export const verifyPaymentSignature = (params) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = params;
  const secret = process.env.RAZORPAY_KEY_SECRET;
  const generatedSignature = crypto
    .createHmac('sha256', secret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');
  return generatedSignature === razorpay_signature;
};

export default razorpay;