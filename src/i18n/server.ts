import i18next, { type TFunction } from "i18next";
import { resources } from "./resources";

export type Locale = "en" | "ar";

let serverI18n: typeof i18next | null = null;

// Server Components can't use the useTranslation() hook (it needs React
// context from initReactI18next, which only exists client-side). This is a
// second, plain i18next instance - same resources, no React binding - so
// Server Components can translate synchronously via getFixedT().
function getServerI18nInstance() {
  if (!serverI18n) {
    serverI18n = i18next.createInstance();
    serverI18n.init({
      resources,
      fallbackLng: "en",
      interpolation: { escapeValue: false },
      // Resources are provided inline (no backend plugin to await), so this
      // instance is usable synchronously right after init() - the standard
      // i18next SSR pattern.
      initImmediate: false,
    });
  }
  return serverI18n;
}

export function getServerT(locale: Locale): TFunction {
  return getServerI18nInstance().getFixedT(locale);
}

// The 'locale' cookie is written by the browser's language detector
// (see client.ts) whenever changeLanguage() runs, so this is the single
// source of truth shared between client and Server Components.
export function localeFromCookie(cookieValue: string | undefined): Locale {
  return cookieValue === "ar" ? "ar" : "en";
}
