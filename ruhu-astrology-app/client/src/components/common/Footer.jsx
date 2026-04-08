import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, Twitter, Facebook, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <>
      <footer className="bg-white pt-16 pb-6 border-t border-[#cf9f4a]/30 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Top Section: Logo + Contact Info */}
          <div className="flex flex-col md:flex-row justify-between items-center pb-12 mb-12 border-b border-[#cf9f4a]/20">
            
            {/* 🌌 Kaal Chakra Logo & Brand Name */}
            <div className="flex flex-col items-center md:items-start mb-8 md:mb-0 group cursor-pointer hover:opacity-90 transition">
              <div className="flex items-center gap-3">
                {/* SVG Cosmic Logo from Navbar */}
                <div className="relative w-12 h-12">
                  <svg viewBox="0 0 100 100" className="w-full h-full animate-spin-slow drop-shadow-lg">
                    <defs>
                      <linearGradient id="goldEdgeFooter" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FFD700" />
                        <stop offset="50%" stopColor="#F5A623" />
                        <stop offset="100%" stopColor="#FFD700" />
                      </linearGradient>
                      <radialGradient id="coreEnergyFooter" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#FFE55C" stopOpacity="0.9" />
                        <stop offset="40%" stopColor="#F5A623" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="#B87333" stopOpacity="0" />
                      </radialGradient>
                      <filter id="goldGlowFooter" x="-30%" y="-30%" width="160%" height="160%">
                        <feGaussianBlur stdDeviation="2.5" result="blur" />
                        <feMerge>
                          <feMergeNode in="blur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>
                    <circle cx="50" cy="50" r="44" fill="none" stroke="url(#goldEdgeFooter)" strokeWidth="2.2" strokeDasharray="8 6" filter="url(#goldGlowFooter)" className="animate-pulse-glow" />
                    <circle cx="50" cy="50" r="37" fill="none" stroke="url(#goldEdgeFooter)" strokeWidth="1.2" strokeOpacity="0.5" />
                    <g fill="#FFD700" opacity="0.9">
                      <circle cx="50" cy="8" r="1.8" /><circle cx="76.5" cy="17.5" r="1.8" /><circle cx="92" cy="42" r="1.8" />
                      <circle cx="92" cy="58" r="1.8" /><circle cx="76.5" cy="82.5" r="1.8" /><circle cx="50" cy="92" r="1.8" />
                      <circle cx="23.5" cy="82.5" r="1.8" /><circle cx="8" cy="58" r="1.8" /><circle cx="8" cy="42" r="1.8" />
                      <circle cx="23.5" cy="17.5" r="1.8" /><circle cx="35" cy="9" r="1.6" /><circle cx="65" cy="9" r="1.6" />
                    </g>
                    <circle cx="50" cy="50" r="22" fill="url(#coreEnergyFooter)" className="animate-pulse" />
                    <ellipse cx="50" cy="48" rx="8" ry="5.5" fill="#FFD700" opacity="0.9" />
                    <circle cx="50" cy="48" r="3.2" fill="#1c0a2e" />
                    <circle cx="50" cy="48" r="1.5" fill="#FFEAA0" className="animate-ping-slow" />
                  </svg>
                </div>
                
                {/* Brand Text */}
                <div className="flex flex-col">
                  <span className="text-2xl md:text-3xl font-bold tracking-wider bg-gradient-to-r from-[#b8860b] to-[#d4af37] bg-clip-text text-transparent" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    Kaal Chakra
                  </span>
                  <span className="text-[10px] tracking-[0.2em] text-[#d4af37]/80 font-bold -mt-0.5">
                    TIME KNOWS YOUR DESTINY
                  </span>
                </div>
              </div>
            </div>

            {/* Contact Details Grid */}
            <div className="flex flex-col sm:flex-row items-center gap-12 mt-6 md:mt-0">
              {/* Phone */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full border border-[#cf9f4a]/40 bg-amber-50 flex items-center justify-center text-[#b8860b]">
                  <Phone size={20} strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-[#b8860b] font-semibold text-sm mb-1 uppercase tracking-wider">Phone</p>
                  <p className="font-bold text-lg text-slate-700">000 - 123456789</p>
                </div>
              </div>
              
              {/* Email */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full border border-[#cf9f4a]/40 bg-amber-50 flex items-center justify-center text-[#b8860b]">
                  <Mail size={20} strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-[#b8860b] font-semibold text-sm mb-1 uppercase tracking-wider">Email Id</p>
                  <p className="font-bold text-lg text-slate-700">info@kaalchakra.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Footer Content: 3 Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            
            {/* Column 1: About & Social */}
            <div className="md:pr-8 md:border-r border-[#cf9f4a]/20">
              <p className="text-slate-600 font-medium text-[15px] leading-relaxed mb-8">
                Contact us for an in-depth analysis of your Kundali chart, tailored to your specific areas of concern. We ensure complete client confidentiality at all times.
              </p>
              <div className="flex gap-4 justify-center md:justify-start">
                <a href="#" className="w-10 h-10 rounded-full border border-[#cf9f4a]/60 bg-amber-50 flex items-center justify-center text-[#b8860b] hover:bg-[#d4af37] hover:text-white hover:border-[#d4af37] transition duration-300 shadow-sm">
                  <Twitter size={18} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full border border-[#cf9f4a]/60 bg-amber-50 flex items-center justify-center text-[#b8860b] hover:bg-[#d4af37] hover:text-white hover:border-[#d4af37] transition duration-300 shadow-sm">
                  <Facebook size={18} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full border border-[#cf9f4a]/60 bg-amber-50 flex items-center justify-center text-[#b8860b] hover:bg-[#d4af37] hover:text-white hover:border-[#d4af37] transition duration-300 shadow-sm">
                  <Instagram size={18} />
                </a>
              </div>
            </div>

            {/* Column 2: Useful Links */}
            <div className="md:pl-8 text-center md:text-left">
              <h3 className="text-2xl text-[#b8860b] mb-6 tracking-wide font-bold" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Useful Links</h3>
              <ul className="space-y-4">
                <li><Link to="/" className="text-slate-600 hover:text-[#d4af37] font-semibold transition text-[15px]">Home</Link></li>
                <li><Link to="/services" className="text-slate-600 hover:text-[#d4af37] font-semibold transition text-[15px]">Services</Link></li>
                <li><Link to="/about" className="text-slate-600 hover:text-[#d4af37] font-semibold transition text-[15px]">About Us</Link></li>
                <li><Link to="/contact" className="text-slate-600 hover:text-[#d4af37] font-semibold transition text-[15px]">Contact Us</Link></li>
              </ul>
            </div>

            {/* Column 3: Subscribe */}
            <div>
              <h3 className="text-2xl text-[#b8860b] mb-6 tracking-wide font-bold text-center md:text-left" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Subscribe</h3>
              <form className="flex flex-col gap-4">
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full px-4 py-3 rounded-xl border border-[#cf9f4a]/40 text-slate-700 bg-amber-50/30 focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] placeholder-slate-400 transition"
                />
                <button 
                  type="button" 
                  className="w-full bg-gradient-to-r from-[#d4af37] to-[#e4b363] text-white font-bold text-lg px-4 py-3 rounded-xl hover:from-[#b8860b] hover:to-[#d4af37] shadow-[0_4px_10px_rgba(212,175,55,0.2)] transition-all duration-300"
                >
                  Subscribe Now
                </button>
              </form>
            </div>

          </div>

          {/* Bottom Copyright */}
          <div className="border-t border-[#cf9f4a]/20 mt-16 py-6 flex justify-center items-center">
            <p className="text-slate-500 text-sm font-semibold tracking-wide">
              All Rights Reserved © {new Date().getFullYear()} Kaal Chakra.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;