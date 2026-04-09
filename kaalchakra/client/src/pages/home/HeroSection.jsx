import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Star, Compass } from 'lucide-react';

// Note: Replace this with your actual Ganesha SVG import
import ganesha from '../../assets/ganesa.svg';

const HeroSection = () => {
  
  return (
    <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100">
      
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Subtle Mandala Pattern */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full border border-orange-100 opacity-30"></div>
        <div className="absolute top-40 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full border border-orange-100 opacity-40"></div>
        <div className="absolute top-60 left-1/2 -translate-x-1/2 w-[200px] h-[200px] rounded-full border border-orange-200 opacity-50"></div>
        
        {/* Floating Particles */}
        <div className="absolute top-20 left-[10%] animate-float-slow">
          <Star className="w-4 h-4 text-orange-300 opacity-40" />
        </div>
        <div className="absolute top-40 right-[15%] animate-float-medium">
          <Sparkles className="w-3 h-3 text-amber-300 opacity-40" />
        </div>
        <div className="absolute bottom-32 left-[20%] animate-float-fast">
          <Star className="w-5 h-5 text-orange-200 opacity-30" />
        </div>
        <div className="absolute bottom-40 right-[25%] animate-float-slow">
          <Sparkles className="w-4 h-4 text-amber-200 opacity-30" />
        </div>
        
        {/* Radial Gradient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-orange-200/20 to-amber-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-12 md:py-16 text-center">
        
        {/* Ganesha Icon / Image */}
        <div className="flex justify-center mb-8 md:mb-10">
          <div className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 relative">
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-amber-400/20 rounded-full blur-2xl animate-pulse"></div>
            {/* Icon Container */}
            <div className="relative w-full h-full bg-gradient-to-br from-orange-50 to-amber-50 rounded-full shadow-xl flex items-center justify-center border border-orange-200">
              <div className="w-24 h-40 md:w-28 md:h-40 lg:w-32 lg:h-55">
                <img src={ganesha} 
                className='w-full h-full object-cover'
                alt="Ganesha" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Title with Decorative Elements */}
        <div className="mb-6 md:mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-orange-300"></div>
            <span className="text-orange-400 text-xl">🕉️</span>
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-orange-300"></div>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-800 mb-4 leading-tight">
            ॐ गन् गणपत् र नमो नमः
          </h1>
          <div className="flex items-center justify-center gap-3">
            <div className="w-8 h-px bg-gradient-to-r from-transparent to-orange-200"></div>
            <span className="text-orange-300 text-sm">॥ श्री सिद्धि विनायक नमो नमः ॥</span>
            <div className="w-8 h-px bg-gradient-to-l from-transparent to-orange-200"></div>
          </div>
        </div>

        {/* Description Text */}
        <p className="text-gray-600 text-base sm:text-lg md:text-xl max-w-3xl mx-auto mb-10 md:mb-12 leading-relaxed">
          ॐ गन गणपतए नमो नमः श्री सिद्धि विनायक नमो नमः 
          अष्टविनायक नमो नमः गणपति बाप्पा मोरया
        </p>

        {/* CTA Button with Hover Effect */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/services"
            className="group inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold px-8 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            <span>Explore Services</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-white text-gray-700 font-medium px-8 py-3.5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-orange-200 transition-all duration-300"
          >
            <Compass className="w-4 h-4 text-orange-500" />
            <span>Consult Now</span>
          </Link>
        </div>

        {/* Trust Badges */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-wrap items-center justify-center gap-6 text-gray-500 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-400"></div>
              <span>50,000+ Happy Clients</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-400"></div>
              <span>25+ Years of Service</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-400"></div>
              <span>Certified Astrologers</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-400"></div>
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animation Styles */}
      <style jsx>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }
        @keyframes float-medium {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-5deg); }
        }
        @keyframes float-fast {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(8deg); }
        }
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
        .animate-float-medium {
          animation: float-medium 4s ease-in-out infinite;
        }
        .animate-float-fast {
          animation: float-fast 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default HeroSection;