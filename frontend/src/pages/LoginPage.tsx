import { useState } from "react";
import { useLanguage } from "@/contexts/useLanguage";
import { useNavigate } from "react-router-dom";
import { loginUser } from "@/services/api";
import { Eye, EyeOff } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";

export default function LoginPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await loginUser({ email, password });
      if (res.success) {
        if (res.token) localStorage.setItem("userToken", res.token);
        navigate("/complaint");
      } else {
        setError("Invalid credentials");
      }
    } catch {
      setError("Login failed. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-120px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-reveal-up">
        <div className="bg-card rounded-xl shadow-lg border border-border overflow-hidden gov-border-top">
          <div className="p-8">
            <div className="flex items-center justify-center mb-6">
              <BrandLogo sizeClassName="w-16 h-16" className="shadow-md" />
            </div>
            <h1 className="text-2xl font-bold text-center mb-1">{t("login")}</h1>
            <p className="text-sm text-muted-foreground text-center mb-8">{t("cyberGuard")} — {t("tagline")}</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-1.5">{t("email")}</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all pr-10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 active:scale-[0.98]"
              >
                {loading ? "..." : t("login")}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
