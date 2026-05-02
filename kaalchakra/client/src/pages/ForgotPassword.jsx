// client/src/pages/ForgotPassword.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';
import { Star, Mail, ArrowRight } from 'lucide-react';

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
      await sendPasswordResetEmail(auth, email);
      setMessage('Password reset email sent! Check your inbox.');
      setTimeout(() => {
        window.location.href = '/login';
      }, 3000);
    } catch (err) {
      console.error("Reset error:", err);
      if (err.code === 'auth/user-not-found') {
        setError('No account found with this email.');
      } else {
        setError('Failed to send reset email. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center font-sans overflow-hidden bg-gradient-to-br from-[#fdfbfb] to-[#f3efe6]">
      <div className="absolute inset-0 z-0 opacity-10" style={{
        backgroundImage: `radial-gradient(2px 2px at 20px 30px, #d4af37, rgba(0,0,0,0))`,
        backgroundSize: '200px 200px'
      }}></div>

      <div className="relative z-10 w-full max-w-md px-6">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="bg-gradient-to-tr from-[#d4af37] to-[#f4a460] p-2 rounded-xl shadow-lg">
              <Star className="text-white w-6 h-6" fill="currentColor" />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-[#b8860b] to-[#d4af37] bg-clip-text text-transparent">
              Kaal Chakra
            </span>
          </Link>
          <h2 className="text-2xl font-bold text-slate-800">Reset Password</h2>
          <p className="text-slate-500 text-sm">We'll send you a reset link</p>
        </div>

        <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-lg border border-[#cf9f4a]/30">
          <form onSubmit={handleResetPassword} className="space-y-5">
            <div>
              <label className="block text-xs uppercase tracking-widest text-[#b8860b] font-bold mb-2">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center">
                  <Mail size={18} className="text-[#b8860b]" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/50 border border-[#cf9f4a]/30 rounded-xl focus:ring-2 focus:ring-[#d4af37] outline-none"
                  required
                />
              </div>
            </div>

            {message && <p className="text-green-600 text-sm text-center bg-green-50 p-2 rounded-lg">{message}</p>}
            {error && <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-3 bg-gradient-to-r from-[#d4af37] to-[#e4b363] text-white font-bold rounded-xl transition-all disabled:opacity-50"
            >
              {loading ? 'Sending...' : <>Send Reset Email <ArrowRight size={18} /></>}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/login" className="text-sm text-[#b8860b] hover:underline">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;