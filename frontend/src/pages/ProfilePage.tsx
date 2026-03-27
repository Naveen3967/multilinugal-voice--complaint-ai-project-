import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    navigate("/");
  };

  return (
    <div className="min-h-[calc(100vh-120px)] max-w-3xl mx-auto px-4 py-8">
      <div className="bg-card rounded-xl border border-border shadow-sm p-6 animate-reveal-up gov-border-top">
        <h1 className="text-2xl font-bold mb-4">{t("profile")}</h1>

        <div className="rounded-lg border border-border bg-muted/40 p-4 mb-6">
          <h2 className="text-sm font-semibold mb-2">{t("termsAndConditions")}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            By using this service, you confirm that complaint details are true and submitted in good faith.
            Authorities may verify details and contact you for additional information.
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
        >
          {t("logout")}
        </button>
      </div>
    </div>
  );
}
