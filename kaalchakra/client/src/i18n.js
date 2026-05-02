// client/src/i18n.js (সর্বনিম্ন ভার্সন)
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// শুধু ভাষা সনাক্তকরণের জন্য minimal configuration
i18n.use(initReactI18next).init({
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;