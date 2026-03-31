import { useState } from "react";
import { useLanguage } from "@/contexts/useLanguage";
import { trackComplaint, type TrackResponse } from "@/services/api";
import { Search, Clock, CheckCircle, AlertCircle, FileSearch } from "lucide-react";

export default function TrackPage() {
  const { t } = useLanguage();
  const [ticketId, setTicketId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TrackResponse | null>(null);
  const [searched, setSearched] = useState(false);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketId.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await trackComplaint(ticketId.trim());
      setResult(res);
    } catch {
      setResult(null);
    }
    setLoading(false);
  };

  const statusConfig = {
    pending: { icon: Clock, color: "text-status-pending", bg: "bg-status-pending/10", label: t("pending") },
    reviewing: { icon: AlertCircle, color: "text-status-reviewing", bg: "bg-status-reviewing/10", label: t("reviewing") },
    resolved: { icon: CheckCircle, color: "text-status-resolved", bg: "bg-status-resolved/10", label: t("resolved") },
  };

  return (
    <div className="min-h-[calc(100vh-120px)] max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-10 animate-reveal-up">
        <FileSearch className="w-12 h-12 mx-auto mb-3 text-primary" />
        <h1 className="text-3xl font-bold mb-2">{t("trackComplaint")}</h1>
        <p className="text-muted-foreground">Enter your ticket ID to check the current status</p>
      </div>

      <form onSubmit={handleTrack} className="flex gap-3 mb-8 animate-reveal-up" style={{ animationDelay: "100ms" }}>
        <input
          type="text"
          value={ticketId}
          onChange={(e) => setTicketId(e.target.value.toUpperCase())}
          placeholder="CG-XXXXXXXX"
          className="flex-1 px-4 py-3 rounded-lg border border-input bg-card text-foreground text-lg font-mono focus:ring-2 focus:ring-accent outline-none tracking-wider"
        />
        <button
          type="submit"
          disabled={loading || !ticketId.trim()}
          className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 disabled:opacity-40 transition-all active:scale-[0.98] flex items-center gap-2"
        >
          <Search size={18} />
          {t("trackStatus")}
        </button>
      </form>

      {loading && (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-3 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      )}

      {!loading && searched && result && (
        <div className="bg-card rounded-xl shadow-md border border-border overflow-hidden gov-border-top animate-reveal-up">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs text-muted-foreground">{t("ticketId")}</p>
                <p className="text-xl font-bold font-mono tabular-nums">{result.ticketId}</p>
              </div>
              {(() => {
                const cfg = statusConfig[result.status];
                return (
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${cfg.bg}`}>
                    <cfg.icon size={16} className={cfg.color} />
                    <span className={`text-sm font-semibold ${cfg.color}`}>{cfg.label}</span>
                  </div>
                );
              })()}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-xs text-muted-foreground">Filed Date</p>
                <p className="text-sm font-medium">{result.filedDate}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Last Updated</p>
                <p className="text-sm font-medium">{result.lastUpdated}</p>
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-xs text-muted-foreground mb-1">Status Details</p>
              <p className="text-sm text-foreground">{result.details}</p>
            </div>
          </div>
        </div>
      )}

      {!loading && searched && !result && (
        <div className="text-center py-12 text-muted-foreground animate-reveal-up">
          <p>No complaint found for this ticket ID. Please verify and try again.</p>
        </div>
      )}
    </div>
  );
}
