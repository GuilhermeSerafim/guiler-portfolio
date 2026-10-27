import { createContext, useContext, type ReactNode } from "react";
import { type Locale } from "./locale";

export type { Locale } from "./locale";
export { getLocaleFromPath, getLocalePath, getLanguageHref } from "./locale";

const LocaleContext = createContext<Locale>("pt-BR");
const translations = {
  "pt-BR": { locale: "pt-BR" as const, isEnglish: false, t: <T,>(pt: T, _en: T): T => pt },
  en: { locale: "en" as const, isEnglish: true, t: <T,>(_pt: T, en: T): T => en },
};

export function LocaleProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

export function useLocale(): Locale {
  return useContext(LocaleContext);
}

export function useTranslation() {
  return translations[useLocale()];
}
