import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import all translations
import en from './locales/en/translation.json';
import ph from './locales/ph/translation.json';

// the translations
const resources = {
  en: {
    translation: en
  },
  ph: {
    translation: ph
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('i18nextLng') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
