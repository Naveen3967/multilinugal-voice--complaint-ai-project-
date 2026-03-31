import { useCallback, useMemo, useState } from "react";
import type { ReactNode } from "react";

import { LANGUAGES, type Language } from "@/contexts/languages";
import { getTranslation } from "@/contexts/language-translation";
import { LanguageContext } from "@/contexts/language-types";

function readSavedLanguageCode(): string | null {
  try {
    return localStorage.getItem("cyberguard_lang_code");
  } catch {
    return null;
  }
}

function persistLanguageCode(code: string): void {
  try {
    localStorage.setItem("cyberguard_lang_code", code);
  } catch {
    // Ignore storage failures so the app can still render.
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLang] = useState<Language>(() => {
    const savedCode = readSavedLanguageCode();
    return LANGUAGES.find((lang) => lang.code === savedCode) || LANGUAGES.find((lang) => lang.code === "en") || LANGUAGES[0];
  });
  const [isLanguageSelected, setIsLanguageSelected] = useState(() => {
    return Boolean(readSavedLanguageCode());
  });

  const setLanguage = useCallback((lang: Language) => {
    setLang(lang);
    setIsLanguageSelected(true);
    persistLanguageCode(lang.code);
  }, []);

  const t = useCallback((key: string) => getTranslation(language.code, key), [language.code]);

  const value = useMemo(
    () => ({ language, setLanguage, t, isLanguageSelected }),
    [language, setLanguage, t, isLanguageSelected]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
