import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Star, Compass, Loader2 } from 'lucide-react';
import api from '../../services/api.js';
import { useTranslation } from 'react-i18next'; // <-- i18n Hook

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
  const { t } = useTranslation('hero'); // <-- 'hero.json' থেকে ডেটা নিবে
  
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
      // Fallback data is handled in the render using t()
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
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#fef9f0] via-[#fff5e6] to-[#fdf2e9]">
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Large pulsing glow orbs */}
          <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-orange-300/20 to-amber-300/15 blur-[100px] animate-pulse"
            style={{ animationDuration: '4s' }} />
          <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-gradient-to-tl from-amber-300/20 to-orange-300/15 blur-[100px] animate-pulse"
            style={{ animationDuration: '5s', animationDelay: '1s' }} />
          <div className="absolute top-[40%] left-[30%] w-[300px] h-[300px] rounded-full bg-gradient-to-br from-yellow-200/15 to-orange-200/15 blur-[80px] animate-pulse"
            style={{ animationDuration: '6s', animationDelay: '2s' }} />
          
          {/* Floating particles */}
          {[...Array(20)].map((_, i) => (
            <div key={i}
              className="absolute rounded-full"
              style={{
                width: Math.random() * 4 + 2 + 'px',
                height: Math.random() * 4 + 2 + 'px',
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                background: i % 3 === 0 ? '#f97316' : i % 3 === 1 ? '#eab308' : '#fbbf24',
                opacity: Math.random() * 0.4 + 0.1,
                animation: `floatLoading ${Math.random() * 6 + 4}s infinite ease-in-out`,
                animationDelay: Math.random() * 3 + 's',
                boxShadow: i % 3 === 0 
                  ? '0 0 10px rgba(249,115,22,0.4)' 
                  : i % 3 === 1 
                  ? '0 0 10px rgba(234,179,8,0.4)' 
                  : '0 0 10px rgba(251,191,36,0.4)',
              }}
            />
          ))}
        </div>

        {/* Main Loading Content */}
        <div className="relative z-10 flex flex-col items-center justify-center">
          
          {/* Outer rotating ring */}
          <div className="relative mb-8">
            {/* Ring 1 - Outermost */}
            <div className="w-40 h-40 md:w-48 md:h-48 rounded-full border-2 border-orange-200/50 animate-spin-slow"
              style={{ animationDuration: '12s' }} />
            
            {/* Ring 2 */}
            <div className="absolute inset-2 rounded-full border-2 border-dashed border-orange-300/60 animate-spin-slow"
              style={{ animationDuration: '8s', animationDirection: 'reverse' }} />
            
            {/* Ring 3 - Innermost */}
            <div className="absolute inset-4 rounded-full border-2 border-amber-300/70 animate-spin-slow"
              style={{ animationDuration: '6s' }} />
            
            {/* Ring 4 - Thick accent */}
            <div className="absolute inset-6 rounded-full border-3 border-t-orange-400 border-r-amber-400 border-b-orange-400 border-l-transparent animate-spin"
              style={{ animationDuration: '2s', boxShadow: '0 0 20px rgba(249,115,22,0.2)' }} />
            
            {/* Center icon container */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center shadow-lg animate-pulse"
                style={{ boxShadow: '0 0 30px rgba(249,115,22,0.2), 0 0 60px rgba(234,179,8,0.1)' }}>
                <span className="text-3xl md:text-4xl animate-bounce-gentle">🕉️</span>
              </div>
            </div>
            
            {/* Orbiting dots */}
            {[...Array(4)].map((_, i) => (
              <div key={i}
                className="absolute w-3 h-3 rounded-full bg-orange-400 animate-orbit"
                style={{
                  top: `${50 + 45 * Math.sin(i * 90 * Math.PI / 180)}%`,
                  left: `${50 + 45 * Math.cos(i * 90 * Math.PI / 180)}%`,
                  animationDuration: `${3 + i * 0.5}s`,
                  animationDelay: `${i * 0.75}s`,
                  boxShadow: '0 0 15px rgba(249,115,22,0.5), 0 0 25px rgba(249,115,22,0.3)',
                }}
              />
            ))}
          </div>

          {/* Loading text with shimmer effect */}
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500 bg-clip-text text-transparent mb-2"
              style={{ 
                backgroundSize: '200% 200%',
                animation: 'shimmer 3s ease infinite'
              }}>
              {t('awakeningEnergy', 'Awakening Cosmic Energy')}
            </h2>
            <p className="text-gray-500 text-sm md:text-base font-medium mb-6 animate-pulse">
              {t('aligningStars', 'Aligning the stars for your divine journey...')}
            </p>
            
            {/* Progress dots */}
            <div className="flex items-center justify-center gap-2">
              {[...Array(3)].map((_, i) => (
                <div key={i}
                  className="w-2 h-2 rounded-full bg-orange-400 animate-bounce"
                  style={{
                    animationDelay: `${i * 0.2}s`,
                    animationDuration: '1.5s',
                    boxShadow: '0 0 10px rgba(249,115,22,0.3)'
                  }}
                />
              ))}
            </div>

            {/* Decorative bottom line */}
            <div className="mt-8 flex items-center justify-center gap-3">
              <div className="w-12 h-px bg-gradient-to-r from-transparent to-orange-300/50" />
              <span className="text-orange-300/50 text-xs">✦</span>
              <div className="w-12 h-px bg-gradient-to-l from-transparent to-orange-300/50" />
            </div>
          </div>
        </div>

        {/* Loading Animation Styles */}
        <style>{`
          @keyframes floatLoading {
            0%, 100% { transform: translateY(0) scale(1); opacity: 0.2; }
            50% { transform: translateY(-30px) scale(1.5); opacity: 0.6; }
          }
          @keyframes spin-slow { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          @keyframes orbit { 0%, 100% { transform: scale(1); opacity: 0.6; } 50% { transform: scale(1.5); opacity: 1; } }
          @keyframes bounce-gentle { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
          @keyframes shimmer { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
          .animate-spin-slow { animation: spin-slow linear infinite; }
          .animate-orbit { animation: orbit ease-in-out infinite; }
          .animate-bounce-gentle { animation: bounce-gentle 2s ease-in-out infinite; }
        `}</style>
      </div>
    );
  }

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100">

      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full border border-orange-100 opacity-30"></div>
        <div className="absolute top-40 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full border border-orange-100 opacity-40"></div>
        <div className="absolute top-60 left-1/2 -translate-x-1/2 w-[200px] h-[200px] rounded-full border border-orange-200 opacity-50"></div>

        <div className="absolute top-20 left-[10%] animate-float-slow"><Star className="w-4 h-4 text-orange-300 opacity-40" /></div>
        <div className="absolute top-40 right-[15%] animate-float-medium"><Sparkles className="w-3 h-3 text-amber-300 opacity-40" /></div>
        <div className="absolute bottom-32 left-[20%] animate-float-fast"><Star className="w-5 h-5 text-orange-200 opacity-30" /></div>
        <div className="absolute bottom-40 right-[25%] animate-float-slow"><Sparkles className="w-4 h-4 text-amber-200 opacity-30" /></div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-orange-200/20 to-amber-200/20 rounded-full blur-3xl"></div>

        {/* ✨ Zodiac Wheel Decoration */}
        <div className="absolute right-5 top-1/2 -translate-y-1/2 hidden xl:block">
          <div className="relative w-[300px] h-[300px] animate-spin-slow">
            {zodiacImages.map((zodiac, idx) => (
              <div
                key={idx}
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
                onMouseEnter={() => setActiveZodiac(t(zodiac.name, zodiac.name))}
                onMouseLeave={() => setActiveZodiac(null)}
              >
                <img
                  src={zodiac.image}
                  alt={t(zodiac.name, zodiac.name)}
                  className="w-full h-full object-cover object-center rounded-full"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <span className="text-xl hidden" style={{ display: 'none' }}>{zodiac.icon}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ✨ Left side floating zodiac icons */}
        <div className="absolute left-5 top-1/2 -translate-y-1/2 hidden xl:block">
          <div className="flex flex-col gap-3">
            {zodiacImages.slice(0, 6).map((zodiac, idx) => (
              <div
                key={idx}
                className="w-10 h-10 rounded-full bg-white/80 shadow-md flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 hover:bg-white zodiac-icon p-[2px]"
                style={{ borderLeft: `3px solid ${zodiac.color}` }}
                onMouseEnter={() => setActiveZodiac(t(zodiac.name, zodiac.name))}
                onMouseLeave={() => setActiveZodiac(null)}
              >
                <img src={zodiac.image} alt={t(zodiac.name, zodiac.name)} className="w-full h-full object-cover object-center rounded-full" />
              </div>
            ))}
          </div>
        </div>

        <div className="absolute right-5 bottom-10 hidden xl:block">
          <div className="flex flex-col gap-3">
            {zodiacImages.slice(6, 12).map((zodiac, idx) => (
              <div
                key={idx}
                className="w-10 h-10 rounded-full bg-white/80 shadow-md flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 hover:bg-white zodiac-icon p-[2px]"
                style={{ borderRight: `3px solid ${zodiac.color}` }}
                onMouseEnter={() => setActiveZodiac(t(zodiac.name, zodiac.name))}
                onMouseLeave={() => setActiveZodiac(null)}
              >
                <img src={zodiac.image} alt={t(zodiac.name, zodiac.name)} className="w-full h-full object-cover object-center rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-12 md:py-16 text-center">

        {/* Ganesha Icon / Image */}
        <div className="flex justify-center mb-8 md:mb-10">
          <div className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-amber-400/20 rounded-full blur-2xl animate-pulse"></div>
            <div className="relative w-full h-full bg-gradient-to-br from-orange-50 to-amber-50 rounded-full shadow-xl flex items-center justify-center border border-orange-200 transition-all duration-300 group-hover:scale-105">
              <div className="w-24 h-40 md:w-28 md:h-40 lg:w-32 lg:h-55">
                <img src={ganesha} className='w-full h-full object-cover' alt="Ganesha" />
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
            {heroData?.title || t('heroTitle', 'ॐ गन् गणपत् र नमो नमः')}
          </h1>
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-orange-200"></div>
            <span className="text-orange-300 text-2xl md:text-3xl font-medium tracking-wide">
              {heroData?.subtitle || t('heroSubtitle', '॥ श्री सिद्धि विनायक नमो नमः ॥')}
            </span>
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-orange-200"></div>
          </div>
        </div>

        {/* Description Text */}
        <p className="text-gray-600 text-base sm:text-lg md:text-xl max-w-3xl mx-auto mb-10 md:mb-12 leading-relaxed">
          {heroData?.description || t('heroDescription', 'ॐ गन गणपतए नमो नमः श्री सिद्धि विनायक नमो नमः अष्टविनायक नमो नमः गणपति बाप्पा मोरया')}
        </p>

        {/* Active Zodiac Tooltip */}
        {activeZodiac && (
          <div className="fixed top-20 right-20 z-50 bg-black/80 text-white px-3 py-1.5 rounded-full text-sm animate-fade-in font-semibold">
            {activeZodiac}
          </div>
        )}

        {/* CTA Button with Hover Effect */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to={heroData?.buttonLink || "/services"}
            className="group inline-flex items-center gap-2 bg-gradient-sunset hover:from-orange-600 hover:to-amber-600 text-white font-semibold px-8 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            <span>{heroData?.buttonText || t('exploreServices', 'Explore Services')}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to={heroData?.secondaryButtonLink || "/contact"}
            className="inline-flex items-center gap-2 bg-white text-gray-700 font-medium px-8 py-3.5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-orange-200 transition-all duration-300"
          >
            <Compass className="w-4 h-4 text-orange-500" />
            <span>{heroData?.secondaryButtonText || t('consultNow', 'Consult Now')}</span>
          </Link>
        </div>

        {/* Trust Badges - Now from Database */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-wrap items-center justify-center gap-6 text-gray-500 text-sm">
            <div className="flex items-center gap-2 group hover:text-orange-500 transition-colors">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-400 group-hover:scale-150 transition-transform"></div>
              <span>{stats.happyClients} {t('happyClients', 'Happy Clients')}</span>
            </div>
            <div className="flex items-center gap-2 group hover:text-orange-500 transition-colors">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-400 group-hover:scale-150 transition-transform"></div>
              <span>{stats.yearsOfService} {t('yearsOfService', 'Years of Service')}</span>
            </div>
            <div className="flex items-center gap-2 group hover:text-orange-500 transition-colors">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-400 group-hover:scale-150 transition-transform"></div>
              <span>{stats.certifiedAstrologers} {t('astrologers', 'Astrologers')}</span>
            </div>
            <div className="flex items-center gap-2 group hover:text-orange-500 transition-colors">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-400 group-hover:scale-150 transition-transform"></div>
              <span>{stats.support} {t('supportLabel', 'Support')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animation Styles */}
      <style>{`
        @keyframes float-slow { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-20px) rotate(10deg); } }
        @keyframes float-medium { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-15px) rotate(-5deg); } }
        @keyframes float-fast { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-10px) rotate(8deg); } }
        @keyframes spin-slow { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes fade-in { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-float-slow { animation: float-slow 6s ease-in-out infinite; }
        .animate-float-medium { animation: float-medium 4s ease-in-out infinite; }
        .animate-float-fast { animation: float-fast 3s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 40s linear infinite; } /* Made wheel spin slower for better UX */
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
        .zodiac-icon { transition: all 0.3s ease; }
        .zodiac-icon:hover { transform: scale(1.1); box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1); }
        .zodiac-item { transition: all 0.3s ease; }
        .zodiac-item:hover { transform: scale(1.2) rotate(0deg) !important; z-index: 50; }
      `}</style>
    </div>
  );
};

export default HeroSection;