import { useState } from "react";
import { ArrowRight, Clock, Award, Headphones, Calendar, Mail, Check, Sparkles } from "lucide-react";
import { Reveal } from "../ui/Reveal";
import { Badge } from "../ui/Badge";
import { IMAGES } from "../../data/images";
import { WHATSAPP_PHONE, CONTACT_EMAIL } from "../../data/social";
import { supabase } from "../../lib/supabase";

export function CTA() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    const { error } = await supabase.from("leads").insert({
      source: "newsletter",
      email: email.trim().toLowerCase(),
      name: null,
      phone: null,
      company: null,
      message: null,
      metadata: { subscribed_from: "cta_final" },
      status: "new",
    });

    if (error) {
      console.error("Error guardando suscriptor:", error);
      return;
    }

    setSubscribed(true);
    setTimeout(() => {
      setSubscribed(false);
      setEmail("");
    }, 4000);
  };

  const waLink = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(
    "Hola ALZOVA! Quiero agendar una llamada de diagnóstico."
  )}`;

  return (
    <section id="contacto" className="py-20 md:py-24 relative overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={IMAGES.circuit}
          alt=""
          className="w-full h-full object-cover animate-kenburns-slow"
          style={{ opacity: 0.12 }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse at center, rgba(0,102,255,0.15) 0%, #0B0B0B 70%)" }}
        />
      </div>

      <div className="relative max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <Reveal>
            <Badge>Hablemos</Badge>
            <h2
              className="mt-6 text-4xl md:text-5xl font-extrabold tracking-tight leading-tight"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              ¿Todavía con <span className="gradient-text">dudas</span>?
            </h2>
            <p className="mt-5 text-lg max-w-lg" style={{ color: "#B8C0D0" }}>
              Agenda <strong style={{ color: "#FFFFFF" }}>15 minutos</strong> con un ingeniero de ALZOVA.
              Sin vendedores, sin compromiso.
            </p>

            <ul className="mt-8 space-y-3">
              {["Diagnóstico honesto", "Sin presión comercial", "Sin tarjeta de crédito"].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span
                    className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.4)" }}
                  >
                    <Check size={12} style={{ color: "#22C55E" }} />
                  </span>
                  <span className="text-sm" style={{ color: "#C4CCDB" }}>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="neon-btn group inline-flex items-center gap-2 px-6 py-4 rounded-xl font-bold text-white"
                style={{
                  background: "linear-gradient(135deg, #0066FF 0%, #0052CC 100%)",
                  fontFamily: "'Poppins', sans-serif",
                  border: "1px solid rgba(0,194,255,0.5)",
                }}
              >
                <Calendar size={16} className="relative z-10" />
                <span className="relative z-10">Agendar llamada</span>
                <ArrowRight size={16} className="relative z-10" />
              </a>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="inline-flex items-center gap-2 px-6 py-4 rounded-xl font-semibold text-sm border"
                style={{ borderColor: "rgba(255,255,255,0.12)", color: "#FFFFFF" }}
              >
                <Mail size={14} />
                Enviar email
              </a>
            </div>

            <div
              className="mt-8 pt-6 flex flex-wrap gap-6 text-xs border-t"
              style={{
                borderColor: "rgba(255,255,255,0.06)",
                color: "#8B94A8",
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              <span className="flex items-center gap-2">
                <Clock size={12} style={{ color: "#0066FF" }} />
                Respuesta en &lt; 4h
              </span>
              <span className="flex items-center gap-2">
                <Award size={12} style={{ color: "#0066FF" }} />
                +120 proyectos
              </span>
              <span className="flex items-center gap-2">
                <Headphones size={12} style={{ color: "#0066FF" }} />
                Soporte 24/7
              </span>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <div
              className="relative rounded-3xl border p-8 md:p-10 overflow-hidden"
              style={{
                background: "linear-gradient(145deg, rgba(10,26,47,0.7), rgba(11,11,11,0.7))",
                borderColor: "rgba(0,102,255,0.25)",
              }}
            >
              <div
                className="absolute -top-32 -right-32 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none"
                style={{ background: "#0066FF" }}
              />

              <div className="relative">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                  style={{
                    background: "linear-gradient(135deg, #0066FF 0%, #00C2FF 100%)",
                    boxShadow: "0 12px 40px rgba(0,102,255,0.5)",
                  }}
                >
                  <Sparkles size={24} className="text-white" />
                </div>

                <h3
                  className="text-2xl md:text-3xl font-extrabold mb-3 leading-tight"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  No estás listo aún?
                </h3>
                <p className="text-base mb-6 leading-relaxed" style={{ color: "#B8C0D0" }}>
                  Únete a <strong style={{ color: "#FFFFFF" }}>500+ dueños de negocio</strong> que reciben 1 email por semana.
                </p>

                <ul className="space-y-2.5 mb-7">
                  {["Casos de éxito reales", "Tips de automatización", "Ofertas exclusivas"].map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-sm" style={{ color: "#C4CCDB" }}>
                      <span
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ background: "#00C2FF", boxShadow: "0 0 6px #00C2FF" }}
                      />
                      {item}
                    </li>
                  ))}
                </ul>

                {subscribed ? (
                  <div
                    className="p-5 rounded-xl text-center"
                    style={{
                      background: "rgba(34,197,94,0.08)",
                      border: "1px solid rgba(34,197,94,0.3)",
                    }}
                  >
                    <div className="text-3xl mb-2">🎉</div>
                    <div className="text-sm font-bold mb-1" style={{ color: "#86EFAC" }}>
                      ¡Suscripto!
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="email"
                      placeholder="tu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="flex-1 px-4 py-3.5 rounded-xl border text-sm focus:outline-none focus:border-[#0066FF]"
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        borderColor: "rgba(255,255,255,0.08)",
                        color: "#FFFFFF",
                      }}
                    />
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-bold text-white text-sm whitespace-nowrap"
                      style={{
                        background: "linear-gradient(135deg, #0066FF 0%, #0052CC 100%)",
                        fontFamily: "'Poppins', sans-serif",
                        cursor: "pointer",
                      }}
                    >
                      Suscribirme
                      <ArrowRight size={14} />
                    </button>
                  </form>
                )}

                <div className="mt-4 text-[10px]" style={{ color: "#4A5568", fontFamily: "'JetBrains Mono', monospace" }}>
                  Sin spam. Cancela cuando quieras.
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}