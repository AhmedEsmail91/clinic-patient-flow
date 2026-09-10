import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { resources } from "./resources";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    debug: false,

    detection: {
      // 'cookie' is the shared source of truth with Server Components
      // (see server.ts), which can't read localStorage.
      order: ["cookie", "localStorage", "navigator", "htmlTag"],
      caches: ["cookie", "localStorage"],
      lookupCookie: "locale",
    },

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
