import { useEffect } from "react";
import { X, Target, Eye, Heart, Rocket, Users, Award, Zap, ArrowRight } from "lucide-react";
import { WHATSAPP_PHONE, CONTACT_EMAIL } from "../data/social";

interface Props {
  open: boolean;
  onClose: () => void;
}

const values = [
  { icon: Rocket, title: "Innovación", desc: "Tecnología de punta en cada proyecto." },
  { icon: Heart, title: "Compromiso", desc: "Tu éxito es nuestro objetivo." },
  { icon: Award, title: "Calidad", desc: "Estándares profesionales garantizados." },
  { icon: Zap, title: "Velocidad", desc: "Entregas ágiles sin sacrificar calidad." },
  { icon: Users, title: "Cercanía", desc: "Soporte humano, real y siempre disponible." },
  { icon: Target, title: "Precisión", desc: "Soluciones hechas a la medida exacta." },
];

const stats = [
  { value: "120+", label: "Proyectos" },
  { value: "45+", label: "Clientes" },
  { value: "99%", label: "Uptime" },
  { value: "24/7", label: "Soporte" },
];

export function AboutModal({ open, onClose }: Props) {
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

  if (!open) return null;

  const waLink = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(
    "Hola ALZOVA SYSTEMS! Quiero conocer mas sobre ustedes."
  )}`;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 md:p-6" role="dialog" aria-modal="true">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-lg" onClick={onClose} />

      {/* Scanlines decorativas */}
      <div className="absolute inset-0 pointer-events-none opacity-20" style={{
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,194,255,0.08) 2px, rgba(0,194,255,0.08) 3px)",
      }} />

      {/* Panel */}
      <div
        className="relative w-full max-w-3xl max-h-[92vh] overflow-hidden flex flex-col animate-scale-in"
        style={{
          background: "linear-gradient(145deg, #0A1A2F 0%, #050810 100%)",
          border: "1px solid rgba(0,194,255,0.35)",
          boxShadow: "0 0 80px rgba(0,102,255,0.5), inset 0 0 60px rgba(0,102,255,0.05)",
        }}
      >
        {/* Brackets HUD - esquinas */}
        <span className="absolute top-3 left-3 w-6 h-6 pointer-events-none" style={{ borderTop: "2px solid #00C2FF", borderLeft: "2px solid #00C2FF" }} />
        <span className="absolute top-3 right-3 w-6 h-6 pointer-events-none" style={{ borderTop: "2px solid #00C2FF", borderRight: "2px solid #00C2FF" }} />
        <span className="absolute bottom-3 left-3 w-6 h-6 pointer-events-none" style={{ borderBottom: "2px solid #00C2FF", borderLeft: "2px solid #00C2FF" }} />
        <span className="absolute bottom-3 right-3 w-6 h-6 pointer-events-none" style={{ borderBottom: "2px solid #00C2FF", borderRight: "2px solid #00C2FF" }} />

        {/* Barra superior HUD */}
        <div
          className="relative px-6 md:px-8 py-4 flex items-center justify-between flex-shrink-0 border-b"
          style={{ borderColor: "rgba(0,194,255,0.2)", background: "rgba(0,102,255,0.05)" }}
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
              <span className="w-2 h-2 rounded-full bg-[#00C2FF] animate-pulse" style={{ animationDelay: "0.3s" }} />
              <span className="w-2 h-2 rounded-full bg-[#0066FF] animate-pulse" style={{ animationDelay: "0.6s" }} />
            </div>
            <span className="text-[10px] tracking-[0.3em] uppercase" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#00C2FF" }}>
              ALZOVA.ABOUT // v2.4
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/5 transition-colors"
            aria-label="Cerrar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Contenido scrollable */}
        <div className="flex-1 overflow-y-auto px-6 md:px-10 py-8 md:py-10 relative">
          {/* Glow decorativo de fondo */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full blur-3xl opacity-20 pointer-events-none" style={{ background: "#0066FF" }} />

          <div className="relative">
            {/* Encabezado */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5" style={{ background: "rgba(0,194,255,0.1)", border: "1px solid rgba(0,194,255,0.3)" }}>
                <span className="w-1.5 h-1.5 rounded-full bg-[#00C2FF] animate-pulse" />
                <span className="text-[10px] tracking-[0.3em] uppercase" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#00C2FF" }}>
                  Quienes somos
                </span>
              </div>

              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4 leading-[1.05]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Somos <span className="gradient-text">ALZOVA</span> SYSTEMS
              </h2>

              <p className="text-base md:text-lg leading-relaxed max-w-2xl mx-auto" style={{ color: "#B8C0D0" }}>
                Un equipo de ingenieros apasionados por construir tecnologia que <span style={{ color: "#00C2FF" }}>impulsa negocios reales</span>. Combinamos software de alto nivel con servicio tecnico especializado para que tu operacion nunca se detenga.
              </p>
            </div>

            {/* Stats HUD */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="relative p-4 rounded-xl border text-center"
                  style={{ background: "rgba(0,102,255,0.05)", borderColor: "rgba(0,194,255,0.2)" }}
                >
                  <div className="text-3xl font-black gradient-text" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    {s.value}
                  </div>
                  <div className="text-[10px] tracking-[0.2em] uppercase mt-1" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#8B94A8" }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Misión y Visión */}
            <div className="grid md:grid-cols-2 gap-4 mb-10">
              {[
                { icon: Target, title: "Nuestra Mision", desc: "Democratizar la tecnologia de alto nivel para que cualquier negocio, sin importar su tamano, tenga herramientas profesionales para crecer." },
                { icon: Eye, title: "Nuestra Vision", desc: "Ser el aliado tecnologico de referencia en Latinoamerica, reconocidos por nuestra excelencia tecnica y compromiso con cada cliente." },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="relative p-5 rounded-2xl border overflow-hidden transition-all duration-300 hover:-translate-y-1"
                    style={{ background: "rgba(10,26,47,0.6)", borderColor: "rgba(0,194,255,0.2)" }}
                  >
                    <div className="absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl opacity-30 pointer-events-none" style={{ background: "#0066FF" }} />
                    <div className="relative">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: "linear-gradient(135deg, #0066FF 0%, #00C2FF 100%)" }}>
                        <Icon size={18} className="text-white" />
                      </div>
                      <h3 className="text-base font-bold mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        {item.title}
                      </h3>
                      <p className="text-sm leading-relaxed" style={{ color: "#8B94A8" }}>
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Valores */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-5">
                <span className="text-[10px] tracking-[0.3em] uppercase" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#00C2FF" }}>
                  // Nuestros valores
                </span>
                <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, rgba(0,194,255,0.4), transparent)" }} />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {values.map((v) => {
                  const Icon = v.icon;
                  return (
                    <div
                      key={v.title}
                      className="p-4 rounded-xl border transition-all duration-300 hover:-translate-y-0.5 hover:border-[#00C2FF]/50"
                      style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.06)" }}
                    >
                      <Icon size={16} style={{ color: "#00C2FF" }} className="mb-2.5" />
                      <div className="text-sm font-bold mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        {v.title}
                      </div>
                      <div className="text-xs leading-relaxed" style={{ color: "#8B94A8" }}>
                        {v.desc}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CTA final */}
            <div
              className="relative rounded-2xl p-6 md:p-8 border overflow-hidden"
              style={{
                background: "linear-gradient(135deg, rgba(0,102,255,0.15) 0%, rgba(0,194,255,0.08) 100%)",
                borderColor: "rgba(0,102,255,0.4)",
              }}
            >
              <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl opacity-30 pointer-events-none" style={{ background: "#0066FF" }} />
              <div className="relative flex flex-col md:flex-row items-center justify-between gap-5">
                <div>
                  <h3 className="text-xl md:text-2xl font-black mb-1.5" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Hablemos de tu proyecto
                  </h3>
                  <p className="text-sm" style={{ color: "#B8C0D0" }}>
                    Cuentanos que necesitas y te ayudamos a hacerlo realidad.
                  </p>
                </div>
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="neon-btn group inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-white whitespace-nowrap"
                  style={{
                    background: "linear-gradient(135deg, #0066FF 0%, #0052CC 100%)",
                    fontFamily: "'Poppins', sans-serif",
                    border: "1px solid rgba(0,194,255,0.5)",
                  }}
                >
                  <span className="relative z-10">Contactanos</span>
                  <ArrowRight size={16} className="relative z-10 transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </div>

            {/* Footer HUD */}
            <div className="mt-8 flex items-center justify-between text-[10px]" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#8B94A8" }}>
              <span>ALZOVA.SYSTEMS // {new Date().getFullYear()}</span>
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
                ONLINE
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}