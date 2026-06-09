// server/utils/razorpay.js
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Razorpay from 'razorpay';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Initialize Razorpay instance (Master Test)
const razorpay = new Razorpay({
  key_id: "rzp_test_Syog0Rq9DyzKMI",
  key_secret: "LDXDlpNLh7d8H4T06TFppA43",
});

export const createRazorpayOrder = async (options) => {
  return razorpay.orders.create(options);
};

export const verifyPaymentSignature = (params) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = params;
  // ভেরিফিকেশনের জন্যও টেস্ট সিক্রেট দেওয়া হলো
  const secret = "LDXDlpNLh7d8H4T06TFppA43"; 
  const generatedSignature = crypto
    .createHmac('sha256', secret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');
  return generatedSignature === razorpay_signature;
};

export default razorpay;