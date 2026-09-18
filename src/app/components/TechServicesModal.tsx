import { useState, useEffect } from "react";
import { X, ArrowRight, Headphones, Loader2 } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { techServiceCategories } from "../data/techServices";
import { WHATSAPP_PHONE } from "../data/social";
import { supabase } from "../lib/supabase";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function TechServicesModal({ open, onClose }: Props) {
  // Estados del formulario
  const [serviceName, setServiceName] = useState("");
  const [servicePhone, setServicePhone] = useState("");
  const [serviceMessage, setServiceMessage] = useState("");
  const [serviceSubmitting, setServiceSubmitting] = useState(false);
  const [serviceSaved, setServiceSaved] = useState(false);

  // Scroll lock + ESC
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

  // Formato de precio en COP
  const formatPrice = (n: number, from?: boolean) => {
    if (n === 0) return "Gratis";
    const price = new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(n);
    return from ? `Desde ${price}` : price;
  };

  // Guardar lead + abrir WhatsApp
  const handleServiceRequest = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!serviceName.trim() || servicePhone.replace(/\D/g, "").length < 7) {
      alert("Por favor completa tu nombre y teléfono");
      return;
    }

    setServiceSubmitting(true);

    const { error } = await supabase.from("leads").insert({
      source: "servicio_tecnico",
      name: serviceName.trim(),
      email: null,
      phone: servicePhone.trim(),
      company: null,
      message: serviceMessage.trim() || "Solicitud de servicio técnico",
      metadata: { requested_from: "tech_services_modal" },
      status: "new",
    });

    setServiceSubmitting(false);

    if (error) {
      console.error("Error guardando lead:", error);
      alert("Hubo un error. Intenta de nuevo.");
      return;
    }

    setServiceSaved(true);
    setTimeout(() => {
      const msg = encodeURIComponent(
        `Hola ALZOVA! Soy ${serviceName.trim()}. ${serviceMessage.trim() || "Quiero información sobre servicios técnicos."}`
      );
      window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${msg}`, "_blank");
      setServiceSaved(false);
      setServiceName("");
      setServicePhone("");
      setServiceMessage("");
    }, 1200);
  };

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
        {/* ══════════ HEADER ══════════ */}
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

        {/* ══════════ BODY ══════════ */}
        <div className="flex-1 overflow-y-auto px-5 md:px-8 py-6 space-y-8">
          {/* Categorías de servicios */}
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

          {/* ══════════ FORMULARIO DE SOLICITUD ══════════ */}
          <div
            className="rounded-2xl p-5 md:p-6 border"
            style={{ background: "rgba(0,194,255,0.05)", borderColor: "rgba(0,194,255,0.2)" }}
          >
            {serviceSaved ? (
              <div className="text-center py-4 animate-slide-up">
                <div className="text-3xl mb-2">✅</div>
                <div className="text-sm font-bold" style={{ color: "#86EFAC" }}>
                  ¡Solicitud registrada! Abriendo WhatsApp...
                </div>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <div className="text-sm font-bold mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    ¿Necesitas un servicio? Cuéntanos quién eres
                  </div>
                  <div className="text-xs" style={{ color: "#8B94A8" }}>
                    Te contactamos en menos de 1 hora
                  </div>
                </div>

                <form onSubmit={handleServiceRequest} className="space-y-2">
                  <div className="grid sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Tu nombre *"
                      value={serviceName}
                      onChange={(e) => setServiceName(e.target.value)}
                      required
                      className="px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:border-[#00C2FF]"
                      style={{ background: "rgba(0,0,0,0.3)", borderColor: "rgba(255,255,255,0.12)", color: "#FFFFFF" }}
                    />
                    <input
                      type="tel"
                      placeholder="Teléfono *"
                      value={servicePhone}
                      onChange={(e) => setServicePhone(e.target.value)}
                      required
                      className="px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:border-[#00C2FF]"
                      style={{ background: "rgba(0,0,0,0.3)", borderColor: "rgba(255,255,255,0.12)", color: "#FFFFFF" }}
                    />
                  </div>

                  <textarea
                    placeholder="¿Qué servicio necesitas? (opcional)"
                    value={serviceMessage}
                    onChange={(e) => setServiceMessage(e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:border-[#00C2FF] resize-none"
                    style={{ background: "rgba(0,0,0,0.3)", borderColor: "rgba(255,255,255,0.12)", color: "#FFFFFF" }}
                  />

                  <button
                    type="submit"
                    disabled={serviceSubmitting}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white text-sm transition-all duration-300 hover:-translate-y-0.5"
                    style={{
                      background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)",
                      boxShadow: "0 8px 24px rgba(37,211,102,0.35)",
                      cursor: serviceSubmitting ? "not-allowed" : "pointer",
                      opacity: serviceSubmitting ? 0.6 : 1,
                      border: "none",
                    }}
                  >
                    {serviceSubmitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <FaWhatsapp size={16} />
                        Solicitar servicio
                        <ArrowRight size={14} />
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}