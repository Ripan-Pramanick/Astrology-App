// client/src/components/common/Navbar.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Menu, X, User, LogOut, ChevronDown, ShieldCheck } from 'lucide-react';

// Gradient Text Component
const GradientText = ({ children, className = '' }) => {
  return (
    <span 
      className={className}
      style={{
        background: 'linear-gradient(135deg, #b8860b, #d4af37)',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: 'transparent',
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: 'clamp(1.25rem, 2vw, 1.5rem)',
        fontWeight: 'bold',
        letterSpacing: '0.1em'
      }}
    >
      {children}
    </span>
  );
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      {/* Custom Animations */}
      <style>{`
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.6; filter: blur(0px); }
          50% { opacity: 1; filter: blur(1px); }
        }
        @keyframes ping-slow {
          0%, 100% { transform: scale(1); opacity: 0.9; }
          50% { transform: scale(1.4); opacity: 0.4; }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
          transform-origin: center;
        }
        .animate-pulse-glow {
          animation: pulse-glow 3s ease-in-out infinite;
        }
        .animate-ping-slow {
          animation: ping-slow 2s ease-in-out infinite;
        }
      `}</style>

      <nav className="bg-white/95 backdrop-blur-md shadow-sm border-b border-[#cf9f4a]/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">

            {/* Logo & Brand Name */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-3 group hover:opacity-90 transition">
                <div className="relative w-10 h-10 md:w-12 md:h-12">
                  <svg viewBox="0 0 100 100" className="w-full h-full animate-spin-slow drop-shadow-lg">
                    <defs>
                      <linearGradient id="goldEdge" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FFD700" />
                        <stop offset="50%" stopColor="#F5A623" />
                        <stop offset="100%" stopColor="#FFD700" />
                      </linearGradient>
                      <radialGradient id="coreEnergy" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#FFE55C" stopOpacity="0.9" />
                        <stop offset="40%" stopColor="#F5A623" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="#B87333" stopOpacity="0" />
                      </radialGradient>
                    </defs>
                    <circle cx="50" cy="50" r="44" fill="none" stroke="url(#goldEdge)" strokeWidth="2.2" strokeDasharray="8 6" className="animate-pulse-glow" />
                    <circle cx="50" cy="50" r="22" fill="url(#coreEnergy)" className="animate-pulse" />
                    <circle cx="50" cy="48" r="3.2" fill="#1c0a2e" />
                    <circle cx="50" cy="48" r="1.5" fill="#FFEAA0" className="animate-ping-slow" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="inline-block text-2xl md:text-3xl font-bold tracking-wider" 
                    style={{ 
                      fontFamily: "'Cormorant Garamond', serif", 
                      background: "linear-gradient(to right, #b8860b, #d4af37)",
                      WebkitBackgroundClip: "text", 
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      color: "transparent"
                    }}>
                    Kaal Chakra
                  </span>
                  <span className="text-[10px] tracking-[0.2em] text-[#d4af37]/80 font-bold -mt-0.5">
                    TIME KNOWS YOUR DESTINY
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
              <Link to="/" className="text-slate-700 hover:text-[#d4af37] font-bold transition">Home</Link>
              <Link to="/about" className="text-slate-700 hover:text-[#d4af37] font-bold transition">About</Link>
              <div className="relative group">
                <button className="flex items-center gap-1 text-slate-700 hover:text-[#d4af37] font-bold transition py-5">
                  Services <ChevronDown size={16} className="group-hover:rotate-180 transition-transform duration-200" />
                </button>
                <div className="absolute left-0 top-full w-48 bg-white border border-[#cf9f4a]/20 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-left -translate-y-2 group-hover:translate-y-0">
                  <div className="py-2">
                    <Link to="/horoscope" className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-amber-50 hover:text-[#b8860b] font-semibold transition">Daily Horoscope</Link>
                    <Link to="/matchmaking" className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-amber-50 hover:text-[#b8860b] font-semibold transition">Match Making</Link>
                    <Link to="/panchang" className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-amber-50 hover:text-[#b8860b] font-semibold transition">Today's Panchang</Link>
                    <div className="mx-3 my-1 border-t border-[#cf9f4a]/20"></div>
                    <Link to="/services" className="block px-4 py-2.5 text-sm text-[#b8860b] font-bold transition">View All Services →</Link>
                  </div>
                </div>
              </div>
              <Link to="/kundli" className="text-slate-700 hover:text-[#d4af37] font-bold transition">Kundli</Link>
              <Link to="/contact" className="text-slate-700 hover:text-[#d4af37] font-bold transition">Contact</Link>

              {user ? (
                <div className="flex items-center gap-4 pl-4 border-l border-[#cf9f4a]/30">
                  <Link to={user?.role === 'admin' ? '/admin' : '/dashboard'} className="flex items-center gap-2 text-slate-700 hover:text-[#d4af37] transition">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center border border-[#cf9f4a]" style={{ backgroundImage: 'linear-gradient(to bottom right, #d4af37, #b8860b)' }}>
                      {user?.role === 'admin' ? <ShieldCheck size={16} className="text-white" /> : <User size={18} className="text-white" />}
                    </div>
                    <span className="font-bold text-sm">{user?.role === 'admin' ? 'Admin' : 'Dashboard'}</span>
                  </Link>
                  <button onClick={handleLogout} className="text-sm text-slate-500 hover:text-red-500 font-bold transition">Logout</button>
                </div>
              ) : (
                <div className="flex items-center gap-3 pl-2">
                  <Link to="/login" className="px-5 py-2 text-[#b8860b] font-bold hover:bg-amber-50 rounded-full transition">Login</Link>
                  <Link to="/register" className="px-6 py-2 text-white font-bold rounded-full shadow-md transition-all" style={{ backgroundImage: 'linear-gradient(to right, #d4af37, #e4b363)' }}>Sign Up</Link>
                </div>
              )}
            </div>

            {/* Mobile Actions (Login Button + Menu) */}
            <div className="md:hidden flex items-center gap-3">
              {/* ✅ Direct Login button for Mobile when not logged in */}
              {!user && (
                <Link 
                  to="/login" 
                  className="text-[11px] font-extrabold px-4 py-1.5 border-2 border-[#d4af37] text-[#b8860b] rounded-full hover:bg-[#d4af37] hover:text-white transition-all tracking-wider"
                >
                  LOGIN
                </Link>
              )}

              {/* ✅ Direct Dashboard icon for Mobile when logged in */}
              {user && (
                <Link to={user?.role === 'admin' ? '/admin' : '/dashboard'} className="w-8 h-8 rounded-full flex items-center justify-center border border-[#cf9f4a]" style={{ backgroundImage: 'linear-gradient(to bottom right, #d4af37, #b8860b)' }}>
                  {user?.role === 'admin' ? <ShieldCheck size={16} className="text-white" /> : <User size={16} className="text-white" />}
                </Link>
              )}

              <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600 hover:text-[#d4af37] transition p-1">
                {isOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-[#cf9f4a]/20 animate-in slide-in-from-top duration-300">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link to="/" className="block px-3 py-2 text-slate-700 font-bold hover:text-[#d4af37]" onClick={() => setIsOpen(false)}>Home</Link>
              <Link to="/about" className="block px-3 py-2 text-slate-700 font-bold hover:text-[#d4af37]" onClick={() => setIsOpen(false)}>About</Link>
              <div>
                <button onClick={() => setIsServicesOpen(!isServicesOpen)} className="flex items-center justify-between w-full px-3 py-2 text-slate-700 font-bold hover:text-[#d4af37]">
                  Services <ChevronDown size={20} className={`transform transition-transform duration-200 ${isServicesOpen ? 'rotate-180 text-[#d4af37]' : ''}`} />
                </button>
                {isServicesOpen && (
                  <div className="pl-6 pr-3 py-2 space-y-2 bg-amber-50/50 border-l-2 border-[#cf9f4a]/30 mx-3 mt-1 rounded-r-xl">
                    <Link to="/horoscope" className="block text-sm text-slate-600 font-bold hover:text-[#d4af37]" onClick={() => setIsOpen(false)}>Daily Horoscope</Link>
                    <Link to="/matchmaking" className="block text-sm text-slate-600 font-bold hover:text-[#d4af37]" onClick={() => setIsOpen(false)}>Match Making</Link>
                    <Link to="/panchang" className="block text-sm text-slate-600 font-bold hover:text-[#d4af37]" onClick={() => setIsOpen(false)}>Today's Panchang</Link>
                    <Link to="/services" className="block text-sm text-[#b8860b] font-bold" onClick={() => setIsOpen(false)}>All Services →</Link>
                  </div>
                )}
              </div>
              <Link to="/kundli" className="block px-3 py-2 text-slate-700 font-bold hover:text-[#d4af37]" onClick={() => setIsOpen(false)}>Kundli</Link>
              <Link to="/contact" className="block px-3 py-2 text-slate-700 font-bold hover:text-[#d4af37]" onClick={() => setIsOpen(false)}>Contact</Link>

              {user && (
                <div className="mt-4 pt-4 border-t border-[#cf9f4a]/20 px-3">
                  <button onClick={() => { handleLogout(); setIsOpen(false); }} className="w-full text-left flex items-center gap-2 text-red-500 font-bold py-2">
                    <LogOut size={20} /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;