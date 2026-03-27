import { Link, useLocation, useNavigate } from "react-router-dom";
import { Shield, Menu, X } from "lucide-react";
import { LANGUAGES, useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";

export default function Navbar() {
  const { t, language, setLanguage } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isAdminLoginPage = location.pathname === "/admin";
  const showLanguageRow = !isAdminRoute;

  const links = isAdminRoute
    ? [
        { to: "/admin/dashboard", label: "Dashboard" },
        { to: "/admin/profile", label: t("profile") },
      ]
    : [
        { to: "/", label: t("home") },
        { to: "/complaint", label: t("fileComplaint") },
        { to: "/track", label: t("trackComplaint") },
        { to: "/profile", label: t("profile") },
      ];

  const visibleLinks = isAdminLoginPage ? [] : links;

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("adminToken");
    navigate(isAdminRoute ? "/admin" : "/");
    setMobileOpen(false);
  };

  return (
    <nav className="gov-gradient text-primary-foreground shadow-lg">
      {/* Main nav */}
      <div className="max-w-[1400px] mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
            <Shield className="w-6 h-6 text-accent-foreground" />
          </div>
          <div>
            <div className="font-bold text-lg leading-tight tracking-tight">{t("cyberGuard")}</div>
            <div className="text-[10px] text-primary-foreground/60 leading-tight">{t("tagline")}</div>
          </div>
        </Link>

        {/* Desktop links + languages (same line) */}
        <div className="hidden md:flex items-center gap-2 min-w-0">
          {visibleLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-150
                ${isActive(link.to)
                  ? "bg-accent text-accent-foreground"
                  : "text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
                }`}
            >
              {link.label}
            </Link>
          ))}

          {showLanguageRow && (
            <div className="ml-1 pl-2 border-l border-primary-foreground/15 min-w-0 max-w-[45vw]">
              <div className="flex items-center gap-1 overflow-x-auto scrollbar-thin">
                <span className="text-xs text-primary-foreground/70 shrink-0 mr-1">{t("language")}</span>
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang)}
                    className={`px-2.5 py-1 rounded text-xs font-medium transition-all whitespace-nowrap
                      ${language.code === lang.code
                        ? "bg-accent text-accent-foreground shadow-sm"
                        : "text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
                      }`}
                  >
                    {lang.nativeName}
                  </button>
                ))}
              </div>
            </div>
          )}

          {isAdminRoute && !isAdminLoginPage && (
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-150 text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
            >
              {t("logout")}
            </button>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-primary-foreground/10 px-4 py-3 space-y-1">
          {visibleLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className={`block px-3 py-2 rounded-md text-sm font-medium transition-all
                ${isActive(link.to)
                  ? "bg-accent text-accent-foreground"
                  : "text-primary-foreground/80 hover:bg-primary-foreground/10"
                }`}
            >
              {link.label}
            </Link>
          ))}
          {showLanguageRow && (
            <div className="pt-2 border-t border-primary-foreground/10 mt-2">
              <p className="text-xs text-primary-foreground/70 mb-2">{t("language")}</p>
              <div className="flex overflow-x-auto gap-1 pb-1">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang);
                      setMobileOpen(false);
                    }}
                    className={`px-2.5 py-1 rounded text-xs font-medium whitespace-nowrap
                      ${language.code === lang.code
                        ? "bg-accent text-accent-foreground"
                        : "text-primary-foreground/80 hover:bg-primary-foreground/10"
                      }`}
                  >
                    {lang.nativeName}
                  </button>
                ))}
              </div>
            </div>
          )}
          {isAdminRoute && !isAdminLoginPage && (
            <button
              onClick={handleLogout}
              className="block w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-all text-primary-foreground/80 hover:bg-primary-foreground/10"
            >
              {t("logout")}
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
