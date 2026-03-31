import { createContext } from "react";
import type { Language } from "@/contexts/languages";

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isLanguageSelected: boolean;
}

export const LanguageContext = createContext<LanguageContextType | null>(null);
