import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../firebase'; // আপনার ফায়ারবেস ফাইল
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth'; // 👈 ফায়ারবেসের ফাংশনগুলো
import { verifyPhoneToken } from '../services/auth'; 
import { KeyRound, ArrowRight, ShieldCheck } from 'lucide-react';

const OTPVerify = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false); // OTP পাঠানো হয়েছে কি না তার স্টেট

  const phoneNumber = location.state?.phone || sessionStorage.getItem('phoneNumber');

  // যদি ফোন নম্বর না থাকে, লগইন পেজে ফেরত পাঠান
  useEffect(() => {
    if (!phoneNumber) {
      navigate('/login');
    }
  }, [phoneNumber, navigate]);

  // 🚀 ১. ফায়ারবেস ReCAPTCHA সেটআপ (Spam ঠেকানোর জন্য)
  useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': (response) => {
          // reCAPTCHA solved
        }
      });
    }
  }, []);

  // 🚀 ২. পেজ লোড হলেই ইউজারের ফোনে OTP পাঠানোর ফাংশন
  useEffect(() => {
    const sendOTP = async () => {
      if (!phoneNumber || window.confirmationResult || otpSent) return;

      try {
        setLoading(true);
        const appVerifier = window.recaptchaVerifier;
        
        // Firebase এ ফোন নম্বর পাঠানোর আগে +91 (country code) থাকা বাধ্যতামূলক
        const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
        
        // ফায়ারবেসকে বলছি SMS পাঠাতে
        const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
        
        // SMS পাঠানো সফল হলে সেশনটা সেভ করে রাখছি
        window.confirmationResult = confirmationResult;
        setOtpSent(true);
        setError('');
        console.log("✅ OTP পাঠানো হয়েছে!");
      } catch (err) {
        console.error("OTP Send Error:", err);
        setError('OTP পাঠাতে সমস্যা হয়েছে। পেজটি রিলোড করে আবার চেষ্টা করুন।');
      } finally {
        setLoading(false);
      }
    };

    sendOTP();
  }, [phoneNumber, otpSent]);

  // 🚀 ৩. ইউজার যখন কোড বসিয়ে Submit করবে
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const confirmationResult = window.confirmationResult;

      if (!confirmationResult) {
        throw new Error('OTP সেশন পাওয়া যায়নি। পেজটি রিলোড করুন।');
      }

      // ফায়ারবেসের সাথে OTP মেলানো হচ্ছে
      const result = await confirmationResult.confirm(otp);
      
      // ফায়ারবেস থেকে নিরাপদ ID Token নেওয়া
      const idToken = await result.user.getIdToken();

      // আপনার ব্যাকএন্ডে টোকেন পাঠানো (যাতে ব্যাকএন্ড Firebase UID সেভ করতে পারে)
      const response = await verifyPhoneToken(idToken);

      if (response.success) {
        localStorage.setItem('authToken', idToken);
        localStorage.setItem('user', JSON.stringify(response.user));

        // কাজ শেষ, পরিষ্কার পরিচ্ছন্নতা
        window.confirmationResult = null;
        sessionStorage.removeItem('phoneNumber');

        // সোজাসুজি ড্যাশবোর্ডে!
        navigate('/dashboard');
      } else {
        setError(response.message || 'Authentication failed.');
      }
    } catch (err) {
      console.error("Verification Error:", err);
      setError('ভুল OTP বা কোডের মেয়াদ শেষ হয়ে গেছে। আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center font-sans overflow-hidden bg-gradient-to-br from-[#fdfbfb] to-[#f3efe6]">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-10" style={{
        backgroundImage: `radial-gradient(2px 2px at 20px 30px, #d4af37, rgba(0,0,0,0)), radial-gradient(1px 1px at 80px 140px, #b8860b, rgba(0,0,0,0)), radial-gradient(3px 2px at 260px 380px, #daa520, rgba(0,0,0,0))`,
        backgroundSize: '200px 200px, 300px 300px, 400px 400px'
      }}></div>

      <div className="relative z-10 w-full max-w-md px-6 py-12">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-[#d4af37] to-[#f4a460] shadow-[0_0_15px_rgba(212,175,55,0.4)] mb-4">
             <ShieldCheck className="text-white w-7 h-7" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-[#b8860b] to-[#d4af37] bg-clip-text text-transparent tracking-wide">
            Verify Your Stars
          </h2>
          <p className="text-slate-500 mt-2 font-medium">
            We sent a cosmic code to <span className="font-bold text-[#b8860b]">{phoneNumber}</span>
          </p>
        </div>

        {/* OTP Card */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-[0_10px_40px_rgba(212,175,55,0.1)] border border-[#cf9f4a]/30">
          <form onSubmit={handleVerifyOTP} className="space-y-6">
            
            {/* OTP Input */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#b8860b] font-bold mb-1.5 ml-1 text-center">Enter 6-digit OTP</label>
              <div className="relative mt-2">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#cf9f4a]">
                  <KeyRound size={18} />
                </div>
                <input 
                  type="text" 
                  maxLength="6"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} // শুধু নম্বর টাইপ করা যাবে
                  className="block w-full pl-10 pr-3 py-3 border border-[#cf9f4a]/40 rounded-xl leading-5 bg-white/50 placeholder-slate-400 text-slate-800 text-center tracking-[0.5em] font-bold text-xl focus:outline-none focus:ring-2 focus:ring-[#d4af37]/50 focus:border-[#d4af37] transition-all"
                  placeholder="------" 
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 text-red-500 text-sm font-semibold p-3 rounded-lg text-center border border-red-100">
                {error}
              </div>
            )}

            {/* Hidden Div for Recaptcha */}
            <div id="recaptcha-container"></div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={loading || otp.length !== 6 || !otpSent}
              className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-[0_4px_15px_rgba(212,175,55,0.3)] text-sm font-bold text-white bg-gradient-to-r from-[#d4af37] to-[#e4b363] hover:from-[#b8860b] hover:to-[#d4af37] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#d4af37] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <span className="animate-pulse">Verifying...</span>
              ) : (
                <>Verify & Enter <ArrowRight size={18} /></>
              )}
            </button>
          </form>
          
          {/* Resend Logic (Static for now) */}
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600 font-medium">
              Didn't receive the code?{' '}
              <button onClick={() => window.location.reload()} className="font-bold text-[#b8860b] hover:text-[#d4af37] transition-colors">
                Resend OTP
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerify;