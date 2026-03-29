// client/src/components/Navbar.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Menu, X, User, LogOut, Star } from 'lucide-react'; // আইকনের জন্য

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="bg-white shadow-md border-b border-orange-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* 🕉️ Logo & Brand Name */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-[#f98a2c] p-1.5 rounded-lg">
                <Star className="text-white w-6 h-6" fill="currentColor" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-[#f98a2c] to-orange-600 bg-clip-text text-transparent">
                RUHU
              </span>
            </Link>
          </div>

          {/* 💻 Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-[#f98a2c] font-medium transition">Home</Link>
            <Link to="/kundli" className="text-gray-700 hover:text-[#f98a2c] font-medium transition">Kundli</Link>
            <Link to="/horoscope" className="text-gray-700 hover:text-[#f98a2c] font-medium transition">Horoscope</Link>
            
            {/* Auth Logic */}
            {user ? (
              <div className="flex items-center gap-4 pl-4 border-l border-gray-200">
                <div className="flex items-center gap-2 text-gray-700">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center border border-orange-200">
                    <User size={18} className="text-[#f98a2c]" />
                  </div>
                  <span className="font-semibold text-sm">{user.name || 'User'}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700 font-medium transition"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link 
                  to="/login" 
                  className="px-5 py-2 text-[#f98a2c] font-semibold hover:bg-orange-50 rounded-full transition"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="px-6 py-2 bg-[#f98a2c] text-white font-bold rounded-full hover:bg-orange-600 shadow-sm hover:shadow-md transition"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* 📱 Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 hover:text-[#f98a2c]">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* 📱 Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 animate-in slide-in-from-top duration-300">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="block px-3 py-2 text-gray-700 font-medium" onClick={() => setIsOpen(false)}>Home</Link>
            <Link to="/kundli" className="block px-3 py-2 text-gray-700 font-medium" onClick={() => setIsOpen(false)}>Kundli</Link>
            <Link to="/horoscope" className="block px-3 py-2 text-gray-700 font-medium" onClick={() => setIsOpen(false)}>Horoscope</Link>
            
            <div className="mt-4 pt-4 border-t border-gray-100">
              {user ? (
                <div className="space-y-2 px-3">
                  <p className="text-gray-500 text-xs uppercase font-bold tracking-wider">Profile</p>
                  <div className="flex items-center gap-2 text-[#f98a2c] font-bold py-2">
                    <User size={20} /> {user.name}
                  </div>
                  <button onClick={handleLogout} className="w-full text-left flex items-center gap-2 text-red-500 py-2">
                    <LogOut size={20} /> Logout
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 px-3 py-2">
                  <Link 
                    to="/login" 
                    className="text-center py-2 border border-[#f98a2c] text-[#f98a2c] rounded-md font-bold"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="text-center py-2 bg-[#f98a2c] text-white rounded-md font-bold"
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