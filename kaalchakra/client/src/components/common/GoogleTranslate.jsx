// client/src/components/common/GoogleTranslate.jsx
import React, { useEffect, useState } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';

const GoogleTranslate = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('en');

  const languages = [
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
    { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩' },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
    { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
    { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳' },
    { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
    { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', flag: '🇮🇳' },
  ];

  const changeLanguage = (langCode) => {
    // Google Translate এর ভাষা পরিবর্তন করার জন্য
    const selectElement = document.querySelector('.goog-te-combo');
    if (selectElement) {
      selectElement.value = langCode;
      selectElement.dispatchEvent(new Event('change'));
    }
    setCurrentLang(langCode);
    localStorage.setItem('googleTranslateLang', langCode);
    setIsOpen(false);
  };

  // আগের ভাষা লোড করুন
  useEffect(() => {
    const savedLang = localStorage.getItem('googleTranslateLang');
    if (savedLang) {
      setTimeout(() => {
        changeLanguage(savedLang);
      }, 1000);
    }
  }, []);

  const currentLangData = languages.find(l => l.code === currentLang) || languages[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 transition text-slate-700 font-medium"
      >
        <Globe size={16} className="text-[#d4af37]" />
        <span className="text-lg">{currentLangData.flag}</span>
        <span className="hidden lg:inline text-sm">{currentLangData.nativeName}</span>
        <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-[#cf9f4a]/20 py-2 z-50 max-h-80 overflow-y-auto">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={`w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-amber-50 transition ${
                  currentLang === lang.code ? 'bg-amber-100 text-[#b8860b] font-semibold' : 'text-slate-700'
                }`}
              >
                <span className="text-lg">{lang.flag}</span>
                <span>{lang.nativeName}</span>
                {currentLang === lang.code && <Check size={16} className="ml-auto text-[#d4af37]" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default GoogleTranslate;