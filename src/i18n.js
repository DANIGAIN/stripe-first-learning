import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import EN from "./locales/en/translation.json";
import HE from "./locales/hn/translation.json";
import BN from "./locales/bn/translation.json";


const resources = {
  en: {
    translation: EN,
  },
  hn: {
    translation: HE,
  },
  bn:{
    translation:BN,
  }
};


i18n
  .use(initReactI18next)
  .init({
    resources,
    lng:"en", 
    keySeparator: false,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;