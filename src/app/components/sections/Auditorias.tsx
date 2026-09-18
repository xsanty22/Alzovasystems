import { useState } from "react";
import { ArrowRight, Search, Globe, Code2, Shield, CheckCircle2, Sparkles, User, Mail, Phone, Loader2 } from "lucide-react";
import { Reveal } from "../ui/Reveal";
import { Badge } from "../ui/Badge";
import { WHATSAPP_PHONE } from "../../data/social";
import { supabase } from "../../lib/supabase";

const auditTypes = [
  {
    icon: Globe,
    title: "Auditoria Web",
    desc: "Velocidad, SEO, accesibilidad, seguridad y experiencia de usuario.",
  },
  {
    icon: Code2,
    title: "Auditoria de Software",
    desc: "Rendimiento, arquitectura, deuda tecnica y escalabilidad.",
  },
  {
    icon: Search,
    title: "Auditoria de POS / ERP",
    desc: "Revisamos tu sistema de ventas, inventario y reportes.",
  },
  {
    icon: Shield,
    title: "Auditoria de Seguridad",
    desc: "Vulnerabilidades, respaldos, accesos y buenas practicas.",
  },
];

export function Auditorias() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.includes("@") || phone.replace(/\D/g, "").length < 7) {
      alert("Por favor completa todos los campos correctamente");
      return;
    }

    setSubmitting(true);

    const { error } = await supabase.from("leads").insert({
      source: "auditoria",
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      company: null,
      message: null,
      metadata: { requested_audit: true },
      status: "new",
    });

    setSubmitting(false);

    if (error) {
      console.error("Error guardando lead:", error);
      alert("Hubo un error. Intenta de nuevo.");
      return;
    }

    setSaved(true);
    setTimeout(() => {
      const msg = encodeURIComponent(
        `Hola ALZOVA! Soy ${name.trim()}. Quiero agendar mi auditoria gratuita. Mi email: ${email.trim()}`
      );
      window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${msg}`, "_blank");
      setSaved(false);
      setName("");
      setEmail("");
      setPhone("");
    }, 1200);
  };

  return (
    <section id="auditorias" className="py-20 md:py-24 relative" style={{ background: "linear-gradient(180deg, transparent 0%, rgba(10,26,47,0.5) 50%, transparent 100%)" }}>
      <div className="max-w-7xl mx-auto px-6">
        <Reveal>
          <Badge>Auditorias gratuitas</Badge>
          <h2 className="mt-6 text-4xl md:text-5xl font-extrabold tracking-tight max-w-3xl" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Auditorias <span className="gradient-text">sin costo</span> para tu negocio
          </h2>
          <p className="mt-5 text-lg max-w-2xl" style={{ color: "#8B94A8" }}>
            Revisamos tu pagina web, software, sistema POS o infraestructura y te entregamos un informe con oportunidades de mejora. Totalmente gratis, sin compromiso.
          </p>
        </Reveal>

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {auditTypes.map((a, i) => {
            const Icon = a.icon;
            return (
              <Reveal key={a.title} delay={i * 80}>
                <div className="group relative h-full p-6 rounded-2xl border transition-all duration-500 hover:-translate-y-1" style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.06)" }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform duration-500 group-hover:scale-110" style={{ background: "rgba(0,102,255,0.12)", border: "1px solid rgba(0,102,255,0.25)" }}>
                    <Icon size={20} style={{ color: "#0066FF" }} />
                  </div>
                  <h3 className="text-base font-bold mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>{a.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#8B94A8" }}>{a.desc}</p>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={300}>
          <div
            className="mt-14 rounded-3xl border p-8 md:p-12 relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(0,102,255,0.15) 0%, rgba(0,194,255,0.08) 100%)",
              borderColor: "rgba(0,102,255,0.35)",
              boxShadow: "0 20px 60px -20px rgba(0,102,255,0.4)",
            }}
          >
            <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-30 blur-3xl pointer-events-none" style={{ background: "#0066FF" }} />

            <div className="relative grid lg:grid-cols-[1fr_auto] gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5" style={{ background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.35)" }}>
                  <Sparkles size={14} style={{ color: "#22C55E" }} />
                  <span className="text-xs font-bold tracking-widest uppercase" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#22C55E" }}>100% Gratis</span>
                </div>

                <h3 className="text-3xl md:text-4xl font-extrabold leading-tight mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Auditamos tu web, software o POS <span style={{ color: "#0066FF" }}>sin costo</span>
                </h3>

                <p className="text-base leading-relaxed mb-6 max-w-xl" style={{ color: "#C4CCDB" }}>
                  Nuestro equipo tecnico analiza tu proyecto y te entrega un informe claro con recomendaciones concretas. Sin compromiso, sin letra chica.
                </p>

                <ul className="space-y-2.5 mb-8">
                  {["Informe detallado por escrito", "Recomendaciones priorizadas", "Sin obligacion de contratar nada"].map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <CheckCircle2 size={18} style={{ color: "#22C55E", flexShrink: 0 }} />
                      <span className="text-sm" style={{ color: "#E5E7EB" }}>{item}</span>
                    </li>
                  ))}
                </ul>

                {saved ? (
                  <div
                    className="p-5 rounded-2xl text-center animate-slide-up"
                    style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", maxWidth: 420 }}
                  >
                    <div className="text-2xl mb-2">✅</div>
                    <div className="text-sm font-bold" style={{ color: "#86EFAC" }}>
                      ¡Solicitud recibida! Abriendo WhatsApp...
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-3 max-w-md">
                    <div className="relative">
                      <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#8B94A8" }} />
                      <input
                        type="text"
                        placeholder="Tu nombre *"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full pl-9 pr-3 py-3 rounded-xl border text-sm focus:outline-none focus:border-[#0066FF]"
                        style={{ background: "rgba(0,0,0,0.3)", borderColor: "rgba(255,255,255,0.15)", color: "#FFFFFF" }}
                      />
                    </div>
                    <div className="relative">
                      <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#8B94A8" }} />
                      <input
                        type="email"
                        placeholder="tu@email.com *"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full pl-9 pr-3 py-3 rounded-xl border text-sm focus:outline-none focus:border-[#0066FF]"
                        style={{ background: "rgba(0,0,0,0.3)", borderColor: "rgba(255,255,255,0.15)", color: "#FFFFFF" }}
                      />
                    </div>
                    <div className="relative">
                      <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#8B94A8" }} />
                      <input
                        type="tel"
                        placeholder="Teléfono / WhatsApp *"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        className="w-full pl-9 pr-3 py-3 rounded-xl border text-sm focus:outline-none focus:border-[#0066FF]"
                        style={{ background: "rgba(0,0,0,0.3)", borderColor: "rgba(255,255,255,0.15)", color: "#FFFFFF" }}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="neon-btn w-full inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl font-bold text-white transition-all duration-300"
                      style={{
                        background: "linear-gradient(135deg, #0066FF 0%, #0052CC 100%)",
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: "15px",
                        border: "1px solid rgba(0,194,255,0.5)",
                        cursor: submitting ? "not-allowed" : "pointer",
                        opacity: submitting ? 0.6 : 1,
                      }}
                    >
                      {submitting ? (
                        <>
                          <Loader2 size={16} className="animate-spin relative z-10" />
                          <span className="relative z-10">Guardando...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles size={16} className="relative z-10" />
                          <span className="relative z-10">Solicitar auditoria gratis</span>
                          <ArrowRight size={16} className="relative z-10" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>

              <div className="hidden lg:flex flex-col items-center justify-center">
                <div className="w-48 h-48 rounded-full flex flex-col items-center justify-center" style={{ background: "linear-gradient(135deg, #0066FF 0%, #00C2FF 100%)", boxShadow: "0 24px 80px -20px rgba(0,102,255,0.6)" }}>
                  <span className="text-6xl font-black" style={{ fontFamily: "'Poppins', sans-serif", color: "#FFFFFF" }}>$0</span>
                  <span className="text-xs tracking-widest uppercase mt-1" style={{ fontFamily: "'JetBrains Mono', monospace", color: "rgba(255,255,255,0.9)" }}>Sin costo</span>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}