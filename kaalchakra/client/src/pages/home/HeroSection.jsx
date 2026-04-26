import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Star, Compass, Loader2 } from 'lucide-react';
import api from '../../services/api.js';


// Note: Replace this with your actual Ganesha SVG import
import ganesha from '../../assets/ganesa.svg';
import Aries from '../../assets/images/Aries.webp';
import Taurus from '../../assets/images/Taurus.webp';
import Gemini from '../../assets/images/Gemini.webp';
import Cancer from '../../assets/images/Cancer.webp';
import Leo from '../../assets/images/Leo.webp';
import Virgo from '../../assets/images/Virgo.webp';
import Libra from '../../assets/images/Libra.webp';
import Scorpio from '../../assets/images/Scorpio.webp';
import Sagittarius from '../../assets/images/Sagittarius.webp';
import Capricorn from '../../assets/images/Capricorn.webp';
import Aquarius from '../../assets/images/Aquarius.webp';
import Pisces from '../../assets/images/Pisces.webp';

// Zodiac Images with their details
const zodiacImages = [
  { name: 'Aries', image: Aries, color: '#F97316', icon: '♈', angle: 0 },
  { name: 'Taurus', image: Taurus, color: '#22C55E', icon: '♉', angle: 30 },
  { name: 'Gemini', image: Gemini, color: '#EAB308', icon: '♊', angle: 60 },
  { name: 'Cancer', image: Cancer, color: '#6B7280', icon: '♋', angle: 90 },
  { name: 'Leo', image: Leo, color: '#EA580C', icon: '♌', angle: 120 },
  { name: 'Virgo', image: Virgo, color: '#CA8A04', icon: '♍', angle: 150 },
  { name: 'Libra', image: Libra, color: '#EC4899', icon: '♎', angle: 180 },
  { name: 'Scorpio', image: Scorpio, color: '#E11D48', icon: '♏', angle: 210 },
  { name: 'Sagittarius', image: Sagittarius, color: '#A855F7', icon: '♐', angle: 240 },
  { name: 'Capricorn', image: Capricorn, color: '#475569', icon: '♑', angle: 270 },
  { name: 'Aquarius', image: Aquarius, color: '#0EA5E9', icon: '♒', angle: 300 },
  { name: 'Pisces', image: Pisces, color: '#14B8A6', icon: '♓', angle: 330 }
];

const HeroSection = () => {
  const [heroData, setHeroData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    happyClients: '50,000+',
    yearsOfService: '25+',
    certifiedAstrologers: 'Certified',
    support: '24/7'
  });
  const [activeZodiac, setActiveZodiac] = useState(null);

  useEffect(() => {
    fetchHeroData();
    fetchStats();
  }, []);

  const fetchHeroData = async () => {
    try {
      const response = await api.get('/hero');
      if (response.data.success) {
        setHeroData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching hero data:', error);
      // Use fallback data if API fails
      setHeroData({
        title: "ॐ गन् गणपत् र नमो नमः",
        subtitle: "॥ श्री सिद्धि विनायक नमो नमः ॥",
        description: "ॐ गन गणपतए नमो नमः श्री सिद्धि विनायक नमो नमः अष्टविनायक नमो नमः गणपति बाप्पा मोरया",
        buttonText: "Explore Services",
        buttonLink: "/services",
        secondaryButtonText: "Consult Now",
        secondaryButtonLink: "/contact"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/hero/stats');
      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Keep default stats
    }
  };

  if (loading) {
    return (
      <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading cosmic energy...</p>
        </div>
      </div>
    );
  }

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

        {/* ✨ NEW: Zodiac Wheel Decoration */}
        <div className="absolute right-5 top-1/2 -translate-y-1/2 hidden xl:block">
          <div className="relative w-[300px] h-[300px] animate-spin-slow">
            {zodiacImages.map((zodiac, idx) => (
              <div
                key={idx}
                // bg-center bg-cover এখান থেকে সরিয়ে দেওয়া হয়েছে কারণ এখানে ব্যাকগ্রাউন্ড ইমেজ নেই
                className="absolute w-12 h-12 rounded-full bg-white/90 shadow-lg flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 hover:shadow-xl zodiac-item p-1"
                style={{
                  transform: `rotate(${zodiac.angle}deg) translateX(140px)`,
                  transformOrigin: 'center',
                  top: '50%',
                  left: '50%',
                  marginTop: '-24px',
                  marginLeft: '-24px',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={() => setActiveZodiac(zodiac.name)}
                onMouseLeave={() => setActiveZodiac(null)}
              >
                <img
                  src={zodiac.image}
                  alt={zodiac.name}
                  // এখানে object-cover এবং object-center যোগ করা হয়েছে
                  className="w-full h-full object-cover object-center rounded-full"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <span
                  className="text-xl hidden"
                  style={{ display: 'none' }}
                >
                  {zodiac.icon}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ✨ NEW: Left side floating zodiac icons */}
        <div className="absolute left-5 top-1/2 -translate-y-1/2 hidden xl:block">
          <div className="flex flex-col gap-3">
            {zodiacImages.slice(0, 6).map((zodiac, idx) => (
              <div
                key={idx}
                // এখানে p-[2px] যোগ করা হয়েছে যাতে ইমেজের বাইরে হালকা বর্ডার গ্যাপ থাকে
                className="w-10 h-10 rounded-full bg-white/80 shadow-md flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 hover:bg-white zodiac-icon p-[2px]"
                style={{ borderLeft: `3px solid ${zodiac.color}` }}
              >
                <img
                  src={zodiac.image}
                  alt={zodiac.name}
                  // আগের w-6 h-6 object-contain সরিয়ে নতুন ক্লাস দেওয়া হলো
                  className="w-full h-full object-cover object-center rounded-full"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="absolute right-5 bottom-10 hidden xl:block">
          <div className="flex flex-col gap-3">
            {zodiacImages.slice(6, 12).map((zodiac, idx) => (
              <div
                key={idx}
                // এখানে p-[2px] যোগ করা হয়েছে ইমেজের বাইরে হালকা বর্ডার গ্যাপ রাখার জন্য
                className="w-10 h-10 rounded-full bg-white/80 shadow-md flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 hover:bg-white zodiac-icon p-[2px]"
                style={{ borderRight: `3px solid ${zodiac.color}` }}
              >
                <img
                  src={zodiac.image}
                  alt={zodiac.name}
                  // আগের w-6 h-6 object-contain সরিয়ে object-cover করে দেওয়া হলো
                  className="w-full h-full object-cover object-center rounded-full"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-12 md:py-16 text-center">

        {/* Ganesha Icon / Image */}
        <div className="flex justify-center mb-8 md:mb-10">
          <div className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 relative group">
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-amber-400/20 rounded-full blur-2xl animate-pulse"></div>
            {/* Icon Container */}
            <div className="relative w-full h-full bg-gradient-to-br from-orange-50 to-amber-50 rounded-full shadow-xl flex items-center justify-center border border-orange-200 transition-all duration-300 group-hover:scale-105">
              <div className="w-24 h-40 md:w-28 md:h-40 lg:w-32 lg:h-55">
                <img
                  src={ganesha}
                  className='w-full h-full object-cover'
                  alt="Ganesha"
                />
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
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-800 mb-4 leading-tight bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
            {heroData?.title || "ॐ गन् गणपत् र नमो नमः"}
          </h1>
          <div className="flex items-center justify-center gap-3">
            <div className="w-8 h-px bg-gradient-to-r from-transparent to-orange-200"></div>
            <span className="text-orange-300 text-sm">
              {heroData?.subtitle || "॥ श्री सिद्धि विनायक नमो नमः ॥"}
            </span>
            <div className="w-8 h-px bg-gradient-to-l from-transparent to-orange-200"></div>
          </div>
        </div>

        {/* Description Text */}
        <p className="text-gray-600 text-base sm:text-lg md:text-xl max-w-3xl mx-auto mb-10 md:mb-12 leading-relaxed">
          {heroData?.description || "ॐ गन गणपतए नमो नमः श्री सिद्धि विनायक नमो नमः अष्टविनायक नमो नमः गणपति बाप्पा मोरया"}
        </p>

        {/* Active Zodiac Tooltip */}
        {activeZodiac && (
          <div className="fixed top-20 right-20 z-50 bg-black/80 text-white px-3 py-1.5 rounded-full text-sm animate-fade-in">
            {activeZodiac}
          </div>
        )}

        {/* CTA Button with Hover Effect */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to={heroData?.buttonLink || "/services"}
            className="group inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold px-8 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            <span>{heroData?.buttonText || "Explore Services"}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to={heroData?.secondaryButtonLink || "/contact"}
            className="inline-flex items-center gap-2 bg-white text-gray-700 font-medium px-8 py-3.5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-orange-200 transition-all duration-300"
          >
            <Compass className="w-4 h-4 text-orange-500" />
            <span>{heroData?.secondaryButtonText || "Consult Now"}</span>
          </Link>
        </div>

        {/* Trust Badges - Now from Database */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-wrap items-center justify-center gap-6 text-gray-500 text-sm">
            <div className="flex items-center gap-2 group hover:text-orange-500 transition-colors">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-400 group-hover:scale-150 transition-transform"></div>
              <span>{stats.happyClients} Happy Clients</span>
            </div>
            <div className="flex items-center gap-2 group hover:text-orange-500 transition-colors">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-400 group-hover:scale-150 transition-transform"></div>
              <span>{stats.yearsOfService} Years of Service</span>
            </div>
            <div className="flex items-center gap-2 group hover:text-orange-500 transition-colors">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-400 group-hover:scale-150 transition-transform"></div>
              <span>{stats.certifiedAstrologers} Astrologers</span>
            </div>
            <div className="flex items-center gap-2 group hover:text-orange-500 transition-colors">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-400 group-hover:scale-150 transition-transform"></div>
              <span>{stats.support} Support</span>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animation Styles */}
      <style>{`
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
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
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
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        .zodiac-icon {
          transition: all 0.3s ease;
        }
        .zodiac-icon:hover {
          transform: scale(1.1);
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
        }
        .zodiac-item {
          transition: all 0.3s ease;
        }
        .zodiac-item:hover {
          transform: scale(1.2) rotate(0deg) !important;
          z-index: 50;
        }
      `}</style>
    </div>
  );
};

export default HeroSection;