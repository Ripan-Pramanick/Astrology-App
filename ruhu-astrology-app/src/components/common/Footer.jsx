import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Send } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-primary text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">ASTRO-VEDIC</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Contact us for an in-depth analysis of your Kundali chart, tailored to your specific areas of concern. We ensure complete client confidentiality at all times.
            </p>
            <div className="mt-4">
              <Mail size={18} className="inline mr-2" />
              <span className="text-sm">info@example.com</span>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Useful Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-accent transition text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-300 hover:text-accent transition text-sm">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-accent transition text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-accent transition text-sm">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Subscribe</h3>
            <div className="flex">
              <input
                type="email"
                placeholder="Your Email"
                className="flex-1 px-4 py-2 rounded-l-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <button className="bg-accent text-primaryDark px-4 py-2 rounded-r-lg hover:bg-accentDark transition font-semibold">
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400 text-sm">
          All Right Reserved © 2026 Vedic Jyotisha.
        </div>
      </div>
    </footer>
  );
};

export default Footer;