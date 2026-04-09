// client/src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from '../firebase';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css'; // ডিফল্ট স্টাইল    
import { Star, ArrowRight, MessageSquareQuote } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState(''); // এটি কান্ট্রি কোডসহ নম্বর সেভ করবে
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // ১. পুরোনো কোনো রিক্যাপচা থাকলে সেটাকে সমূলে বিনাশ করা
    if (window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier.clear();
      } catch (e) { console.log("Clear error:", e); }
    }

    // ২. কন্টেইনার রিফ্রেশ
    const container = document.getElementById('recaptcha-container');
    if (container) container.innerHTML = '';

    try {
      // ৩. নতুন করে ভেরিফায়ার তৈরি (auth অবজেক্টটি ঠিকমতো ইম্পোর্ট হয়েছে তো?)
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible'
      });

      // আপনার handleSendOTP ফাংশনের ভেতরে এই চেকটা যোগ করুন
      const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;
      console.log("Sending OTP to:", formattedPhone); // কনসোলে চেক করুন + টা ঠিকমতো আছে কি না

      // ৪. ওটিপি পাঠানো
      const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, window.recaptchaVerifier);

      window.confirmationResult = confirmationResult;
      sessionStorage.setItem('phoneNumber', formattedPhone);
      navigate('/verify-otp', { state: { phone: formattedPhone } });

    } catch (err) {
      console.error("Firebase Auth Error:", err.code, err.message);

      if (err.code === 'auth/invalid-phone-number') {
        setError('ফোন নম্বরটি সঠিক নয়। কান্ট্রি কোড চেক করুন।');
      } else if (err.code === 'auth/too-many-requests') {
        setError('অনেকবার চেষ্টা করেছেন! কিছুক্ষণ পর আবার ট্রাই করুন।');
      } else {
        setError('OTP পাঠানো যায়নি। আবার চেষ্টা করুন।');
      }

      // এরর হলে রিসেট
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center font-sans overflow-hidden bg-gradient-to-br from-[#fdfbfb] to-[#f3efe6]">
      {/* Background Pattern (Gold Stars) */}
      <div className="absolute inset-0 z-0 opacity-10" style={{
        backgroundImage: `radial-gradient(2px 2px at 20px 30px, #d4af37, rgba(0,0,0,0)), radial-gradient(1px 1px at 80px 140px, #b8860b, rgba(0,0,0,0))`,
        backgroundSize: '200px 200px, 300px 300px'
      }}></div>

      <div className="relative z-10 w-full max-w-md px-6">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="bg-gradient-to-tr from-[#d4af37] to-[#f4a460] p-2 rounded-xl shadow-lg">
              <Star className="text-white w-6 h-6" fill="currentColor" />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-[#b8860b] to-[#d4af37] bg-clip-text text-transparent tracking-tighter">
              RUHU
            </span>
          </Link>
          <h2 className="text-2xl font-bold text-slate-800">Welcome Back</h2>
          <p className="text-slate-500 text-sm font-medium">Log in to check your cosmic alignment</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-[0_10px_40px_rgba(212,175,55,0.15)] border border-[#cf9f4a]/30">
          <form onSubmit={handleSendOTP} className="space-y-6">

            {/* Phone Input with Country Dropdown */}
            <div>
              <label className="block text-xs uppercase tracking-widest text-[#b8860b] font-bold mb-2 ml-1">Phone Number</label>
              <div className="phone-input-container">
                <PhoneInput
                  country={'in'} // ডিফল্ট ইন্ডিয়া
                  value={phone}
                  onChange={setPhone}
                  inputStyle={{
                    width: '100%',
                    height: '50px',
                    borderRadius: '12px',
                    border: '1px solid rgba(207, 159, 74, 0.4)',
                    fontSize: '16px',
                    backgroundColor: 'rgba(255, 255, 255, 0.5)'
                  }}
                  buttonStyle={{
                    borderRadius: '12px 0 0 12px',
                    border: '1px solid rgba(207, 159, 74, 0.4)',
                    backgroundColor: 'white'
                  }}
                  containerClass="hover:border-[#d4af37] transition-all"
                />
              </div>
            </div>

            <div id="recaptcha-container"></div>

            {error && (
              <p className="text-red-500 text-xs font-bold text-center bg-red-50 p-2 rounded-lg border border-red-100">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !phone}
              className="w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-xl shadow-[0_4px_15px_rgba(212,175,55,0.3)] text-sm font-bold text-white bg-gradient-to-r from-[#d4af37] to-[#e4b363] hover:from-[#b8860b] hover:to-[#d4af37] transition-all disabled:opacity-50"
            >
              {loading ? 'Sending Request...' : <>Send OTP <ArrowRight size={18} /></>}
            </button>
          </form>

          {/* Bottom Link */}
          <div className="mt-8 text-center border-t border-[#cf9f4a]/20 pt-6">
            <p className="text-sm text-slate-600 font-medium">
              Don't have an account?{' '}
              <Link to="/register" className="text-[#b8860b] font-bold hover:underline underline-offset-4">
                Sign Up Now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;