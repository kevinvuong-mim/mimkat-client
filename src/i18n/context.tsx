"use client";

import { createContext, useContext, useState, useEffect } from "react";
import en from "./locales/en.json";
import vi from "./locales/vi.json";

type Locale = "en" | "vi";

type Messages = typeof en;

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Messages;
  isReady: boolean;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const messages: Record<Locale, Messages> = {
  en,
  vi,
};

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const getInitialLocale = (): Locale => {
    // Check if we're on the client side
    if (typeof window === "undefined") {
      return "en"; // Default for SSR
    }

    // Priority 1: Check localStorage
    const savedLocale = localStorage.getItem("locale") as Locale;
    if (savedLocale && (savedLocale === "en" || savedLocale === "vi")) {
      return savedLocale;
    }

    // Priority 2: Check browser language
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith("vi")) {
      return "vi";
    }
    if (browserLang.startsWith("en")) {
      return "en";
    }

    // Priority 3: Default to English
    return "en";
  };

  const [locale, setLocaleState] = useState<Locale>("en");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initialLocale = getInitialLocale();
    setLocaleState(initialLocale);
    setIsReady(true);
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("locale", newLocale);
  };

  return (
    <I18nContext.Provider
      value={{ locale, setLocale, t: messages[locale], isReady }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return context;
}
