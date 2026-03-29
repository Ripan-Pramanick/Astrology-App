import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, Twitter, Facebook, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white pt-16 pb-6 border-t border-gray-100 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Section: Logo + Contact Info */}
        <div className="flex flex-col md:flex-row justify-between items-center pb-12 mb-12 border-b border-gray-100">
          
          {/* Logo */}
          <div className="flex items-center space-x-3 mb-8 md:mb-0">
            <div className="w-14 h-14 rounded-full border border-gray-800 flex items-center justify-center bg-white overflow-hidden p-1">
              {/* আপনার লোগো এখানে বসান */}
              <img src="/vite.svg" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <span className="font-bold text-2xl tracking-wide text-black">ASTRO-VEDIC</span>
          </div>

          {/* Contact Details Grid */}
          <div className="flex flex-col sm:flex-row items-center gap-12">
            {/* Phone */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full border border-[#f98a2c] flex items-center justify-center text-[#f98a2c]">
                <Phone size={20} strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-[#f98a2c] text-sm mb-1">Phone</p>
                <p className="font-semibold text-lg text-gray-900">000 - 123456789</p>
              </div>
            </div>
            
            {/* Email */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full border border-[#f98a2c] flex items-center justify-center text-[#f98a2c]">
                <Mail size={20} strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-[#f98a2c] text-sm mb-1">Email id</p>
                <p className="font-semibold text-lg text-gray-900">info@example.com</p>
              </div>
            </div>
          </div>
          
        </div>

        {/* Main Footer Content: 3 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          
          {/* Column 1: About & Social */}
          <div className="md:pr-8 md:border-r border-gray-100">
            <p className="text-[#4b5563] text-[15px] leading-relaxed mb-8">
              Contact us for an in-depth analysis of your Kundali chart, tailored to your specific areas of concern. We ensure complete client confidentiality at all times.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full border border-[#f98a2c] flex items-center justify-center text-[#f98a2c] hover:bg-[#f98a2c] hover:text-white transition duration-300">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-[#f98a2c] flex items-center justify-center text-[#f98a2c] hover:bg-[#f98a2c] hover:text-white transition duration-300">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-[#f98a2c] flex items-center justify-center text-[#f98a2c] hover:bg-[#f98a2c] hover:text-white transition duration-300">
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* Column 2: Useful Links */}
          <div className="md:pl-8">
            <h3 className="text-2xl font-serif text-[#f98a2c] mb-6 tracking-wide">Useful Links</h3>
            <ul className="space-y-4">
              <li><Link to="/" className="text-[#4b5563] hover:text-[#f98a2c] transition text-[15px]">Home</Link></li>
              <li><Link to="/services" className="text-[#4b5563] hover:text-[#f98a2c] transition text-[15px]">Services</Link></li>
              <li><Link to="/about" className="text-[#4b5563] hover:text-[#f98a2c] transition text-[15px]">About Us</Link></li>
              <li><Link to="/contact" className="text-[#4b5563] hover:text-[#f98a2c] transition text-[15px]">Contact Us</Link></li>
            </ul>
          </div>

          {/* Column 3: Subscribe */}
          <div>
            <h3 className="text-2xl font-serif text-[#f98a2c] mb-6 tracking-wide">Subscribe</h3>
            <form className="flex flex-col gap-4">
              <input
                type="email"
                placeholder="Your Email"
                className="w-full px-4 py-3 rounded border border-gray-300 text-gray-800 focus:outline-none focus:border-[#f98a2c] placeholder-gray-500 font-serif"
              />
              <button 
                type="button" 
                className="w-full bg-[#f98a2c] text-black font-medium text-lg px-4 py-3 rounded hover:bg-orange-500 transition duration-300"
              >
                Send Message
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="border-t border-gray-800 mt-16 pt-6 flex justify-between items-center flex-col sm:flex-row">
          <p className="text-gray-900 text-sm font-medium tracking-wide">
            All Right Reserved © 2026 Vedic Jyotishe.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;