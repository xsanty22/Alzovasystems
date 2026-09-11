import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { WHATSAPP_PHONE } from "../data/social";

const quickReplies = [
  { label: "💻 Quiero software a la medida", msg: "Hola, quiero cotizar un software a la medida para mi negocio." },
  { label: "🖨️ Reparación de impresora",     msg: "Hola, necesito soporte técnico / reparación de una impresora." },
  { label: "🖥️ Mantenimiento de PCs",        msg: "Hola, quiero información sobre mantenimiento de computadoras." },
  { label: "🌐 Redes y WiFi",                msg: "Hola, necesito ayuda con configuración de red / WiFi." },
];

export function WhatsAppFloat() {
  const [open, setOpen] = useState(false);
  const [showTip, setShowTip] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowTip(true), 4000);
    const t2 = setTimeout(() => setShowTip(false), 12000);
    return () => { clearTimeout(t); clearTimeout(t2); };
  }, []);

  const waLink = (msg: string) => `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(msg)}`;

  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 2147483647 }}>
      {open && (
        <div className="mb-3 w-[320px] rounded-2xl overflow-hidden shadow-2xl animate-slide-up" style={{ background: "linear-gradient(145deg, #0A1A2F 0%, #0B0F1A 100%)", border: "1px solid rgba(37,211,102,0.25)" }}>
          <div className="p-4 flex items-center gap-3" style={{ background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)" }}>
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <FaWhatsapp size={22} className="text-white" />
            </div>
            <div className="flex-1">
              <div className="text-white font-bold text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>ALZOVA SYSTEMS</div>
              <div className="text-[11px] text-white/85">En línea · Responde rápido</div>
            </div>
            <button onClick={() => setOpen(false)} className="w-8 h-8 rounded-lg flex items-center justify-center text-white/80 hover:bg-white/10" aria-label="Cerrar">
              <X size={16} />
            </button>
          </div>
          <div className="p-4 space-y-2">
            <p className="text-sm mb-3" style={{ color: "#E5E7EB" }}>¡Hola! 👋 ¿En qué podemos ayudarte?</p>
            {quickReplies.map((q) => (
              <a key={q.label} href={waLink(q.msg)} target="_blank" rel="noopener noreferrer" className="block w-full px-3.5 py-2.5 rounded-xl text-sm" style={{ background: "rgba(37,211,102,0.08)", border: "1px solid rgba(37,211,102,0.2)", color: "#E5E7EB" }}>
                {q.label}
              </a>
            ))}
            <a href={waLink("¡Hola ALZOVA SYSTEMS! Quiero hablar con un asesor.")} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-white text-sm mt-2" style={{ background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)" }}>
              <FaWhatsapp size={16} /> Abrir WhatsApp
            </a>
          </div>
        </div>
      )}

      <div className="flex flex-col items-end gap-3">
        {showTip && !open && (
          <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium animate-slide-in-right" style={{ background: "rgba(10,26,47,0.95)", border: "1px solid rgba(37,211,102,0.3)", color: "#FFFFFF" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse" />
            ¿Necesitas ayuda? Escríbenos
          </div>
        )}

        <button
          onClick={() => { setOpen(!open); setShowTip(false); }}
          className="relative w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
          style={{ background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)", boxShadow: "0 12px 32px rgba(37,211,102,0.45)" }}
          aria-label="Abrir WhatsApp"
        >
          {!open && <span className="absolute inset-0 rounded-full animate-ping-slow" style={{ background: "#25D366", opacity: 0.3 }} />}
          {open ? <X size={22} className="text-white" /> : <FaWhatsapp size={26} className="text-white" />}
          {showTip && !open && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white animate-bounce-in" style={{ background: "#EF4444" }}>1</span>
          )}
        </button>
      </div>
    </div>
  );
}