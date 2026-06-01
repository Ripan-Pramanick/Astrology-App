import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Sparkles, Star, Moon } from 'lucide-react';

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
  // Demo purpose: Defaulting to 'bn' (Bengali) to show changes. 
  // In your real app, this will come from a global context or i18next.
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
  const { t, i18n } = useTranslation();
  
  // NOTE: Mocking useNavigate for preview environment
  // const navigate = useNavigate();
  const navigate = (path) => console.log(`Navigating to: ${path}`);

  useEffect(() => {
    // চেক করা হচ্ছে ইউজার এই সেশনে আগে মোডালটি দেখেছে কি না
    const hasSeenModal = sessionStorage.getItem('kundliModalSeen');

    if (!hasSeenModal) {
      const handleScroll = () => {
        // স্ক্রল পার্সেন্টেজ বের করার লজিক
        const scrollY = window.scrollY;
        const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercentage = (scrollY / documentHeight) * 100;

        // যদি ইউজার ৩৫% এর বেশি স্ক্রল করে, তবে মোডালটি ওপেন হবে
        // For testing purpose, making it show quickly on small scroll or immediately
        if (scrollPercentage > 5 || scrollY > 50) {
          setIsOpen(true);
          sessionStorage.setItem('kundliModalSeen', 'true'); // একবার দেখালে সেভ করে রাখবো
          window.removeEventListener('scroll', handleScroll); // ইভেন্ট রিমুভ করে দেবো
        }
      };

      // For preview environment, explicitly showing the modal after 2 seconds if scroll doesn't happen
      const timer = setTimeout(() => setIsOpen(true), 2000);

      window.addEventListener('scroll', handleScroll);
      return () => {
        window.removeEventListener('scroll', handleScroll);
        clearTimeout(timer);
      };
    } else {
      // For preview testing, we forcefully open it so you can see it
      setIsOpen(true);
    }
  }, []);

  if (!isOpen) return null;

  return (
    // পেছনের ব্লার হওয়া ব্যাকগ্রাউন্ড
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1e2545]/60 backdrop-blur-sm p-4 animate-in fade-in duration-500">
      
      {/* Language Switcher for Preview Testing */}
      <div className="absolute top-4 left-4 bg-white rounded-full p-2 flex gap-2 z-50">
        <select 
          className="text-sm outline-none bg-transparent cursor-pointer"
          value={i18n.language}
          onChange={(e) => i18n.changeLanguage(e.target.value)}
        >
          <option value="en">English</option>
          <option value="bn">বাংলা</option>
          <option value="hi">हिन्दी</option>
          <option value="mr">मराठी</option>
          <option value="ta">தமிழ்</option>
          <option value="te">తెలుగు</option>
        </select>
      </div>

      {/* মোডাল বা ছোট পেজটি */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] overflow-hidden animate-in zoom-in-95 duration-500">
        
        {/* ক্রস (X) বাটন */}
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center bg-white/80 rounded-full text-slate-500 hover:text-red-500 hover:bg-red-50 transition-all shadow-sm"
        >
          <X size={18} strokeWidth={2.5} />
        </button>

        {/* ওপরের ডিজাইন অংশ */}
        <div className="h-32 relative flex items-center justify-center overflow-hidden" style={{ background: 'linear-gradient(135deg, #1e2545 0%, #2a355c 100%)' }}>
          <div className="absolute inset-0 opacity-20">
             <div className="absolute top-4 left-6 text-[#d4af37]"><Star size={24} /></div>
             <div className="absolute bottom-6 right-8 text-[#d4af37]"><Moon size={32} /></div>
          </div>
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#d4af37] to-[#e4b363] flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.5)] border-4 border-white z-10">
            <Sparkles className="text-white w-8 h-8" />
          </div>
        </div>

        {/* নিচের টেক্সট ও বাটন অংশ */}
        <div className="p-8 text-center bg-gray-50 bg-cover">
          <h3 className="text-2xl font-bold text-[#1e2545] mb-2 font-serif">
            {t('title')}
          </h3>
          <p className="text-sm text-slate-500 mb-6 leading-relaxed">
            {t('description')}
          </p>

          <button
            onClick={() => {
              setIsOpen(false);
              navigate('/auth'); // বা আপনার লগইন পেজের লিংক
            }}
            className="w-full py-3.5 px-6 rounded-xl font-bold text-sm tracking-widest uppercase text-white shadow-[0_8px_20px_rgba(212,175,55,0.4)] hover:-translate-y-1 transition-all"
            style={{ backgroundImage: 'linear-gradient(to right, #d4af37, #e4b363)' }}
          >
            {t('buttonPrimary')}
          </button>
          
          <button 
            onClick={() => setIsOpen(false)}
            className="mt-4 text-xs font-bold text-slate-400 hover:text-[#1e2545] uppercase tracking-wider transition-colors"
          >
            {t('buttonSecondary')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SmartKundliModal;