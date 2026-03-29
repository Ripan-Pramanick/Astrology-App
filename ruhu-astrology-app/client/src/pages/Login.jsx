// client/src/pages/Login.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from '../firebase'; // আপনার ফায়ারবেস কনফিগ ফাইল থেকে আনুন

const Login = () => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // পেজ লোড হওয়ার সময় একবার ভেরিফায়ার তৈরি হবে
  const initRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        'recaptcha-container',
        {
          size: 'invisible',
          callback: (response) => {
            console.log("reCAPTCHA solved");
          },
          'expired-callback': () => {
            window.recaptchaVerifier.render();
          }
        }
      );
    }
  };

  // Login.jsx এর handleSendOTP ফাংশন
const handleSendOTP = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  // ১. পুরোনো রিক্যাপচা থাকলে সেটা পরিষ্কার করে ফেলা (খুব জরুরি)
  if (window.recaptchaVerifier) {
    try {
      window.recaptchaVerifier.clear();
      // কন্টেইনারটাকেও একবার রিসেট করে দিন
      const container = document.getElementById('recaptcha-container');
      if (container) container.innerHTML = ''; 
    } catch (e) {
      console.log("Cleanup error:", e);
    }
  }

  try {
    // ২. নতুন করে ভেরিফায়ার তৈরি করা
    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      size: 'invisible'
    });

    const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
    
    // ৩. ওটিপি পাঠানো (টেস্ট নাম্বার হলে সাথে সাথে কাজ করবে)
    const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, window.recaptchaVerifier);
    
    window.confirmationResult = confirmationResult;
    sessionStorage.setItem('phoneNumber', formattedPhone);
    navigate('/verify-otp', { state: { phone: formattedPhone } });

  } catch (err) {
    console.error("Firebase Auth Error:", err);
    // বিলিং এরর দিলে ইউজারকে সতর্ক করা
    if (err.code === 'auth/billing-not-enabled') {
      setError('গুগল এখন SMS পাঠাতে কার্ড চায়। দয়া করে আপনার নম্বরটি Firebase-এ টেস্ট নাম্বার হিসেবে সেট করুন।');
    } else {
      setError('OTP পাঠানো যায়নি। আবার চেষ্টা করুন।');
    }
    // এরর হলে রিক্যাপচা রিসেট
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
      window.recaptchaVerifier = null;
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSendOTP}>
          <div className="rounded-md shadow-sm">
            <input
              type="tel"
              required
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Phone number (e.g., 9876543210)"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>

          {/* reCAPTCHA কন্টেইনার অবশ্যই থাকতে হবে */}
          <div id="recaptcha-container"></div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </div>
          {error && <p className="text-red-600 text-sm text-center">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default Login;