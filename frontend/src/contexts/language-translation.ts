import { FULL_TRANSLATIONS } from "@/data/translations";

export function getTranslation(langCode: string, key: string): string {
  const langDict = FULL_TRANSLATIONS[langCode];
  if (langDict && langDict[key]) {
    return langDict[key];
  }
  return FULL_TRANSLATIONS.en[key] ?? key;
}
