// client/src/pages/AuthPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Eye, EyeOff, Mail, Lock, User, Star, Sparkles, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from '../firebase.js';
import api from '../services/api';

const AuthPage = () => {
  const { t } = useTranslation('pages'); // <-- Hook initialized
  const navigate = useNavigate();
  // ... (সমস্ত স্টেট আগের মতোই থাকবে) ...

  const handleLogin = async (e) => {
    // ... (logic)
    try {
      if (!loginId || !loginPassword) throw new Error(t('auth.errors.fillAll'));
      
      const isPhone = /^[0-9+\-\s]+$/.test(loginId);
      if (isPhone) {
        setError('Phone number login is coming soon! Please use your Email to login for now.');
        setLoading(false);
        return;
      }
      // ... (firebase login)
    } catch (err) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') setError(t('auth.errors.noAccount'));
      else if (err.code === 'auth/invalid-email') setError(t('auth.errors.invalidEmail'));
      else setError(err.message || 'Login failed.');
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    // ... (logic)
    try {
      if (!regName || !regEmail || !regPhone || !regPassword || !confirmPassword) throw new Error(t('auth.errors.fillAll'));
      if (regPassword !== confirmPassword) throw new Error(t('auth.errors.passwordMismatch'));
      if (regPassword.length < 6) throw new Error(t('auth.errors.passwordLength'));
      // ... (firebase reg)
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') setError(t('auth.errors.emailInUse'));
      else if (err.code === 'auth/invalid-email') setError(t('auth.errors.invalidEmail'));
      else if (err.code === 'auth/weak-password') setError(t('auth.errors.passwordLength'));
      else setError(err.message || 'Registration failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center font-sans overflow-auto py-8 px-4" style={{ background: 'linear-gradient(135deg, #fdfbfb 0%, #f3efe6 100%)' }}>
      {/* ... (Stars background) ... */}

      <div ref={authBoxRef} className={`auth-box w-[min(880px,96vw)] h-[650px] md:h-[clamp(400px,85vh,620px)] rounded-[clamp(16px,2.5vw,28px)] relative z-10 overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] ${isSignupMode ? 'signup-mode' : ''}`} style={{ background: '#e8edf4' }}>
        
        {/* ... (Divider Line) ... */}

        {/* Panel A - Form Panel */}
        <div ref={pARef} className="absolute top-0 h-full transition-all duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] z-[1] w-full max-md:!left-0 md:w-[60%]" style={{ left: isSignupMode ? '40%' : '0%' }}>
          
          {/* Login Form */}
          <div className={`p-inner absolute inset-0 flex flex-col items-center justify-center p-[clamp(20px,4.5vh,48px)] max-md:pt-16 ${isSignupMode ? 'hidden' : 'flex'}`}>
            <div className="fp-title text-[clamp(17px,2.6vw,26px)] font-bold text-[#1e2545] tracking-[0.18em] mb-[clamp(12px,2.5vh,22px)] flex items-center gap-2">
              <span className="text-[#d4af37]">✨</span> {t('auth.welcomeBack')} <span className="text-[#d4af37]">✨</span>
            </div>
            <div className="social-hint text-[11px] text-[#9ba4bb] tracking-[0.05em] mb-[clamp(10px,2vh,20px)]">{t('auth.connectEnergy')}</div>
            <form onSubmit={handleLogin} className="w-full mt-4">
              <div className="field w-full mb-[clamp(8px,1.5vh,14px)] relative">
                <input type="text" value={loginId} onChange={(e) => setLoginId(e.target.value)} placeholder={t('auth.emailPhone')} className="..." required />
              </div>
              <div className="field w-full mb-[clamp(8px,1.5vh,14px)] relative">
                <input type={showPassword ? "text" : "password"} value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder={t('auth.password')} className="..." required />
              </div>
              <span onClick={() => navigate('/forgot-password')} className="forgot text-[12px] text-[#9ba4bb] underline cursor-pointer mt-1 mb-[clamp(12px,2vh,20px)] block text-center hover:text-[#d4af37]">
                {t('auth.forgotPassword')}
              </span>
              {/* Error and submit button... */}
              <button type="submit" className="...">
                {loading && !isSignupMode ? <div className="spinner"></div> : t('auth.signIn')}
              </button>
            </form>
          </div>

          {/* Register Form */}
          <div className={`p-inner absolute inset-0 flex flex-col items-center justify-center p-[clamp(20px,4.5vh,48px)] max-md:pt-16 ${isSignupMode ? 'flex' : 'hidden'}`}>
            <div className="fp-title text-[clamp(17px,2.6vw,26px)] font-bold text-[#1e2545] tracking-[0.18em] mb-[clamp(8px,1.5vh,12px)] flex items-center gap-2">
              <span className="text-[#d4af37]">🌟</span> {t('auth.createAccount')} <span className="text-[#d4af37]">🌟</span>
            </div>
            <div className="social-hint text-[11px] text-[#9ba4bb] tracking-[0.05em] mb-[clamp(8px,1.5vh,12px)]">{t('auth.beginJourney')}</div>
            <form onSubmit={handleRegister} className="w-full mt-2">
               <div className="field w-full mb-[clamp(6px,1.2vh,10px)] relative">
                <input type="text" value={regName} onChange={(e) => setRegName(e.target.value)} placeholder={t('auth.fullName')} className="..." required />
              </div>
              <div className="field w-full mb-[clamp(6px,1.2vh,10px)] relative">
                <input type="email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} placeholder={t('auth.email')} className="..." required />
              </div>
               <div className="field w-full mb-[clamp(6px,1.2vh,10px)] relative">
                <input type="tel" value={regPhone} onChange={(e) => setRegPhone(e.target.value)} placeholder={t('auth.phone')} className="..." required />
              </div>
              <div className="field w-full mb-[clamp(6px,1.2vh,10px)] relative">
                <input type="password" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} placeholder={t('auth.password')} className="..." required />
              </div>
              <div className="field w-full mb-[clamp(8px,2vh,14px)] relative">
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder={t('auth.confirmPassword')} className="..." required />
              </div>
              {/* Error and submit button... */}
              <button type="submit" className="...">
                {loading && isSignupMode ? <div className="spinner"></div> : t('auth.signUp')}
              </button>
            </form>
          </div>
        </div>

        {/* Panel B - Overlay Panel */}
        <div ref={pBRef} className="absolute top-0 w-[40%] h-full transition-all duration-700 max-md:hidden" style={{ left: isSignupMode ? '0%' : '60%' }}>
          {/* Hello Friend (Login Mode) */}
          <div className={`p-inner absolute inset-0 flex flex-col items-center justify-center text-center p-[clamp(20px,4.5vh,52px)] ${isSignupMode ? 'opacity-0' : 'opacity-100'}`}>
            <div className="o-title font-bold text-[#1e2545] mb-2">{t('auth.helloFriend')}</div>
            <div className="o-sub text-[12px] text-[#9ba4bb] mb-6">{t('auth.helloDesc')}</div>
            <button onClick={() => toggleMode(true)} className="btn-blue py-3 px-8 rounded-full text-white">{t('auth.signUp')}</button>
          </div>

          {/* Welcome Back (Register Mode) */}
          <div className={`p-inner absolute inset-0 flex flex-col items-center justify-center text-center p-[clamp(20px,4.5vh,52px)] ${isSignupMode ? 'opacity-100' : 'opacity-0'}`}>
            <div className="o-title font-bold text-[#1e2545] mb-2">{t('auth.welcomeBackTitle')}</div>
            <div className="o-sub text-[12px] text-[#9ba4bb] mb-6">{t('auth.welcomeBackDesc')}</div>
            <button onClick={() => toggleMode(false)} className="btn-blue py-3 px-8 rounded-full text-white">{t('auth.signIn')}</button>
          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="mobile-nav md:hidden absolute top-0 left-0 right-0 flex bg-[#e8edf4] rounded-t-[16px] z-20">
          <div onClick={() => toggleMode(false)} className={`flex-1 py-3.5 text-center ${!isSignupMode ? 'text-[#d4af37]' : 'text-[#9ba4bb]'}`}>{t('auth.signIn')}</div>
          <div onClick={() => toggleMode(true)} className={`flex-1 py-3.5 text-center ${isSignupMode ? 'text-[#d4af37]' : 'text-[#9ba4bb]'}`}>{t('auth.signUp')}</div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;