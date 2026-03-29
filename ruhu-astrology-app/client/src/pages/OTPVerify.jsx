// client/src/pages/OTPVerify.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../firebase'; // আপনার ফায়ারবেস ফাইল
import { verifyPhoneToken } from '../services/auth'; 


const OTPVerify = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const phoneNumber = location.state?.phone || sessionStorage.getItem('phoneNumber');

  useEffect(() => {
    if (!phoneNumber) {
      navigate('/login');
    }
  }, [phoneNumber, navigate]);

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // ১. সেশন স্টোরেজ থেকে নয়, সরাসরি উইন্ডো অবজেক্ট থেকে নিন
      const confirmationResult = window.confirmationResult;

      if (!confirmationResult) {
        throw new Error('OTP সেশন পাওয়া যায়নি। দয়া করে আবার নম্বর দিয়ে চেষ্টা করুন।');
      }

      // ২. এখন .confirm() কাজ করবে কারণ এটি আসল অবজেক্ট
      const result = await confirmationResult.confirm(otp);
      
      // ৩. ফায়ারবেস থেকে ID Token নেওয়া (ব্যাকএন্ড ভেরিফিকেশনের জন্য)
      const idToken = await result.user.getIdToken();

      // ৪. আপনার ব্যাকএন্ডে টোকেন পাঠানো
      const response = await verifyPhoneToken(idToken);

      if (response.success) {
        localStorage.setItem('authToken', idToken);
        localStorage.setItem('user', JSON.stringify(response.user));

        // কাজ শেষ, এবার উইন্ডো অবজেক্ট পরিষ্কার করে দিন
        window.confirmationResult = null;
        sessionStorage.removeItem('phoneNumber');

        navigate('/dashboard');
      } else {
        setError(response.message || 'Authentication failed.');
      }
    } catch (err) {
      console.error("Verification Error:", err);
      setError('ভুল OTP বা সেশন শেষ হয়ে গেছে। আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Verify OTP</h2>
          <p className="mt-2 text-center text-sm text-gray-600">Enter the OTP sent to {phoneNumber}</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleVerifyOTP}>
          <input
            type="text"
            required
            maxLength="6"
            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
          {error && <p className="text-red-600 text-sm text-center mt-2">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default OTPVerify;