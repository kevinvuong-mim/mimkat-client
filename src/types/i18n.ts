import en from "@/i18n/locales/en.json";

export type Locale = "en" | "vi";

export type Messages = typeof en;

export interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Messages;
}
