// server/routes/payment.js
import express from 'express';
import crypto from 'crypto';
import { supabase } from '../utils/supabase.js';

const router = express.Router();

// Razorpay Payment Verification and Premium Activation
router.post('/verify-payment', async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      user_id,
      user_phone,
      user_email,
      plan_type // 'premium' or 'basic'
    } = req.body;

    // Verify signature
    const secret = process.env.RAZORPAY_KEY_SECRET;
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature !== expectedSignature) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid payment signature" 
      });
    }

    // Payment is verified - Activate Premium
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1); // 1 year premium

    // Update user in Supabase
    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update({
        subscription: 'premium',
        is_premium: true,
        premium_expiry: expiryDate.toISOString(),
        premium_activated_at: new Date().toISOString(),
        razorpay_customer_id: razorpay_payment_id,
        updated_at: new Date().toISOString()
      })
      .eq('phone', user_phone)
      .select()
      .single();

    if (updateError) {
      console.error("Database update error:", updateError);
      return res.status(500).json({ 
        success: false, 
        message: "Failed to update user status" 
      });
    }

    // Save payment record
    const { error: paymentError } = await supabase
      .from('payments')
      .insert([{
        user_id: user_id,
        user_phone: user_phone,
        order_id: razorpay_order_id,
        payment_id: razorpay_payment_id,
        amount: 999,
        currency: 'INR',
        status: 'success',
        plan_type: plan_type,
        created_at: new Date().toISOString()
      }]);

    if (paymentError) {
      console.error("Payment record error:", paymentError);
    }

    // Send email notification (optional)
    await sendPremiumActivationEmail(user_email, user_phone);

    return res.json({ 
      success: true, 
      message: "Premium activated successfully!",
      user: updatedUser
    });

  } catch (error) {
    console.error("Payment verification error:", error);
    return res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Check user premium status
router.get('/check-premium/:phone', async (req, res) => {
  try {
    const { phone } = req.params;

    const { data: user, error } = await supabase
      .from('users')
      .select('subscription, is_premium, premium_expiry, premium_activated_at')
      .eq('phone', phone)
      .single();

    if (error) throw error;

    const isPremium = user?.is_premium === true && 
                      new Date(user?.premium_expiry) > new Date();

    return res.json({
      success: true,
      isPremium: isPremium,
      subscription: user?.subscription,
      expiryDate: user?.premium_expiry,
      activatedAt: user?.premium_activated_at
    });

  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Helper function to send email (implement based on your email service)
async function sendPremiumActivationEmail(email, phone) {
  // Implement email sending logic
  console.log(`Premium activated for ${email} (${phone})`);
}

export default router;