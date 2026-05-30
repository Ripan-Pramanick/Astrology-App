import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(Backend) // locales ফোল্ডার থেকে ফাইল লোড করার জন্য
  .use(LanguageDetector) // ব্রাউজারের ল্যাঙ্গুয়েজ ডিটেক্ট করার জন্য
  .use(initReactI18next) // React এর সাথে কানেক্ট করার জন্য
  .init({
    fallbackLng: 'en', // ডিফল্ট ভাষা
    supportedLngs: ['en', 'bn', 'hi', 'mr', 'ta', 'te'], // আপনার সাপোর্ট করা ভাষাগুলো
    ns: ['common', 'navigation', 'hero', 'kundli'], // আপনার JSON ফাইলের নামগুলো
    defaultNS: 'common',
    debug: false,
    interpolation: {
      escapeValue: false, // React অটোমেটিক XSS প্রোটেকশন দেয়
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json', // JSON ফাইলগুলোর ডিরেক্টরি
    }
  });

export default i18n;