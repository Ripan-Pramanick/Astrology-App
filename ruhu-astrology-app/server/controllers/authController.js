// server/controllers/authController.js
import admin from 'firebase-admin'; // 👈 এই লাইনটি মিসিং ছিল অথবা কাজ করছিল না
import { supabase } from '../utils/supabase.js';

export const verifyPhoneAuth = async (req, res) => {
  try {
    // ১. আপনার ফ্রন্টএন্ড থেকে 'token' আসছে, তাই 'token' ই পড়ুন
    const { token } = req.body; 

    if (!token) {
      console.log("❌ Token missing in request body");
      return res.status(400).json({ success: false, message: 'Missing token.' });
    }

    // ২. এখন 'admin' ডিফাইন করা আছে, তাই এটি কাজ করবে
    let decodedToken;
    try {
      decodedToken = await admin.auth().verifyIdToken(token);
    } catch (err) {
      console.error('❌ Firebase Token Verification Failed:', err.message);
      return res.status(401).json({ success: false, message: 'Invalid token.' });
    }

    const { uid, phone_number } = decodedToken;

    // ৩. Supabase-এ ইউজার চেক এবং ইনসার্ট (আগের মতো)
    const { data: user, error: dbError } = await supabase
      .from('users')
      .upsert({ 
        firebase_uid: uid, 
        phone: phone_number,
        role: 'user'
      }, { onConflict: 'firebase_uid' })
      .select()
      .single();

    if (dbError) {
      console.error('❌ Supabase Error:', dbError);
      return res.status(500).json({ success: false, message: 'Database error.' });
    }

    return res.status(200).json({ success: true, user });

  } catch (error) {
    console.error('❌ Final Server Error:', error);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};