// client/src/pages/AuthPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../firebase';
import { Eye, EyeOff, Mail, Lock, User, Star } from 'lucide-react';

const AuthPage = () => {
  const navigate = useNavigate();
  const [isSignupMode, setIsSignupMode] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  
  // Form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const authBoxRef = useRef(null);
  const pARef = useRef(null);
  const pBRef = useRef(null);

  const DURATION = 720;

  const toggleMode = (toSignup) => {
    if (isBusy) return;
    setIsBusy(true);
    
    setIsSignupMode(toSignup);
    
    setTimeout(() => {
      if (pARef.current) {
        pARef.current.classList.toggle('show-reg', toSignup);
      }
      if (pBRef.current) {
        pBRef.current.classList.toggle('show-welcome', toSignup);
      }
    }, DURATION / 2);
    
    setTimeout(() => {
      setIsBusy(false);
    }, DURATION);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      const user = userCredential.user;
      const idToken = await user.getIdToken();

      const response = await fetch('http://localhost:5000/api/auth/verify-phone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: idToken })
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('user', JSON.stringify({
          ...data.user,
          email: user.email,
          uid: user.uid,
          name: user.displayName || loginEmail.split('@')[0]
        }));
        navigate('/dashboard');
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (err) {
      console.error("Login error:", err);
      if (err.code === 'auth/user-not-found') {
        setError('No account found with this email');
      } else if (err.code === 'auth/wrong-password') {
        setError('Incorrect password');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email format');
      } else {
        setError(err.message || 'Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, regEmail, regPassword);
      const user = userCredential.user;
      
      await updateProfile(user, { displayName: regName });
      
      const idToken = await user.getIdToken();

      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: regName,
          email: regEmail,
          phone: user.phoneNumber || '',
          firebase_uid: user.uid
        })
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('user', JSON.stringify({
          name: regName,
          email: regEmail,
          uid: user.uid,
          ...data.user
        }));
        navigate('/dashboard');
      } else {
        throw new Error(data.message || 'Registration failed');
      }
    } catch (err) {
      console.error("Registration error:", err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Email already registered');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email format');
      } else if (err.code === 'auth/weak-password') {
        setError('Password must be at least 6 characters');
      } else {
        setError(err.message || 'Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center font-sans overflow-auto py-8 px-4" style={{ background: '#e8edf4' }}>
      
      {/* Auth Box */}
      <div 
        ref={authBoxRef}
        className={`auth-box w-[min(880px,96vw)] h-[clamp(400px,80vh,560px)] rounded-[clamp(16px,2.5vw,28px)] relative z-10 overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] ${isSignupMode ? 'signup-mode' : ''}`}
        style={{
          background: '#e8edf4',
          boxShadow: '18px 18px 40px rgba(155, 172, 205, 0.78), -12px -12px 30px rgba(255, 255, 255, 0.98), 0 4px 16px rgba(140, 158, 198, 0.3)'
        }}
      >
        {/* Divider Line */}
        <div className="absolute top-0 bottom-0 w-px z-10 pointer-events-none transition-all duration-700 ease-[cubic-bezier(0.65,0,0.35,1)]"
          style={{
            left: isSignupMode ? '40%' : '60%',
            boxShadow: '-1px 0 0 rgba(148, 165, 198, 0.28), 1px 0 0 rgba(255, 255, 255, 0.88)'
          }}
        />

        {/* Panel A - Form Panel (60%) */}
        <div 
          ref={pARef}
          className="absolute top-0 w-[60%] h-full transition-all duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] z-[1]"
          style={{ 
            left: isSignupMode ? '40%' : '0%',
            background: 'rgba(255, 255, 255, 0.07)',
            boxShadow: 'inset -8px 0 24px rgba(140, 158, 198, 0.08)'
          }}
        >
          {/* Login Form */}
          <div className={`p-inner absolute inset-0 flex flex-col items-center justify-center p-[clamp(20px,4.5vh,48px)] ${isSignupMode ? 'hidden' : 'flex'}`}>
            <div className="fp-title text-[clamp(17px,2.6vw,26px)] font-bold text-[#1e2545] tracking-[0.18em] mb-[clamp(12px,2.5vh,22px)] whitespace-nowrap">
              SIGN IN
            </div>
            
            <div className="social-row flex gap-[clamp(8px,1.2vw,14px)] mb-[clamp(6px,1vh,10px)]">
              <div className="s-icon w-[clamp(34px,4.2vw,44px)] h-[clamp(34px,4.2vw,44px)] rounded-full bg-[#e8edf4] flex items-center justify-center cursor-pointer shadow-[7px_7px_14px_rgba(155,172,205,0.72),-6px_-6px_12px_rgba(255,255,255,0.96)] transition-all hover:-translate-y-0.5">
                <svg viewBox="0 0 24 24" fill="none" stroke="#6878c0" strokeWidth="1.8" className="w-5 h-5 opacity-40">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
              </div>
              <div className="s-icon w-[clamp(34px,4.2vw,44px)] h-[clamp(34px,4.2vw,44px)] rounded-full bg-[#e8edf4] flex items-center justify-center cursor-pointer shadow-[7px_7px_14px_rgba(155,172,205,0.72),-6px_-6px_12px_rgba(255,255,255,0.96)] transition-all hover:-translate-y-0.5">
                <svg viewBox="0 0 24 24" fill="none" stroke="#6878c0" strokeWidth="1.8" className="w-5 h-5 opacity-40">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <div className="s-icon active w-[clamp(34px,4.2vw,44px)] h-[clamp(34px,4.2vw,44px)] rounded-full bg-[#e8edf4] flex items-center justify-center cursor-pointer shadow-[inset_5px_5px_10px_rgba(155,172,205,0.68),inset_-4px_-4px_8px_rgba(255,255,255,0.9)]">
                <svg viewBox="0 0 24 24" fill="none" stroke="#6878c0" strokeWidth="1.8" className="w-5 h-5 opacity-100">
                  <rect x="2" y="6" width="20" height="12" rx="4" />
                  <path d="M8 12h4M10 10v4M15 12h.01M17 12h.01" />
                </svg>
              </div>
            </div>
            
            <div className="social-hint text-[11px] text-[#9ba4bb] tracking-[0.05em] mb-[clamp(10px,2vh,20px)]">
              Choose login method or email login
            </div>

            <form onSubmit={handleLogin} className="w-full">
              <div className="field w-full mb-[clamp(6px,1.3vh,12px)]">
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full bg-white/88 border border-[#dde3ed] rounded-[10px] p-[clamp(9px,1.8vh,13px)] px-4 text-[#2a3054] outline-none transition-all focus:border-[rgba(91,122,247,0.6)] focus:bg-white focus:shadow-[0_0_0_3px_rgba(91,122,247,0.1)]"
                  required
                />
              </div>
              <div className="field w-full mb-[clamp(6px,1.3vh,12px)]">
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full bg-white/88 border border-[#dde3ed] rounded-[10px] p-[clamp(9px,1.8vh,13px)] px-4 text-[#2a3054] outline-none transition-all focus:border-[rgba(91,122,247,0.6)] focus:bg-white"
                  required
                />
              </div>
              <span className="forgot text-[12px] text-[#9ba4bb] underline underline-offset-[3px] cursor-pointer mt-1 mb-[clamp(12px,2vh,20px)] block text-center hover:text-[#5b7af7]">
                Forgot Password?
              </span>
              
              {error && <p className="text-red-500 text-xs text-center mb-3">{error}</p>}
              
              <button
                type="submit"
                disabled={loading}
                className="btn-blue w-full py-[clamp(10px,1.8vh,13px)] rounded-full border-none cursor-pointer font-bold text-[12px] tracking-[0.2em] uppercase bg-[#5b7af7] text-white shadow-[0_6px_22px_rgba(91,122,247,0.45)] hover:bg-[#4a6ae6] hover:shadow-[0_10px_30px_rgba(91,122,247,0.55)] hover:-translate-y-px active:translate-y-0 transition-all disabled:opacity-50"
              >
                {loading ? 'LOADING...' : 'SIGN IN'}
              </button>
            </form>
          </div>

          {/* Register Form */}
          <div className={`p-inner absolute inset-0 flex flex-col items-center justify-center p-[clamp(20px,4.5vh,48px)] ${isSignupMode ? 'flex' : 'hidden'}`}>
            <div className="fp-title text-[clamp(17px,2.6vw,26px)] font-bold text-[#1e2545] tracking-[0.18em] mb-[clamp(12px,2.5vh,22px)] whitespace-nowrap">
              SIGN UP
            </div>
            
            <div className="social-row flex gap-[clamp(8px,1.2vw,14px)] mb-[clamp(6px,1vh,10px)]">
              <div className="s-icon w-[clamp(34px,4.2vw,44px)] h-[clamp(34px,4.2vw,44px)] rounded-full bg-[#e8edf4] flex items-center justify-center cursor-pointer shadow-[7px_7px_14px_rgba(155,172,205,0.72),-6px_-6px_12px_rgba(255,255,255,0.96)] transition-all">
                <svg viewBox="0 0 24 24" fill="none" stroke="#6878c0" strokeWidth="1.8" className="w-5 h-5 opacity-40">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
              </div>
              <div className="s-icon w-[clamp(34px,4.2vw,44px)] h-[clamp(34px,4.2vw,44px)] rounded-full bg-[#e8edf4] flex items-center justify-center cursor-pointer shadow-[7px_7px_14px_rgba(155,172,205,0.72),-6px_-6px_12px_rgba(255,255,255,0.96)] transition-all">
                <svg viewBox="0 0 24 24" fill="none" stroke="#6878c0" strokeWidth="1.8" className="w-5 h-5 opacity-40">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <div className="s-icon w-[clamp(34px,4.2vw,44px)] h-[clamp(34px,4.2vw,44px)] rounded-full bg-[#e8edf4] flex items-center justify-center cursor-pointer shadow-[7px_7px_14px_rgba(155,172,205,0.72),-6px_-6px_12px_rgba(255,255,255,0.96)] transition-all">
                <svg viewBox="0 0 24 24" fill="none" stroke="#6878c0" strokeWidth="1.8" className="w-5 h-5 opacity-40">
                  <rect x="2" y="6" width="20" height="12" rx="4" />
                  <path d="M8 12h4M10 10v4M15 12h.01M17 12h.01" />
                </svg>
              </div>
            </div>
            
            <div className="social-hint text-[11px] text-[#9ba4bb] tracking-[0.05em] mb-[clamp(10px,2vh,20px)]">
              Choose registration method or email registration
            </div>

            <form onSubmit={handleRegister} className="w-full">
              <div className="field w-full mb-[clamp(6px,1.3vh,12px)]">
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="Username"
                  className="w-full bg-white/88 border border-[#dde3ed] rounded-[10px] p-[clamp(9px,1.8vh,13px)] px-4 text-[#2a3054] outline-none transition-all focus:border-[rgba(91,122,247,0.6)] focus:bg-white"
                  required
                />
              </div>
              <div className="field w-full mb-[clamp(6px,1.3vh,12px)]">
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full bg-white/88 border border-[#dde3ed] rounded-[10px] p-[clamp(9px,1.8vh,13px)] px-4 text-[#2a3054] outline-none transition-all focus:border-[rgba(91,122,247,0.6)] focus:bg-white"
                  required
                />
              </div>
              <div className="field w-full mb-[clamp(6px,1.3vh,12px)]">
                <input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full bg-white/88 border border-[#dde3ed] rounded-[10px] p-[clamp(9px,1.8vh,13px)] px-4 text-[#2a3054] outline-none transition-all focus:border-[rgba(91,122,247,0.6)] focus:bg-white"
                  required
                />
              </div>
              
              {error && <p className="text-red-500 text-xs text-center mb-3">{error}</p>}
              
              <button
                type="submit"
                disabled={loading}
                className="btn-blue w-full py-[clamp(10px,1.8vh,13px)] rounded-full border-none cursor-pointer font-bold text-[12px] tracking-[0.2em] uppercase bg-[#5b7af7] text-white shadow-[0_6px_22px_rgba(91,122,247,0.45)] hover:bg-[#4a6ae6] hover:shadow-[0_10px_30px_rgba(91,122,247,0.55)] hover:-translate-y-px active:translate-y-0 transition-all disabled:opacity-50 mt-1"
              >
                {loading ? 'LOADING...' : 'SIGN UP'}
              </button>
            </form>
          </div>
        </div>

        {/* Panel B - Overlay Panel (40%) */}
        <div 
          ref={pBRef}
          className="absolute top-0 w-[40%] h-full transition-all duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] z-[3] overflow-hidden"
          style={{ left: isSignupMode ? '0%' : '60%', background: '#e8edf4' }}
        >
          {/* Decorative Circles */}
          <div className="absolute w-[230px] h-[230px] rounded-full bg-[#e8edf4] shadow-[9px_9px_20px_rgba(168,182,208,0.65),-7px_-7px_16px_rgba(255,255,255,0.92)] top-[-95px] right-[-85px] pointer-events-none"></div>
          <div className="absolute w-[210px] h-[210px] rounded-full bg-[#e8edf4] shadow-[8px_8px_18px_rgba(168,182,208,0.6),-6px_-6px_14px_rgba(255,255,255,0.9)] bottom-[-85px] left-[-75px] pointer-events-none"></div>

          {/* Hello Friend (Login Mode) */}
          <div className={`p-inner absolute inset-0 flex flex-col items-center justify-center text-center p-[clamp(20px,4.5vh,52px)] transition-opacity duration-180 ${isSignupMode ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'}`}>
            <div className="o-title text-[clamp(17px,2.6vw,26px)] font-bold text-[#1e2545] mb-[clamp(10px,1.5vh,14px)]">
              Hello Friend!
            </div>
            <div className="o-sub text-[clamp(11px,1.3vw,13px)] text-[#9ba4bb] leading-relaxed mb-[clamp(18px,3.5vh,36px)] max-w-[210px]">
              Register an account to become a valued member and embark on a wonderful journey with us!
            </div>
            <button
              onClick={() => toggleMode(true)}
              className="btn-blue py-[clamp(10px,1.8vh,13px)] px-[clamp(22px,3.5vw,48px)] rounded-full border-none cursor-pointer font-bold text-[12px] tracking-[0.2em] uppercase bg-[#5b7af7] text-white shadow-[0_6px_22px_rgba(91,122,247,0.45)] hover:bg-[#4a6ae6] hover:shadow-[0_10px_30px_rgba(91,122,247,0.55)] transition-all"
            >
              SIGN UP
            </button>
          </div>

          {/* Welcome Back (Register Mode) */}
          <div className={`p-inner absolute inset-0 flex flex-col items-center justify-center text-center p-[clamp(20px,4.5vh,52px)] transition-opacity duration-180 ${isSignupMode ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
            <div className="o-title text-[clamp(17px,2.6vw,26px)] font-bold text-[#1e2545] mb-[clamp(10px,1.5vh,14px)]">
              Welcome Back!
            </div>
            <div className="o-sub text-[clamp(11px,1.3vw,13px)] text-[#9ba4bb] leading-relaxed mb-[clamp(18px,3.5vh,36px)] max-w-[210px]">
              Already have an account? Sign in to enter the wonderful world of astrology!
            </div>
            <button
              onClick={() => toggleMode(false)}
              className="btn-blue py-[clamp(10px,1.8vh,13px)] px-[clamp(22px,3.5vw,48px)] rounded-full border-none cursor-pointer font-bold text-[12px] tracking-[0.2em] uppercase bg-[#5b7af7] text-white shadow-[0_6px_22px_rgba(91,122,247,0.45)] hover:bg-[#4a6ae6] hover:shadow-[0_10px_30px_rgba(91,122,247,0.55)] transition-all"
            >
              SIGN IN
            </button>
          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="mobile-nav hidden md:hidden absolute top-0 left-0 right-0 flex bg-[#e8edf4] rounded-t-[20px] overflow-hidden border-b border-[rgba(200,212,232,0.6)] z-20">
          <div 
            onClick={() => toggleMode(false)}
            className={`m-tab flex-1 py-3.5 text-center text-[13px] font-bold tracking-[0.1em] uppercase cursor-pointer transition-all ${
              !isSignupMode ? 'text-[#5b7af7] border-b-2 border-[#5b7af7]' : 'text-[#9ba4bb] border-b-2 border-transparent'
            }`}
          >
            SIGN IN
          </div>
          <div 
            onClick={() => toggleMode(true)}
            className={`m-tab flex-1 py-3.5 text-center text-[13px] font-bold tracking-[0.1em] uppercase cursor-pointer transition-all ${
              isSignupMode ? 'text-[#5b7af7] border-b-2 border-[#5b7af7]' : 'text-[#9ba4bb] border-b-2 border-transparent'
            }`}
          >
            SIGN UP
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;