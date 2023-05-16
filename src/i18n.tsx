import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import translationEN from "./locales/en/translation.json";
import translationUA from "./locales/ua/translation.json";
import Backend from "i18next-http-backend";

const resources = {
    en: {
      translation: translationEN
    },
    ua: {
      translation: translationUA
    }
  };

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'ua',
    debug: true,
    lng: 'ua',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;