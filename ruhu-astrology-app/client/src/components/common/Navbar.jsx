import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Menu, X, User, LogOut, Star, ChevronDown } from 'lucide-react';


const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // States for Mobile Menu & Mobile Dropdown
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
    <nav className="bg-white/95 backdrop-blur-md shadow-sm border-b border-[#cf9f4a]/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">

          {/* 🕉️ Logo & Brand Name */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition">
              <div className="bg-gradient-to-tr from-[#d4af37] to-[#f4a460] p-1.5 rounded-lg shadow-[0_0_10px_rgba(212,175,55,0.3)]">
                <Star className="text-white w-6 h-6" fill="currentColor" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-[#b8860b] to-[#d4af37] bg-clip-text text-transparent">
                RUHU
              </span>
            </Link>
          </div>

          {/* 💻 Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <Link to="/" className="text-slate-700 hover:text-[#d4af37] font-bold transition">Home</Link>
            <Link to="/about" className="text-slate-700 hover:text-[#d4af37] font-bold transition">About</Link>
            
            {/* 🚀 Services Dropdown (Desktop hover) */}
            <div className="relative group">
              <button className="flex items-center gap-1 text-slate-700 hover:text-[#d4af37] font-bold transition py-5">
                Services <ChevronDown size={16} className="group-hover:rotate-180 transition-transform duration-200" />
              </button>
              
              {/* Dropdown Menu Items */}
              <div className="absolute left-0 top-full w-48 bg-white border border-[#cf9f4a]/20 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-left -translate-y-2 group-hover:translate-y-0">
                <div className="py-2">
                  <Link to="/horoscope" className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-amber-50 hover:text-[#b8860b] font-semibold transition">Daily Horoscope</Link>
                  <Link to="/compatibility" className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-amber-50 hover:text-[#b8860b] font-semibold transition">Match Making</Link>
                  <Link to="/panchang" className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-amber-50 hover:text-[#b8860b] font-semibold transition">Today's Panchang</Link>
                </div>
              </div>
            </div>

            <Link to="/kundli" className="text-slate-700 hover:text-[#d4af37] font-bold transition">Kundli</Link>
            <Link to="/contact" className="text-slate-700 hover:text-[#d4af37] font-bold transition">Contact</Link>

            {/* Auth Logic */}
            {user ? (
              <div className="flex items-center gap-4 pl-4 border-l border-[#cf9f4a]/30">
                <Link to="/dashboard" className="flex items-center gap-2 text-slate-700 hover:text-[#d4af37] cursor-pointer transition">
                  <div className="w-8 h-8 bg-amber-50 rounded-full flex items-center justify-center border border-[#cf9f4a]/40 shadow-sm">
                    <User size={18} className="text-[#b8860b]" />
                  </div>
                  <span className="font-bold text-sm text-[#b8860b]">{user.name || 'User'}</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-sm text-slate-500 hover:text-red-500 font-bold transition"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 pl-2">
                <Link
                  to="/login"
                  className="px-5 py-2 text-[#b8860b] font-bold hover:bg-amber-50 rounded-full transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2 bg-gradient-to-r from-[#d4af37] to-[#e4b363] text-white font-bold rounded-full hover:from-[#b8860b] hover:to-[#d4af37] shadow-[0_4px_10px_rgba(212,175,55,0.2)] hover:shadow-[0_6px_15px_rgba(212,175,55,0.3)] transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* 📱 Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600 hover:text-[#d4af37] transition">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* 📱 Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-[#cf9f4a]/20 animate-in slide-in-from-top duration-300">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="block px-3 py-2 text-slate-700 font-bold hover:text-[#d4af37]" onClick={() => setIsOpen(false)}>Home</Link>
            <Link to="/about" className="block px-3 py-2 text-slate-700 font-bold hover:text-[#d4af37]" onClick={() => setIsOpen(false)}>About</Link>
            
            {/* 🚀 Services Dropdown (Mobile Click) */}
            <div>
              <button 
                onClick={() => setIsServicesOpen(!isServicesOpen)} 
                className="flex items-center justify-between w-full px-3 py-2 text-slate-700 font-bold hover:text-[#d4af37]"
              >
                Services 
                <ChevronDown size={20} className={`transform transition-transform duration-200 ${isServicesOpen ? 'rotate-180 text-[#d4af37]' : ''}`} />
              </button>
              
              {/* Mobile Sub-menu Items */}
              {isServicesOpen && (
                <div className="pl-6 pr-3 py-2 space-y-2 bg-amber-50/50 border-l-2 border-[#cf9f4a]/30 mx-3 mt-1 rounded-r-xl">
                  <Link to="/horoscope" className="block text-sm text-slate-600 font-bold hover:text-[#d4af37]" onClick={() => setIsOpen(false)}>Daily Horoscope</Link>
                  <Link to="/compatibility" className="block text-sm text-slate-600 font-bold hover:text-[#d4af37]" onClick={() => setIsOpen(false)}>Match Making</Link>
                  <Link to="/panchang" className="block text-sm text-slate-600 font-bold hover:text-[#d4af37]" onClick={() => setIsOpen(false)}>Today's Panchang</Link>
                </div>
              )}
            </div>

            <Link to="/kundli" className="block px-3 py-2 text-slate-700 font-bold hover:text-[#d4af37]" onClick={() => setIsOpen(false)}>Kundli</Link>
            <Link to="/contact" className="block px-3 py-2 text-slate-700 font-bold hover:text-[#d4af37]" onClick={() => setIsOpen(false)}>Contact</Link>

            <div className="mt-4 pt-4 border-t border-[#cf9f4a]/20">
              {user ? (
                <div className="space-y-2 px-3">
                  <p className="text-[#cf9f4a] text-xs uppercase font-extrabold tracking-widest mb-1">Profile</p>

                  <Link
                    to="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 text-[#b8860b] font-bold py-2 hover:text-[#d4af37] cursor-pointer"
                  >
                    <User size={20} /> {user.name}
                  </Link>

                  <button onClick={handleLogout} className="w-full text-left flex items-center gap-2 text-slate-500 hover:text-red-500 font-bold py-2">
                    <LogOut size={20} /> Logout
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 px-3 py-2">
                  <Link
                    to="/login"
                    className="text-center py-2 border border-[#cf9f4a] text-[#b8860b] hover:bg-amber-50 rounded-lg font-bold transition"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="text-center py-2 bg-gradient-to-r from-[#d4af37] to-[#e4b363] text-white rounded-lg font-bold shadow-md transition"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;