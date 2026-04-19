// client/src/pages/NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Compass, Sparkles, Star } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-16 relative overflow-hidden">
      
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-orange-200/30 blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-amber-200/30 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-orange-100/50"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-orange-100/30"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full border border-orange-100/20"></div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        
        {/* Animated 404 Text */}
        <div className="relative mb-8">
          <h1 className="text-8xl md:text-9xl font-black bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 bg-clip-text text-transparent animate-pulse">
            404
          </h1>
          <div className="absolute -top-6 -right-6 animate-bounce">
            <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
          </div>
          <div className="absolute -bottom-4 -left-6 animate-ping opacity-50">
            <Sparkles className="w-6 h-6 text-orange-400" />
          </div>
        </div>

        {/* Error Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center shadow-lg">
            <Compass className="w-12 h-12 text-orange-500" strokeWidth={1.5} />
          </div>
        </div>

        {/* Error Message */}
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
          Lost in the Cosmos?
        </h2>
        <p className="text-gray-500 text-base md:text-lg max-w-md mx-auto mb-8">
          The page you're looking for seems to have drifted away into the cosmic void.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            <Home size={18} />
            Back to Home
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-700 font-semibold rounded-xl shadow-md border border-gray-200 hover:shadow-lg hover:border-orange-200 transition-all duration-300"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
        </div>

        {/* Helpful Links */}
        <div className="mt-10 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-400 mb-3">You might want to try:</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link to="/dashboard" className="text-sm text-orange-500 hover:text-orange-600 hover:underline transition">
              Dashboard
            </Link>
            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
            <Link to="/kundli" className="text-sm text-orange-500 hover:text-orange-600 hover:underline transition">
              Generate Kundli
            </Link>
            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
            <Link to="/horoscope" className="text-sm text-orange-500 hover:text-orange-600 hover:underline transition">
              Daily Horoscope
            </Link>
            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
            <Link to="/services" className="text-sm text-orange-500 hover:text-orange-600 hover:underline transition">
              Our Services
            </Link>
          </div>
        </div>

        {/* Cosmic Quote */}
        <div className="mt-10">
          <p className="text-xs text-gray-400 italic flex items-center justify-center gap-1">
            <Sparkles size={12} />
            "Not all who wander are lost... but this page definitely is!"
            <Sparkles size={12} />
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;