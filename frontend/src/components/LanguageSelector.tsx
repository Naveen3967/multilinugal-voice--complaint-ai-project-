import { useLanguage } from "@/contexts/useLanguage";
import { LANGUAGES } from "@/contexts/languages";

export default function LanguageSelector() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="w-full bg-primary overflow-x-auto">
      <div className="px-3 py-1.5 max-w-[1400px] mx-auto">
        <p className="text-[11px] text-primary-foreground/80 text-center mb-1">
          {t("selectLanguage")}: <span className="font-semibold text-primary-foreground">{language.nativeName}</span>
        </p>
        <div className="flex items-center gap-1 flex-wrap justify-center">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setLanguage(lang)}
            className={`px-2 py-0.5 rounded text-xs font-medium transition-all duration-150 whitespace-nowrap
              ${language.code === lang.code
                ? "bg-accent text-accent-foreground shadow-sm"
                : "text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
              }`}
            style={{ minWidth: "fit-content" }}
          >
            {lang.nativeName}
          </button>
        ))}
        </div>
      </div>
    </div>
  );
}
