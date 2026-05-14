// client/src/pages/AuthPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Eye, EyeOff, Mail, Lock, User, Star, Sparkles, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from '../firebase.js';
import api from '../services/api';

const AuthPage = () => {
  const navigate = useNavigate();
  const [isSignupMode, setIsSignupMode] = useState(false);
  const [isBusy, setIsBusy] = useState(false);

  // Form states
  const [loginId, setLoginId] = useState(''); 
  const [loginPassword, setLoginPassword] = useState('');
  
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState(''); 
  const [regPassword, setRegPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); 
  
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
    setError('');

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
      if (!loginId || !loginPassword) {
        throw new Error('Please enter both Email/Phone and password');
      }

      const isPhone = /^[0-9+\-\s]+$/.test(loginId);
      
      if (isPhone) {
        setError('Phone number login is coming soon! Please use your Email to login for now.');
        setLoading(false);
        return;
      }

      const userCredential = await signInWithEmailAndPassword(auth, loginId, loginPassword);
      const user = userCredential.user;
      
      const idToken = await user.getIdToken();
      
      const response = await api.post('/auth/verify-email', {
        token: idToken,
        email: loginId 
      });

      const data = response.data;

      if (data.success && data.user) {
        const userData = {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          phone: data.user.phone || '',
          role: data.user.role || 'user',
          uid: user.uid
        };
        localStorage.setItem('user', JSON.stringify(userData));
        
        navigate('/dashboard');
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (err) {
      console.error("Login error:", err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        setError('No account found or incorrect password.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else {
        setError(err.message || 'Login failed. Please try again.');
      }
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!regName || !regEmail || !regPhone || !regPassword || !confirmPassword) {
        throw new Error('Please fill in all fields');
      }
      if (regPassword !== confirmPassword) {
        throw new Error('Passwords do not match!');
      }
      if (regPassword.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      const userCredential = await createUserWithEmailAndPassword(auth, regEmail, regPassword);
      const user = userCredential.user;
      
      await updateProfile(user, { displayName: regName });
      
      const idToken = await user.getIdToken();
      
      const response = await api.post('/auth/verify-email', {
        token: idToken,
        email: regEmail,
        name: regName,
        phone: regPhone
      });

      const data = response.data; 

      if (data.success && data.user) {
        const userData = {
          id: data.user.id,
          name: regName,
          email: regEmail,
          phone: regPhone,
          role: data.user.role || 'user',
          uid: user.uid
        };
        localStorage.setItem('user', JSON.stringify(userData));
        
        navigate('/dashboard');
      } else {
        throw new Error(data.message || 'Registration failed');
      }
    } catch (err) {
      console.error("Registration error:", err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Email already registered. Please sign in.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email format');
      } else if (err.code === 'auth/weak-password') {
        setError('Password must be at least 6 characters');
      } else {
        setError(err.message || 'Registration failed');
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center font-sans overflow-auto py-8 px-4" style={{ background: 'linear-gradient(135deg, #fdfbfb 0%, #f3efe6 100%)' }}>

      {/* Decorative Stars Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-[10%] text-orange-200/20"><Star className="w-8 h-8" fill="#F7931E" /></div>
        <div className="absolute bottom-32 right-[15%] text-amber-200/20"><Sparkles className="w-6 h-6" /></div>
        <div className="absolute top-40 right-[20%] text-orange-200/20"><Star className="w-5 h-5" fill="#F7931E" /></div>
        <div className="absolute bottom-20 left-[20%] text-amber-200/20"><Sparkles className="w-7 h-7" /></div>
      </div>

      {/* Auth Box */}
      <div
        ref={authBoxRef}
        // ✅ Changed height for mobile to ensure form fits perfectly (h-[650px] on mobile, clamp on desktop)
        className={`auth-box w-[min(880px,96vw)] h-[650px] md:h-[clamp(400px,85vh,620px)] rounded-[clamp(16px,2.5vw,28px)] relative z-10 overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] ${isSignupMode ? 'signup-mode' : ''}`}
        style={{ background: '#e8edf4', boxShadow: '18px 18px 40px rgba(155, 172, 205, 0.78), -12px -12px 30px rgba(255, 255, 255, 0.98), 0 4px 16px rgba(140, 158, 198, 0.3)' }}
      >
        {/* Divider Line */}
        {/* ✅ Hidden on mobile (max-md:hidden) */}
        <div className="absolute top-0 bottom-0 w-px z-10 pointer-events-none transition-all duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] max-md:hidden"
          style={{ left: isSignupMode ? '40%' : '60%', boxShadow: '-1px 0 0 rgba(212, 175, 55, 0.28), 1px 0 0 rgba(255, 255, 255, 0.88)' }}
        />

        {/* Panel A - Form Panel */}
        {/* ✅ Takes full width on mobile (w-full max-md:!left-0) */}
        <div
          ref={pARef}
          className="absolute top-0 h-full transition-all duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] z-[1] w-full max-md:!left-0 md:w-[60%]"
          style={{ left: isSignupMode ? '40%' : '0%', background: 'rgba(255, 255, 255, 0.07)', boxShadow: 'inset -8px 0 24px rgba(212, 175, 55, 0.08)' }}
        >
          {/* Login Form */}
          {/* ✅ Added max-md:pt-16 to push form down below mobile tabs */}
          <div className={`p-inner absolute inset-0 flex flex-col items-center justify-center p-[clamp(20px,4.5vh,48px)] max-md:pt-16 ${isSignupMode ? 'hidden' : 'flex'}`}>
            <div className="fp-title text-[clamp(17px,2.6vw,26px)] font-bold text-[#1e2545] tracking-[0.18em] mb-[clamp(12px,2.5vh,22px)] flex items-center gap-2">
              <span className="text-[#d4af37]">✨</span> WELCOME BACK <span className="text-[#d4af37]">✨</span>
            </div>

            <div className="social-hint text-[11px] text-[#9ba4bb] tracking-[0.05em] mb-[clamp(10px,2vh,20px)]">
              Connect with cosmic energy
            </div>

            <form onSubmit={handleLogin} className="w-full mt-4">
              <div className="field w-full mb-[clamp(8px,1.5vh,14px)] relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={16} className="text-[#9ba4bb]" />
                </div>
                <input
                  type="text"
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  placeholder="Email or Phone Number"
                  autoComplete="username"
                  className="w-full bg-white/88 border border-[#d4af37]/30 rounded-[10px] py-[clamp(10px,2vh,14px)] pl-10 pr-4 text-[#2a3054] outline-none transition-all focus:border-[#d4af37] focus:bg-white focus:shadow-[0_0_0_3px_rgba(212,175,55,0.1)]"
                  required
                />
              </div>
              <div className="field w-full mb-[clamp(8px,1.5vh,14px)] relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={16} className="text-[#9ba4bb]" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Password"
                  autoComplete="current-password"
                  className="w-full bg-white/88 border border-[#d4af37]/30 rounded-[10px] py-[clamp(10px,2vh,14px)] pl-10 pr-10 text-[#2a3054] outline-none transition-all focus:border-[#d4af37] focus:bg-white"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                >
                  {showPassword ? <EyeOff size={16} className="text-[#9ba4bb] hover:text-[#d4af37]" /> : <Eye size={16} className="text-[#9ba4bb] hover:text-[#d4af37]" />}
                </button>
              </div>
              <span onClick={() => navigate('/forgot-password')} className="forgot text-[12px] text-[#9ba4bb] underline underline-offset-[3px] cursor-pointer mt-1 mb-[clamp(12px,2vh,20px)] block text-center hover:text-[#d4af37]">
                Forgot Password?
              </span>

              {error && !isSignupMode && <p className="text-red-500 text-xs font-bold text-center mb-3 bg-red-50 p-2 rounded-lg border border-red-100">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="btn-blue w-full py-[clamp(10px,1.8vh,14px)] rounded-full border-none cursor-pointer font-bold text-[12px] tracking-[0.2em] uppercase text-white shadow-[0_6px_22px_rgba(212,175,55,0.45)] hover:brightness-110 hover:shadow-[0_10px_30px_rgba(212,175,55,0.55)] transition-all disabled:opacity-50"
                style={{ backgroundImage: 'linear-gradient(to right, #d4af37, #e4b363)' }}
              >
                {loading && !isSignupMode ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div> : 'SIGN IN'}
              </button>
            </form>
          </div>

          {/* Register Form */}
          {/* ✅ Added max-md:pt-16 to push form down below mobile tabs */}
          <div className={`p-inner absolute inset-0 flex flex-col items-center justify-center p-[clamp(20px,4.5vh,48px)] max-md:pt-16 ${isSignupMode ? 'flex' : 'hidden'}`}>
            <div className="fp-title text-[clamp(17px,2.6vw,26px)] font-bold text-[#1e2545] tracking-[0.18em] mb-[clamp(8px,1.5vh,12px)] flex items-center gap-2">
              <span className="text-[#d4af37]">🌟</span> CREATE ACCOUNT <span className="text-[#d4af37]">🌟</span>
            </div>

            <div className="social-hint text-[11px] text-[#9ba4bb] tracking-[0.05em] mb-[clamp(8px,1.5vh,12px)]">
              Begin your cosmic journey
            </div>

            <form onSubmit={handleRegister} className="w-full mt-2">
               <div className="field w-full mb-[clamp(6px,1.2vh,10px)] relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><User size={15} className="text-[#9ba4bb]" /></div>
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="Full Name"
                  autoComplete="name"
                  className="w-full bg-white/88 border border-[#d4af37]/30 rounded-[10px] py-[clamp(8px,1.4vh,11px)] pl-9 pr-3 text-[#2a3054] outline-none transition-all focus:border-[#d4af37] focus:bg-white text-sm"
                  required
                />
              </div>
              
              <div className="field w-full mb-[clamp(6px,1.2vh,10px)] relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Mail size={15} className="text-[#9ba4bb]" /></div>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="Email Address"
                  autoComplete="username"
                  className="w-full bg-white/88 border border-[#d4af37]/30 rounded-[10px] py-[clamp(8px,1.4vh,11px)] pl-9 pr-3 text-[#2a3054] outline-none transition-all focus:border-[#d4af37] focus:bg-white text-sm"
                  required
                />
              </div>

               <div className="field w-full mb-[clamp(6px,1.2vh,10px)] relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Phone size={15} className="text-[#9ba4bb]" /></div>
                <input
                  type="tel"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="Phone Number"
                  className="w-full bg-white/88 border border-[#d4af37]/30 rounded-[10px] py-[clamp(8px,1.4vh,11px)] pl-9 pr-3 text-[#2a3054] outline-none transition-all focus:border-[#d4af37] focus:bg-white text-sm"
                  required
                />
              </div>

              <div className="field w-full mb-[clamp(6px,1.2vh,10px)] relative">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Lock size={15} className="text-[#9ba4bb]" /></div>
                <input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Password"
                  autoComplete="new-password"
                  className="w-full bg-white/88 border border-[#d4af37]/30 rounded-[10px] py-[clamp(8px,1.4vh,11px)] pl-9 pr-3 text-[#2a3054] outline-none transition-all focus:border-[#d4af37] focus:bg-white text-sm"
                  required
                />
              </div>
              
              <div className="field w-full mb-[clamp(8px,2vh,14px)] relative">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Lock size={15} className="text-[#9ba4bb]" /></div>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm Password"
                  autoComplete="new-password"
                  className="w-full bg-white/88 border border-[#d4af37]/30 rounded-[10px] py-[clamp(8px,1.4vh,11px)] pl-9 pr-3 text-[#2a3054] outline-none transition-all focus:border-[#d4af37] focus:bg-white text-sm"
                  required
                />
              </div>

              {error && isSignupMode && <p className="text-red-500 text-[11px] font-bold text-center mb-2 bg-red-50 p-1.5 rounded-lg border border-red-100">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="btn-blue w-full py-[clamp(10px,1.6vh,13px)] rounded-full border-none cursor-pointer font-bold text-[12px] tracking-[0.2em] uppercase text-white shadow-[0_6px_22px_rgba(212,175,55,0.45)] hover:brightness-110 hover:shadow-[0_10px_30px_rgba(212,175,55,0.55)] transition-all disabled:opacity-50 mt-1"
                style={{ backgroundImage: 'linear-gradient(to right, #d4af37, #e4b363)' }}
              >
                {loading && isSignupMode ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div> : 'SIGN UP'}
              </button>
            </form>
          </div>
        </div>

        {/* Panel B - Overlay Panel (40%) */}
        {/* ✅ Hidden entirely on mobile (max-md:hidden) */}
        <div
          ref={pBRef}
          className="absolute top-0 w-[40%] h-full transition-all duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] z-[3] overflow-hidden max-md:hidden"
          style={{ left: isSignupMode ? '0%' : '60%', background: '#e8edf4' }}
        >
          {/* Decorative Circles */}
          <div className="absolute w-[230px] h-[230px] rounded-full shadow-[9px_9px_20px_rgba(212,175,55,0.3),-7px_-7px_16px_rgba(255,255,255,0.92)] top-[-95px] right-[-85px] pointer-events-none opacity-60" style={{ backgroundImage: 'linear-gradient(to bottom right, rgba(212, 175, 55, 0.2), rgba(228, 179, 99, 0.2))' }}></div>
          <div className="absolute w-[210px] h-[210px] rounded-full shadow-[8px_8px_18px_rgba(212,175,55,0.25),-6px_-6px_14px_rgba(255,255,255,0.9)] bottom-[-85px] left-[-75px] pointer-events-none opacity-60" style={{ backgroundImage: 'linear-gradient(to top right, rgba(228, 179, 99, 0.2), rgba(212, 175, 55, 0.2))' }}></div>

          {/* Hello Friend (Login Mode) */}
          <div className={`p-inner absolute inset-0 flex flex-col items-center justify-center text-center p-[clamp(20px,4.5vh,52px)] transition-opacity duration-180 ${isSignupMode ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'}`}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg" style={{ backgroundImage: 'linear-gradient(to bottom right, #d4af37, #e4b363)' }}><Star className="w-8 h-8 text-white" fill="currentColor" /></div>
            <div className="o-title text-[clamp(17px,2.6vw,26px)] font-bold text-[#1e2545] mb-[clamp(10px,1.5vh,14px)]">Hello Friend!</div>
            <div className="o-sub text-[clamp(11px,1.3vw,13px)] text-[#9ba4bb] leading-relaxed mb-[clamp(18px,3.5vh,36px)] max-w-[210px]">Register an account to become a valued member and embark on a wonderful journey with us!</div>
            <button onClick={() => toggleMode(true)} className="btn-blue py-[clamp(10px,1.8vh,13px)] px-[clamp(22px,3.5vw,48px)] rounded-full border-none cursor-pointer font-bold text-[12px] tracking-[0.2em] uppercase text-white shadow-[0_6px_22px_rgba(212,175,55,0.45)] hover:brightness-110 hover:shadow-[0_10px_30px_rgba(212,175,55,0.55)] transition-all" style={{ backgroundImage: 'linear-gradient(to right, #d4af37, #e4b363)' }}>SIGN UP</button>
          </div>

          {/* Welcome Back (Register Mode) */}
          <div className={`p-inner absolute inset-0 flex flex-col items-center justify-center text-center p-[clamp(20px,4.5vh,52px)] transition-opacity duration-180 ${isSignupMode ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg" style={{ backgroundImage: 'linear-gradient(to bottom right, #d4af37, #e4b363)' }}><Sparkles className="w-8 h-8 text-white" /></div>
            <div className="o-title text-[clamp(17px,2.6vw,26px)] font-bold text-[#1e2545] mb-[clamp(10px,1.5vh,14px)]">Welcome Back!</div>
            <div className="o-sub text-[clamp(11px,1.3vw,13px)] text-[#9ba4bb] leading-relaxed mb-[clamp(18px,3.5vh,36px)] max-w-[210px]">Already have an account? Sign in to enter the wonderful world of astrology!</div>
            <button onClick={() => toggleMode(false)} className="btn-blue py-[clamp(10px,1.8vh,13px)] px-[clamp(22px,3.5vw,48px)] rounded-full border-none cursor-pointer font-bold text-[12px] tracking-[0.2em] uppercase text-white shadow-[0_6px_22px_rgba(212,175,55,0.45)] hover:brightness-110 hover:shadow-[0_10px_30px_rgba(212,175,55,0.55)] transition-all" style={{ backgroundImage: 'linear-gradient(to right, #d4af37, #e4b363)' }}>SIGN IN</button>
          </div>
        </div>

        {/* Mobile Navigation Tabs (This controls the switching on mobile perfectly) */}
        <div className="mobile-nav md:hidden absolute top-0 left-0 right-0 flex bg-[#e8edf4] rounded-t-[16px] overflow-hidden border-b border-[#d4af37]/30 z-20">
          <div onClick={() => toggleMode(false)} className={`flex-1 py-3.5 text-center text-[13px] font-bold tracking-[0.1em] uppercase cursor-pointer transition-all ${!isSignupMode ? 'text-[#d4af37] border-b-2 border-[#d4af37] bg-white/50' : 'text-[#9ba4bb] border-b-2 border-transparent'}`}>SIGN IN</div>
          <div onClick={() => toggleMode(true)} className={`flex-1 py-3.5 text-center text-[13px] font-bold tracking-[0.1em] uppercase cursor-pointer transition-all ${isSignupMode ? 'text-[#d4af37] border-b-2 border-[#d4af37] bg-white/50' : 'text-[#9ba4bb] border-b-2 border-transparent'}`}>SIGN UP</div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;