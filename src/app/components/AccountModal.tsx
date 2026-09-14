import { useEffect } from "react";
import { X, Mail, Phone, Building2, Briefcase, Calendar, LogOut, User as UserIcon } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

interface Props {
  open: boolean;
  onClose: () => void;
}

const businessTypeLabels: Record<string, string> = {
  retail: "Retail / Tienda",
  restaurant: "Restaurante / Gastronomía",
  supermarket: "Supermercado / Minimarket",
  pharmacy: "Farmacia",
  distribution: "Distribuidora / Logística",
  services: "Servicios profesionales",
  other: "Otro",
};

export function AccountModal({ open, onClose }: Props) {
  const { user, profile, signOut } = useAuth();

  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = original; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || !user) return null;

  const name = profile?.full_name || user.user_metadata?.full_name || user.email?.split("@")[0] || "Usuario";
  const initial = name.charAt(0).toUpperCase();
  const createdAt = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "—";

  const rows = [
    { icon: Mail, label: "Email", value: user.email || "—" },
    { icon: Phone, label: "Teléfono", value: profile?.phone || user.user_metadata?.phone || "—" },
    { icon: Building2, label: "Empresa", value: profile?.company || user.user_metadata?.company || "—" },
    {
      icon: Briefcase,
      label: "Tipo de negocio",
      value: businessTypeLabels[profile?.business_type || user.user_metadata?.business_type || ""] || "—",
    },
    { icon: Calendar, label: "Miembro desde", value: createdAt },
  ];

  const handleSignOut = async () => {
    await signOut();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 md:p-6" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />

      <div
        className="relative w-full max-w-md rounded-3xl overflow-hidden animate-slide-up max-h-[92vh] overflow-y-auto"
        style={{
          background: "linear-gradient(145deg, #0A1A2F 0%, #0B0F1A 100%)",
          border: "1px solid rgba(0,102,255,0.25)",
          boxShadow: "0 40px 120px -20px rgba(0,102,255,0.4)",
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/5 transition-colors z-10"
          aria-label="Cerrar"
        >
          <X size={18} />
        </button>

        {/* Header con avatar */}
        <div
          className="relative pt-10 pb-6 px-6 text-center"
          style={{ background: "linear-gradient(180deg, rgba(0,102,255,0.15) 0%, transparent 100%)" }}
        >
          <div
            className="w-20 h-20 rounded-full mx-auto flex items-center justify-center text-3xl font-black mb-4"
            style={{
              background: "linear-gradient(135deg, #0066FF 0%, #00C2FF 100%)",
              boxShadow: "0 12px 40px rgba(0,102,255,0.5)",
              fontFamily: "'Poppins', sans-serif",
              color: "#FFFFFF",
            }}
          >
            {initial}
          </div>
          <h2 className="text-2xl font-extrabold mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
            {name}
          </h2>
          <p className="text-sm" style={{ color: "#8B94A8" }}>
            {user.email}
          </p>
        </div>

        <div className="px-6 pb-6">
          {/* Datos */}
          <div className="space-y-3 mb-6">
            {rows.map((row) => {
              const Icon = row.icon;
              return (
                <div
                  key={row.label}
                  className="flex items-center gap-4 p-4 rounded-2xl border"
                  style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.06)" }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(0,102,255,0.12)", border: "1px solid rgba(0,102,255,0.25)" }}
                  >
                    <Icon size={16} style={{ color: "#0066FF" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div
                      className="text-[10px] tracking-widest uppercase mb-0.5"
                      style={{ fontFamily: "'JetBrains Mono', monospace", color: "#8B94A8" }}
                    >
                      {row.label}
                    </div>
                    <div className="text-sm font-medium truncate" style={{ color: "#FFFFFF" }}>
                      {row.value}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cerrar sesión */}
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm border transition-all duration-300 hover:-translate-y-0.5 hover:bg-red-500/5"
            style={{
              borderColor: "rgba(239,68,68,0.3)",
              color: "#FCA5A5",
            }}
          >
            <LogOut size={16} />
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
}