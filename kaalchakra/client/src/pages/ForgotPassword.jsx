// client/src/pages/ForgotPassword.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase'; // আপনার ফায়ারবেস কনফিগারেশন ফাইল
import { Mail, ArrowLeft, Star, Sparkles, CheckCircle2 } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      if (!email) {
        throw new Error('Please enter your email address.');
      }

      // ফায়ারবেসকে ইমেইল পাঠানোর রিকোয়েস্ট করা হচ্ছে
      await sendPasswordResetEmail(auth, email);
      
      setMessage('Password reset email sent! Please check your inbox (and spam folder) to reset your password.');
      setEmail(''); // ফর্ম ক্লিয়ার করা হলো
    } catch (err) {
      console.error("Reset Password Error:", err);
      if (err.code === 'auth/user-not-found') {
        setError('No account found with this email address.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else {
        setError(err.message || 'Failed to send reset email. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center font-sans overflow-auto py-8 px-4" style={{ background: 'linear-gradient(135deg, #fdfbfb 0%, #f3efe6 100%)' }}>
      
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-[10%] text-orange-200/20"><Star className="w-8 h-8" fill="#F7931E" /></div>
        <div className="absolute bottom-32 right-[15%] text-amber-200/20"><Sparkles className="w-6 h-6" /></div>
      </div>

      <div className="relative z-10 w-full max-w-md px-6">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="bg-gradient-to-tr from-[#d4af37] to-[#f4a460] p-2 rounded-xl shadow-lg">
              <Star className="text-white w-6 h-6" fill="currentColor" />
            </div>
            <span className="text-3xl font-bold bg-clip-text text-transparent tracking-tighter" style={{ backgroundImage: 'linear-gradient(to right, #b8860b, #d4af37)' }}>
              Kaal Chakra
            </span>
          </Link>
          <h2 className="text-2xl font-bold text-slate-800">Reset Password</h2>
          <p className="text-slate-500 text-sm font-medium mt-1">We'll send you an email with a reset link.</p>
        </div>

        {/* Form Card */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-[0_10px_40px_rgba(212,175,55,0.15)] border border-[#cf9f4a]/30">
          
          {message ? (
            <div className="text-center py-4 animate-in fade-in zoom-in duration-300">
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <p className="text-sm text-green-700 font-semibold bg-green-50 p-4 rounded-xl border border-green-200">
                {message}
              </p>
              <Link to="/login" className="inline-block mt-6 text-sm font-bold text-[#b8860b] hover:underline">
                Return to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-5">
              <div>
                <label className="block text-xs uppercase tracking-widest text-[#b8860b] font-bold mb-2 ml-1">
                  Registered Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail size={18} className="text-[#b8860b]" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full pl-12 pr-4 py-3 bg-white/50 border border-[#cf9f4a]/30 rounded-xl focus:ring-2 focus:ring-[#d4af37] outline-none transition-all"
                    required
                  />
                </div>
              </div>

              {error && (
                <p className="text-red-500 text-xs font-bold text-center bg-red-50 p-2 rounded-lg border border-red-100 animate-in fade-in">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-3.5 px-4 rounded-xl shadow-[0_4px_15px_rgba(212,175,55,0.3)] text-sm font-bold text-white transition-all disabled:opacity-50 mt-2" 
                style={{ backgroundImage: 'linear-gradient(to right, #d4af37, #e4b363)' }}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  'SEND RESET LINK'
                )}
              </button>
            </form>
          )}

          {!message && (
            <div className="mt-8 text-center border-t border-[#cf9f4a]/20 pt-6">
              <Link to="/login" className="inline-flex items-center gap-1 text-sm text-[#b8860b] font-bold hover:underline underline-offset-4">
                <ArrowLeft size={16} /> Back to Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;