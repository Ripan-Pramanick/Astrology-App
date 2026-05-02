// client/src/components/common/LanguageSwitcher.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, ChevronDown, Check } from 'lucide-react';

const LanguageSwitcher = ({ variant = 'dropdown', className = '' }) => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const languages = [
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
    { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩' },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
    { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
  ];

  const currentLanguage = i18n.language;
  const currentLang = languages.find(l => l.code === currentLanguage) || languages[0];

  const changeLanguage = (langCode) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem('i18nextLng', langCode);
    setIsOpen(false);
    // Optional: reload page to refresh all content
    // window.location.reload();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Simple variant (icon only)
  if (variant === 'simple') {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-full hover:bg-amber-100 transition-colors duration-200 text-stone-600 hover:text-[#d4af37]"
          aria-label="Change language"
        >
          <Globe size={20} />
        </button>

        {isOpen && (
          <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-amber-200 py-1 z-50">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={`w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-amber-50 transition-colors ${
                  currentLanguage === lang.code ? 'bg-amber-100 text-orange-700 font-semibold' : 'text-stone-700'
                }`}
              >
                <span className="text-lg">{lang.flag}</span>
                <span>{lang.nativeName}</span>
                {currentLanguage === lang.code && <Check size={16} className="ml-auto text-[#d4af37]" />}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Dropdown variant
  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-100/50 hover:bg-amber-200/50 transition-colors duration-200 text-stone-700"
      >
        <span className="text-lg">{currentLang.flag}</span>
        <span className="hidden lg:inline text-sm font-medium">{currentLang.nativeName}</span>
        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-amber-200 py-1 z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-amber-50 transition-colors ${
                currentLanguage === lang.code ? 'bg-amber-100 text-orange-700 font-semibold' : 'text-stone-700'
              }`}
            >
              <span className="text-lg">{lang.flag}</span>
              <span>{lang.nativeName}</span>
              {currentLanguage === lang.code && <Check size={16} className="ml-auto text-[#d4af37]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;