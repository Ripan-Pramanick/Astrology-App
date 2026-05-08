import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          welcome: "Welcome",
          home: "Home",
          about: "About",
          services: "Services",
          kundli: "Kundli",
          contact: "Contact",
          login: "Login",
          signup: "Sign Up"
        }
      },
      bn: {
        translation: {
          welcome: "স্বাগতম",
          home: "হোম",
          about: "সম্পর্কে",
          services: "সেবাসমূহ",
          kundli: "কুণ্ডলী",
          contact: "যোগাযোগ",
          login: "লগইন",
          signup: "সাইন আপ"
        }
      }
    },
    lng: "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;