// server/controllers/authController.js
import admin from 'firebase-admin'; 
import { supabase } from '../utils/supabase.js';

// export const verifyPhoneAuth = async (req, res) => {
//   try {
//     // ১. আপনার ফ্রন্টএন্ড থেকে 'token' আসছে, তাই 'token' ই পড়ুন
//     const { token } = req.body; 

//     if (!token) {
//       console.log("❌ Token missing in request body");
//       return res.status(400).json({ success: false, message: 'Missing token.' });
//     }

//     // ২. এখন 'admin' ডিফাইন করা আছে, তাই এটি কাজ করবে
//     let decodedToken;
//     try {
//       decodedToken = await admin.auth().verifyIdToken(token);
//     } catch (err) {
//       console.error('❌ Firebase Token Verification Failed:', err.message);
//       return res.status(401).json({ success: false, message: 'Invalid token.' });
//     }

//     const { uid, phone_number } = decodedToken;

//     // ৩. Supabase-এ ইউজার চেক এবং ইনসার্ট (আগের মতো)
//     const { data: user, error: dbError } = await supabase
//       .from('users')
//       .upsert({ 
//         firebase_uid: uid, 
//         phone: phone_number,
//         role: 'user'
//       }, { onConflict: 'firebase_uid' }) // অথবা onConflict: 'phone' যদি আপনার টেবিলে ফোন নম্বর ইউনিক হয়
//       .select()
//       .single();

//     if (dbError) {
//       console.error('❌ Supabase Error:', dbError);
//       return res.status(500).json({ success: false, message: 'Database error.' });
//     }

//     return res.status(200).json({ success: true, user });

//   } catch (error) {
//     console.error('❌ Final Server Error:', error);
//     return res.status(500).json({ success: false, message: 'Server error.' });
//   }
// };


// 👇👇 এখান থেকে নতুন কোড শুরু 👇👇

// Route: POST /api/auth/register
export const registerUser = async (req, res) => {
  try {
    // 👇 এই লাইনটা বসিয়ে দেখুন ডেটা ব্যাকএন্ডে পৌঁছাচ্ছে কি না
    console.log("➡️ Frontend theke data asche:", req.body); 

    const { name, email, phone } = req.body;
    
    // ... বাকি কোড ...

    // ১. ভ্যালিডেশন
    if (!name || !email || !phone) {
      return res.status(400).json({ success: false, message: 'নাম, ইমেইল এবং ফোন নম্বর আবশ্যক!' });
    }

   // ২. চেক করুন এই ফোন নম্বরটি আগে থেকেই ডাটাবেসে আছে কি না
    const { data: existingUser, error: searchError } = await supabase
      .from('users')
      .select('*')
      .eq('phone', phone)
      .maybeSingle(); // 👈 .single() এর বদলে .maybeSingle() দিন

    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'এই ফোন নম্বরটি আগে থেকেই রেজিস্টার করা আছে! দয়া করে লগইন করুন।' 
      });
    }

    // ৩. নতুন ইউজারের বেসিক ডেটা ডাটাবেসে সেভ করুন 
    // (firebase_uid পরে verifyPhoneAuth এর সময় আপডেট হয়ে যাবে)
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert([{ name, email, phone, role: 'user' }])
      .select()
      .single();

    if (insertError) {
      console.error('❌ Supabase Insert Error:', insertError);
      return res.status(500).json({ success: false, message: 'ডাটাবেসে সেভ করতে সমস্যা হয়েছে।' });
    }

    // ৪. সাকসেস রেসপন্স
    return res.status(200).json({ 
      success: true, 
      message: 'সফলভাবে অ্যাকাউন্ট তৈরি হয়েছে! এবার OTP ভেরিফাই করুন।' 
    });

  } catch (error) {
    console.error('❌ Registration Error:', error);
    return res.status(500).json({ success: false, message: 'সার্ভারে সমস্যা হয়েছে!' });
  }
};

export const verifyPhoneAuth = async (req, res) => {
  try {
    const { token } = req.body; 
    let decodedToken = await admin.auth().verifyIdToken(token);
    const { uid, phone_number } = decodedToken;

    // ১. আগে চেক করুন ইউজার কি ডাটাবেসে আছে? 
    const { data: existingUser } = await supabase
      .from('users')
      .select('role')
      .eq('phone', phone_number)
      .maybeSingle();

    // ২. যদি সে অ্যাডমিন হয় তবে সেই রোলটিই থাকবে, নতুবা 'user' হবে
    const userRole = existingUser?.role || 'user';

    const { data: user, error: dbError } = await supabase
      .from('users')
      .upsert({ 
        firebase_uid: uid, 
        phone: phone_number,
        role: userRole // 👈 আপনার অ্যাডমিন পাওয়ার সুরক্ষিত থাকবে
      }, { onConflict: 'phone' }) 
      .select()
      .single();

    if (dbError) throw dbError;
    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error('❌ Login Error:', error);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};