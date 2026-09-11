import { ArrowRight, Clock, Award, Headphones } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { Reveal } from "../ui/Reveal";
import { Badge } from "../ui/Badge";
import { IMAGES } from "../../data/images";
import { WHATSAPP_LINK, CONTACT_EMAIL } from "../../data/social";

export function CTA() {
  return (
    <section id="contacto" className="py-28 md:py-36 relative overflow-hidden">
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

      <div className="relative max-w-4xl mx-auto px-6 text-center">
        <Reveal>
          <Badge>Empieza hoy</Badge>
          <h2
            className="mt-6 text-4xl md:text-6xl font-extrabold tracking-tight leading-tight"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            ¿Listo para <span className="gradient-text">transformar</span> tu negocio?
          </h2>
          <p className="mt-6 text-lg max-w-2xl mx-auto" style={{ color: "#8B94A8" }}>
            Agenda una demo gratuita y descubre cómo ALZOVA SYSTEMS puede impulsar tu operación.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 px-7 py-4 rounded-xl font-semibold text-white"
              style={{
                background: "linear-gradient(135deg, #0066FF 0%, #0052CC 100%)",
                boxShadow: "0 0 40px rgba(0,102,255,0.45)",
              }}
            >
              <FaWhatsapp size={18} />
              Agenda una demo
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="inline-flex items-center gap-2 px-7 py-4 rounded-xl font-semibold border"
              style={{
                borderColor: "rgba(255,255,255,0.12)",
                background: "rgba(255,255,255,0.03)",
                color: "#FFFFFF",
              }}
            >
              {CONTACT_EMAIL}
            </a>
          </div>

          <div
            className="mt-10 flex flex-wrap justify-center gap-8 text-xs"
            style={{ fontFamily: "'JetBrains Mono', monospace", color: "#8B94A8" }}
          >
            <span className="flex items-center gap-2">
              <Clock size={14} style={{ color: "#0066FF" }} /> Respuesta en &lt; 24h
            </span>
            <span className="flex items-center gap-2">
              <Award size={14} style={{ color: "#0066FF" }} /> +120 proyectos
            </span>
            <span className="flex items-center gap-2">
              <Headphones size={14} style={{ color: "#0066FF" }} /> Soporte 24/7
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}