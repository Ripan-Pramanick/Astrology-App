import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Sparkles, Star, Moon, ChevronDown, Globe } from 'lucide-react';

// ==========================================
// 🌍 Translations Dictionary
// ==========================================
const resources = {
  en: {
    translation: {
      title: "Discover Your Destiny",
      description: "Generate your detailed Vedic Kundli instantly. Find out what the stars have planned for your career, wealth, and relationships.",
      buttonPrimary: "Create Free Kundli Now",
      buttonSecondary: "Maybe Later",
    }
  },
  bn: {
    translation: {
      title: "আপনার ভাগ্য জানুন",
      description: "তাৎক্ষণিকভাবে আপনার বিস্তারিত বৈদিক কুণ্ডলী তৈরি করুন। আপনার ক্যারিয়ার, সম্পদ এবং সম্পর্ক নিয়ে তারকারা কী পরিকল্পনা করেছে তা জানুন।",
      buttonPrimary: "এখনই ফ্রি কুণ্ডলী তৈরি করুন",
      buttonSecondary: "পরে হয়তো",
    }
  },
  hi: {
    translation: {
      title: "अपना भाग्य जानें",
      description: "तुरंत अपनी विस्तृत वैदिक कुंडली बनाएं। जानें कि सितारों ने आपके करियर, धन और रिश्तों के लिए क्या योजना बनाई है।",
      buttonPrimary: "अभी मुफ्त कुंडली बनाएं",
      buttonSecondary: "शायद बाद में",
    }
  },
  mr: {
    translation: {
      title: "आपले भाग्य जाणून घ्या",
      description: "आपली सविस्तर वैदिक कुंडली त्वरित तयार करा. तारे तुमच्या करिअर, संपत्ती आणि नातेसंबंधांसाठी काय नियोजन करत आहेत ते शोधा.",
      buttonPrimary: "आता मोफत कुंडली तयार करा",
      buttonSecondary: "कदाचित नंतर",
    }
  },
  ta: {
    translation: {
      title: "உங்கள் விதியை அறியுங்கள்",
      description: "உங்கள் விரிவான வேத குண்டலியை உடனடியாக உருவாக்குங்கள். உங்கள் தொழில், செல்வம் மற்றும் உறவுகளுக்கு நட்சத்திரங்கள் என்ன திட்டமிட்டுள்ளன என்பதைக் கண்டறியவும்.",
      buttonPrimary: "இப்போது இலவச குண்டலியை உருவாக்குங்கள்",
      buttonSecondary: "பிறகு பார்க்கலாம்",
    }
  },
  te: {
    translation: {
      title: "మీ విధిని తెలుసుకోండి",
      description: "మీ వివరణాత్మక వేద కుండలిని తక్షణమే సృష్టించండి. మీ కెరీర్, సంపద మరియు సంబంధాల కోసం నక్షత్రాలు ఏమి ప్లాన్ చేశాయో తెలుసుకోండి.",
      buttonPrimary: "ఇప్పుడే ఉచిత కుండలిని సృష్టించండి",
      buttonSecondary: "బహుశా తర్వాత",
    }
  }
};

const useTranslation = () => {
  const [language, setLanguage] = useState('bn');

  const t = (key) => {
    return resources[language]?.translation[key] || resources['en'].translation[key] || key;
  };

  const i18n = {
    language,
    changeLanguage: (lang) => setLanguage(lang)
  };

  return { t, i18n };
};

const SmartKundliModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const { t, i18n } = useTranslation();

  const navigate = useNavigate();

  useEffect(() => {
    const hasSeenModal = sessionStorage.getItem('kundliModalSeen');

    if (!hasSeenModal) {
      const handleScroll = () => {
        const scrollY = window.scrollY;
        const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercentage = (scrollY / documentHeight) * 100;

        if (scrollPercentage > 5 || scrollY > 50) {
          setIsOpen(true);
          sessionStorage.setItem('kundliModalSeen', 'true');
          window.removeEventListener('scroll', handleScroll);
        }
      };

      const timer = setTimeout(() => setIsOpen(true), 2000);

      window.addEventListener('scroll', handleScroll);
      return () => {
        window.removeEventListener('scroll', handleScroll);
        clearTimeout(timer);
      };
    } else {
      setIsOpen(true);
    }
  }, []);

  if (!isOpen) return null;

  const languageNames = {
    en: 'English',
    bn: 'বাংলা',
    hi: 'हिन्दी',
    mr: 'मराठी',
    ta: 'தமிழ்',
    te: 'తెలుగు'
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-500"
      style={{ 
        background: 'radial-gradient(ellipse at center, rgba(30,37,69,0.5) 0%, rgba(20,16,36,0.8) 100%)',
        backdropFilter: 'blur(12px)'
      }}>
      
      {/* Floating background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 4 + 2 + 'px',
              height: Math.random() * 4 + 2 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              background: i % 3 === 0 ? '#d4af37' : i % 3 === 1 ? '#fbbf24' : '#e4b363',
              opacity: Math.random() * 0.5 + 0.2,
              animation: `floatModal ${Math.random() * 8 + 6}s infinite ease-in-out`,
              animationDelay: Math.random() * 5 + 's',
              boxShadow: '0 0 10px rgba(212,175,55,0.3)',
            }}
          />
        ))}
      </div>

      {/* Language Switcher */}
      <div className="absolute top-6 left-6 z-50">
        <div className="relative">
          <button
            onClick={() => setIsLangOpen(!isLangOpen)}
            className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-full hover:bg-white/20 transition-all duration-300 text-sm font-medium"
            style={{ boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}
          >
            <Globe size={16} className="text-[#d4af37]" />
            <span>{languageNames[i18n.language]}</span>
            <ChevronDown size={14} className={`transition-transform duration-300 ${isLangOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isLangOpen && (
            <div className="absolute top-full mt-2 left-0 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 overflow-hidden animate-in slide-in-from-top-2 duration-300 min-w-[150px]"
              style={{ boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}>
              {Object.entries(languageNames).map(([code, name]) => (
                <button
                  key={code}
                  onClick={() => {
                    i18n.changeLanguage(code);
                    setIsLangOpen(false);
                  }}
                  className={`w-full text-left px-5 py-3 text-sm font-medium transition-all duration-200 hover:bg-gradient-to-r hover:from-[#d4af37]/10 hover:to-[#e4b363]/10 ${
                    i18n.language === code ? 'text-[#d4af37] bg-[#d4af37]/5' : 'text-gray-700'
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal Card */}
      <div className="relative w-full max-w-md animate-in zoom-in-95 duration-500"
        style={{ perspective: '1000px' }}>
        
        {/* Outer glow rings */}
        <div className="absolute -inset-4 rounded-[2.5rem] opacity-30 animate-pulse"
          style={{
            background: 'linear-gradient(135deg, rgba(212,175,55,0.15), rgba(228,179,99,0.15))',
            filter: 'blur(40px)',
            animationDuration: '3s'
          }} />
        <div className="absolute -inset-2 rounded-[2rem] border border-[#d4af37]/20"
          style={{ boxShadow: '0 0 30px rgba(212,175,55,0.1), inset 0 0 30px rgba(212,175,55,0.05)' }} />
        
        <div className="relative bg-white rounded-3xl overflow-hidden"
          style={{
            boxShadow: '0 25px 80px rgba(0,0,0,0.4), 0 0 60px rgba(212,175,55,0.15), 0 0 120px rgba(30,37,69,0.3)',
            transformStyle: 'preserve-3d',
            transform: 'rotateY(-1deg) rotateX(1deg)',
          }}>
          
          {/* Top shimmer line */}
          <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-[#d4af37] to-transparent opacity-40 z-20" />

          {/* Close Button */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 hover:scale-110 active:scale-95 transition-all duration-300 shadow-lg border border-gray-100"
            style={{ boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}
          >
            <X size={18} strokeWidth={2.5} />
          </button>

          {/* Top Decorative Section */}
          <div className="h-36 relative flex items-center justify-center overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #0f1729 0%, #1e2545 40%, #2a355c 100%)' }}>
            
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: 'radial-gradient(circle at 50% 50%, #d4af37 1px, transparent 1px)',
                backgroundSize: '30px 30px',
                perspective: '1000px',
                transform: 'rotateX(60deg) scale(1.5)',
              }} />
            
            {/* Glowing orbs in background */}
            <div className="absolute top-0 left-1/4 w-20 h-20 rounded-full bg-[#d4af37]/10 blur-2xl" />
            <div className="absolute bottom-0 right-1/4 w-16 h-16 rounded-full bg-[#e4b363]/10 blur-2xl" />
            
            {/* Floating stars */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-4 left-6 text-[#d4af37] animate-float-slow">
                <Star size={20} style={{ filter: 'drop-shadow(0 0 8px rgba(212,175,55,0.5))' }} />
              </div>
              <div className="absolute top-8 right-8 text-[#d4af37] animate-float-medium">
                <Star size={14} style={{ filter: 'drop-shadow(0 0 6px rgba(212,175,55,0.4))' }} />
              </div>
              <div className="absolute bottom-4 left-1/3 text-[#e4b363] animate-float-fast">
                <Moon size={24} style={{ filter: 'drop-shadow(0 0 10px rgba(228,179,99,0.5))' }} />
              </div>
              <div className="absolute bottom-6 right-6 text-[#d4af37] animate-float-slow">
                <Star size={12} style={{ filter: 'drop-shadow(0 0 5px rgba(212,175,55,0.4))', animationDelay: '1s' }} />
              </div>
            </div>

            {/* Central Icon Container */}
            <div className="relative z-10">
              {/* Outer rotating ring */}
              <div className="absolute inset-0 w-24 h-24 rounded-full border-2 border-[#d4af37]/30 animate-spin-slow"
                style={{ animationDuration: '8s', margin: '-12px' }} />
              <div className="absolute inset-0 w-20 h-20 rounded-full border border-[#d4af37]/20 animate-spin-slow"
                style={{ animationDuration: '12s', animationDirection: 'reverse', margin: '-10px' }} />
              
              {/* Main icon circle */}
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#d4af37] via-[#e4b363] to-[#fbbf24] flex items-center justify-center"
                style={{ 
                  boxShadow: '0 0 40px rgba(212,175,55,0.5), 0 0 80px rgba(212,175,55,0.3), 0 0 120px rgba(228,179,99,0.2), inset 0 1px 0 rgba(255,255,255,0.3)',
                  transform: 'translateZ(10px)'
                }}>
                <div className="relative">
                  <Sparkles className="text-white w-9 h-9 animate-pulse" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-white animate-ping" />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Content Section */}
          <div className="relative p-8 text-center bg-gradient-to-b from-[#fdfbf7] via-[#fef9f0] to-[#fef5e7]">
            
            {/* Sacred geometry decorative line */}
            <div className="flex items-center justify-center gap-3 mb-5">
              <div className="w-8 h-px bg-gradient-to-r from-transparent to-[#d4af37]/50" />
            <span className="text-orange-500 text-xl">🕉️</span>
              <div className="w-8 h-px bg-gradient-to-l from-transparent to-[#d4af37]/50" />
            </div>

            <h3 className="text-2xl font-bold mb-3 font-serif bg-gradient-to-r from-[#1e2545] via-[#2a355c] to-[#1e2545] bg-clip-text text-transparent"
              style={{ 
                backgroundSize: '200% 200%',
                animation: 'shimmer 3s ease infinite',
                textShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}>
              {t('title')}
            </h3>
            
            <p className="text-sm text-slate-500 mb-8 leading-relaxed max-w-sm mx-auto">
              {t('description')}
            </p>

            {/* Primary CTA Button */}
            <button
              onClick={() => navigate('/kundli')}
              className="relative w-full py-4 px-6 rounded-xl font-bold text-sm tracking-wider uppercase text-white overflow-hidden group transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] active:scale-95"
              style={{ 
                backgroundImage: 'linear-gradient(135deg, #d4af37 0%, #e4b363 50%, #fbbf24 100%)',
                boxShadow: '0 10px 40px rgba(212,175,55,0.4), 0 0 20px rgba(212,175,55,0.2), 0 0 0 1px rgba(255,255,255,0.2) inset',
                backgroundSize: '200% 200%',
                animation: 'shimmer 3s ease infinite',
              }}>
              {/* Button shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <span className="relative z-10 flex items-center justify-center gap-2">
                <Sparkles size={16} className="animate-pulse" />
                {t('buttonPrimary')}
              </span>
            </button>

            {/* Secondary Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="mt-4 text-xs font-bold text-slate-400 hover:text-[#1e2545] uppercase tracking-widest transition-all duration-300 hover:tracking-[0.2em]"
            >
              {t('buttonSecondary')}
            </button>
          </div>
        </div>
      </div>

      {/* Animation Styles */}
      <style>{`
        @keyframes floatModal {
          0%, 100% {
            transform: translateY(0) scale(1);
            opacity: 0.3;
          }
          25% {
            transform: translateY(-20px) scale(1.5);
            opacity: 0.6;
          }
          50% {
            transform: translateY(-10px) scale(1);
            opacity: 0.4;
          }
          75% {
            transform: translateY(-30px) scale(1.3);
            opacity: 0.5;
          }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.3; }
          50% { transform: translateY(-15px) rotate(10deg); opacity: 0.6; }
        }
        
        @keyframes float-medium {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.3; }
          50% { transform: translateY(-10px) rotate(-8deg); opacity: 0.5; }
        }
        
        @keyframes float-fast {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.25; }
          50% { transform: translateY(-8px) rotate(12deg); opacity: 0.5; }
        }
        
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes shimmer {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
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
          animation: spin-slow linear infinite;
        }
      `}</style>
    </div>
  );
};

export default SmartKundliModal;