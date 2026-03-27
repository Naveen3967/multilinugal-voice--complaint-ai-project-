import { useNavigate } from "react-router-dom";

export default function AdminProfilePage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin");
  };

  return (
    <div className="min-h-[calc(100vh-120px)] max-w-3xl mx-auto px-4 py-8">
      <div className="bg-card rounded-xl border border-border shadow-sm p-6 animate-reveal-up gov-border-top">
        <h1 className="text-2xl font-bold mb-1">Admin Profile</h1>
        <p className="text-sm text-muted-foreground mb-6">Administrative account details</p>

        <div className="rounded-lg border border-border bg-muted/40 p-4 mb-6">
          <p className="text-xs text-muted-foreground mb-1">Email</p>
          <p className="font-medium">admin@gmail.com</p>
        </div>

        <button
          onClick={handleLogout}
          className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
