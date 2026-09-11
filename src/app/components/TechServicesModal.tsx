import { useEffect } from "react";
import { X, ArrowRight, MessageCircle, Headphones } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { techServiceCategories } from "../data/techServices";
import { WHATSAPP_PHONE, CONTACT_EMAIL } from "../data/social";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function TechServicesModal({ open, onClose }: Props) {
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

  const formatPrice = (n: number, from?: boolean) => {
    if (n === 0) return "Gratis";
    const price = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(n);
    return from ? `Desde ${price}` : price;
  };

  const waMessage = encodeURIComponent(
    "Hola ALZOVA SYSTEMS! Quiero información sobre sus servicios técnicos (mantenimiento, soporte y reparación)."
  );
  const waLink = `https://wa.me/${WHATSAPP_PHONE}?text=${waMessage}`;
  const mailLink = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Consulta de servicios técnicos")}&body=${waMessage}`;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 md:p-6" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />

      <div
        className="relative w-full max-w-5xl max-h-[92vh] rounded-3xl overflow-hidden flex flex-col animate-slide-up"
        style={{
          background: "linear-gradient(145deg, #0A1A2F 0%, #0B0F1A 100%)",
          border: "1px solid rgba(0,194,255,0.25)",
          boxShadow: "0 40px 120px -20px rgba(0,194,255,0.4)",
        }}
      >
        <div
          className="relative px-5 md:px-8 py-4 md:py-5 flex items-center justify-between border-b flex-shrink-0"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #00C2FF 0%, #128C7E 100%)" }}
            >
              <Headphones size={18} className="text-white" />
            </div>
            <div>
              <div className="text-base md:text-lg font-bold" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Servicios técnicos ALZOVA
              </div>
              <div className="text-[10px] md:text-xs" style={{ color: "#8B94A8", fontFamily: "'JetBrains Mono', monospace" }}>
                Precios de referencia · Presupuesto final tras diagnóstico
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/5 transition-colors"
            aria-label="Cerrar"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 md:px-8 py-6 space-y-8">
          {techServiceCategories.map((cat) => (
            <div key={cat.id}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl" aria-hidden="true">{cat.icon}</span>
                <h3 className="text-lg md:text-xl font-bold" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  {cat.title}
                </h3>
                <span
                  className="text-[10px] tracking-widest uppercase px-2.5 py-1 rounded-full"
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    color: "#00C2FF",
                    background: "rgba(0,194,255,0.08)",
                    border: "1px solid rgba(0,194,255,0.2)",
                  }}
                >
                  {cat.services.length} servicios
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                {cat.services.map((s) => (
                  <div
                    key={s.label}
                    className="flex items-start justify-between gap-4 p-4 rounded-xl border transition-all duration-300 hover:-translate-y-0.5"
                    style={{
                      background: "rgba(255,255,255,0.02)",
                      borderColor: "rgba(255,255,255,0.06)",
                    }}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        {s.label}
                      </div>
                      {s.desc && (
                        <div className="text-xs leading-relaxed" style={{ color: "#8B94A8" }}>
                          {s.desc}
                        </div>
                      )}
                    </div>
                    <div
                      className="text-sm font-bold flex-shrink-0"
                      style={{ color: "#00C2FF", fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      {formatPrice(s.price, s.from)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div
            className="rounded-2xl p-5 md:p-6 border"
            style={{ background: "rgba(0,194,255,0.05)", borderColor: "rgba(0,194,255,0.2)" }}
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="text-sm font-bold mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  ¿No encuentras lo que buscas?
                </div>
                <div className="text-xs" style={{ color: "#8B94A8" }}>
                  Hacemos servicio técnico personalizado. Cuéntanos qué necesitas.
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-white text-sm transition-all duration-300 hover:-translate-y-0.5"
                  style={{
                    background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)",
                    boxShadow: "0 8px 24px rgba(37,211,102,0.35)",
                  }}
                >
                  <FaWhatsapp size={16} />
                  Consultar
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </a>
                <a
                  href={mailLink}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm border transition-colors hover:bg-white/5"
                  style={{ borderColor: "rgba(255,255,255,0.12)", color: "#FFFFFF" }}
                >
                  <MessageCircle size={16} />
                  Email
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}