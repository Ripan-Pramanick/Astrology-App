import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, MessageCircle } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/services', label: 'Services' },
    { path: '/blog', label: 'Blog' },
    { path: '/kundli', label: 'Kundli' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-100">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold tracking-wide" style={{ color: '#1a2c4e' }}>
            ASTRO-VEDIC
          </Link>

          <div className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `text-gray-700 hover:text-accent transition-colors font-medium ${
                    isActive ? 'text-accent' : ''
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          <div className="hidden md:block">
            <button className="bg-accent text-primaryDark px-6 py-2 rounded-full hover:bg-accentDark transition flex items-center space-x-2 font-semibold">
              <MessageCircle size={18} />
              <span>CHAT NOW</span>
            </button>
          </div>

          <button
            className="md:hidden text-primary"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden mt-4 pb-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `block py-2 text-gray-700 hover:text-accent ${
                    isActive ? 'text-accent font-semibold' : ''
                  }`
                }
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
            <button className="mt-4 bg-accent text-primaryDark px-6 py-2 rounded-full w-full font-semibold">
              CHAT NOW
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;