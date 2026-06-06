// server/utils/razorpay.js
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Razorpay from 'razorpay';
import crypto from 'crypto';

// ES Module-এ সঠিক .env ফাইলের পাথ সেট করা (utils ফোল্ডার থেকে এক ধাপ বাইরে)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// ডিবাগ করার জন্য লগ (টার্মিনালে বুঝতে পারবেন ডেটা পাচ্ছে কি না)
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.error("❌ CRITICAL ERROR: Razorpay keys are missing in .env file!");
} else {
  console.log("✅ Razorpay Keys Loaded Successfully in utils/razorpay.js");
}

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: "rzp_test_SxdPTwuayHXPYm",
  key_secret: "BUOKI5IkFA30iQCCGssiegJR",
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