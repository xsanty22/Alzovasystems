import { useEffect } from "react";
import { X, ArrowRight, AlertCircle, Sparkles, TrendingUp, Users, Zap } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import type { Product } from "../data/products";
import type { ProductDetail } from "../data/productDetails";
import { WHATSAPP_PHONE } from "../data/social";

interface Props {
  product: Product;
  detail: ProductDetail;
  onClose: () => void;
  onOpenQuote: () => void;
}

export function ProductDetailModal({ product, detail, onClose, onOpenQuote }: Props) {
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = original;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const Icon = product.icon;
  const waLink = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(
    `Hola ALZOVA! Quiero una demo de ${product.name}. Vi la info en la web.`
  )}`;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 md:p-6" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose} />

      <div
        className="relative w-full max-w-4xl max-h-[92vh] rounded-3xl overflow-hidden flex flex-col animate-slide-up"
        style={{
          background: "linear-gradient(145deg, #0A1A2F 0%, #0B0F1A 100%)",
          border: `1px solid ${product.accent}50`,
          boxShadow: `0 40px 120px -20px ${product.accent}60`,
        }}
      >
        {/* ══════════ HEADER ══════════ */}
        <div
          className="relative px-6 md:px-10 py-8 flex items-center justify-between flex-shrink-0"
          style={{
            background: `linear-gradient(135deg, ${product.accent}25 0%, transparent 100%)`,
            borderBottom: `1px solid ${product.accent}30`,
          }}
        >
          <div className="flex items-center gap-5">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{
                background: `linear-gradient(135deg, ${product.accent} 0%, ${product.accent}AA 100%)`,
                boxShadow: `0 12px 40px ${product.accent}55`,
              }}
            >
              <Icon size={28} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-2xl md:text-3xl font-extrabold" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  {product.name}
                </h2>
                {product.badge && product.badgeColor && (
                  <span
                    className="text-[10px] tracking-widest uppercase px-2.5 py-1 rounded-full font-bold"
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      color: product.badgeColor,
                      background: `${product.badgeColor}20`,
                      border: `1px solid ${product.badgeColor}50`,
                    }}
                  >
                    {product.badge}
                  </span>
                )}
              </div>
              <p className="text-sm md:text-base" style={{ color: "#B8C0D0" }}>
                {detail.tagline}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/5 transition-colors flex-shrink-0"
            aria-label="Cerrar"
          >
            <X size={20} />
          </button>
        </div>

        {/* ══════════ BODY ══════════ */}
        <div className="flex-1 overflow-y-auto px-6 md:px-10 py-8 space-y-10">
          {/* DOLOR */}
          <section>
            <div className="flex items-center gap-2 mb-5">
              <AlertCircle size={16} style={{ color: "#F59E0B" }} />
              <span className="text-xs tracking-[0.2em] uppercase font-bold" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#F59E0B" }}>
                ¿Te pasa esto?
              </span>
            </div>
            <ul className="grid md:grid-cols-2 gap-3">
              {detail.painPoints.map((pain, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 p-4 rounded-xl border"
                  style={{ background: "rgba(245,158,11,0.05)", borderColor: "rgba(245,158,11,0.2)" }}
                >
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-2" style={{ background: "#F59E0B", boxShadow: "0 0 8px #F59E0B" }} />
                  <span className="text-sm leading-relaxed" style={{ color: "#E5E7EB" }}>{pain}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* SOLUCIÓN */}
          <section>
            <div className="flex items-center gap-2 mb-5">
              <Sparkles size={16} style={{ color: product.accent }} />
              <span className="text-xs tracking-[0.2em] uppercase font-bold" style={{ fontFamily: "'JetBrains Mono', monospace", color: product.accent }}>
                Cómo lo resuelve
              </span>
            </div>
            <p
              className="text-base leading-relaxed p-6 rounded-2xl border-l-4"
              style={{
                background: `${product.accent}08`,
                borderLeftColor: product.accent,
                borderTop: `1px solid ${product.accent}20`,
                borderRight: `1px solid ${product.accent}20`,
                borderBottom: `1px solid ${product.accent}20`,
                color: "#C4CCDB",
              }}
            >
              {detail.solution}
            </p>
          </section>

          {/* FEATURES */}
          <section>
            <div className="flex items-center gap-2 mb-5">
              <Zap size={16} style={{ color: product.accent }} />
              <span className="text-xs tracking-[0.2em] uppercase font-bold" style={{ fontFamily: "'JetBrains Mono', monospace", color: product.accent }}>
                Funcionalidades clave
              </span>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {detail.features.map((f, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl border transition-all duration-300 hover:-translate-y-0.5"
                  style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.06)" }}
                >
                  <div className="text-2xl mb-2">{f.icon}</div>
                  <div className="text-sm font-bold mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    {f.title}
                  </div>
                  <div className="text-xs leading-relaxed" style={{ color: "#8B94A8" }}>
                    {f.desc}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* BENEFICIOS */}
          <section>
            <div className="flex items-center gap-2 mb-5">
              <TrendingUp size={16} style={{ color: "#22C55E" }} />
              <span className="text-xs tracking-[0.2em] uppercase font-bold" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#22C55E" }}>
                Resultados medibles
              </span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {detail.benefits.map((b, i) => (
                <div
                  key={i}
                  className="p-5 rounded-2xl border text-center"
                  style={{
                    background: "linear-gradient(135deg, rgba(34,197,94,0.08), rgba(34,197,94,0.02))",
                    borderColor: "rgba(34,197,94,0.25)",
                  }}
                >
                  <div
                    className="text-3xl md:text-4xl font-black mb-2"
                    style={{
                      fontFamily: "'Poppins', sans-serif",
                      background: "linear-gradient(135deg, #22C55E, #00C2FF)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {b.metric}
                  </div>
                  <div className="text-xs" style={{ color: "#B8C0D0", fontFamily: "'JetBrains Mono', monospace" }}>
                    {b.label}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* IDEAL PARA */}
          <section>
            <div className="flex items-center gap-2 mb-5">
              <Users size={16} style={{ color: product.accent }} />
              <span className="text-xs tracking-[0.2em] uppercase font-bold" style={{ fontFamily: "'JetBrains Mono', monospace", color: product.accent }}>
                Ideal para
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {detail.idealFor.map((item) => (
                <span
                  key={item}
                  className="px-3.5 py-2 rounded-full border text-xs font-medium"
                  style={{
                    background: `${product.accent}10`,
                    borderColor: `${product.accent}40`,
                    color: "#FFFFFF",
                  }}
                >
                  {item}
                </span>
              ))}
            </div>
          </section>

          {/* TESTIMONIO */}
          {detail.testimonial && (
            <section>
              <div
                className="p-6 rounded-2xl border relative overflow-hidden"
                style={{
                  background: `${product.accent}08`,
                  borderColor: `${product.accent}30`,
                }}
              >
                <div className="text-4xl mb-3" style={{ color: product.accent, opacity: 0.3 }}>"</div>
                <p className="text-base leading-relaxed mb-5 italic" style={{ color: "#E5E7EB" }}>
                  {detail.testimonial.text}
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                    style={{ background: `linear-gradient(135deg, ${product.accent}, ${product.accent}AA)`, color: "#FFFFFF" }}
                  >
                    {detail.testimonial.author.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{detail.testimonial.author}</div>
                    <div className="text-xs" style={{ color: "#8B94A8" }}>{detail.testimonial.role}</div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* PRECIO */}
          <section
            className="p-6 md:p-8 rounded-2xl border text-center"
            style={{
              background: `linear-gradient(135deg, ${product.accent}15 0%, ${product.accent}05 100%)`,
              borderColor: `${product.accent}40`,
            }}
          >
            <div className="text-xs tracking-widest uppercase mb-3" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#8B94A8" }}>
              Desde
            </div>
            <div
              className="text-4xl md:text-5xl font-black mb-3"
              style={{ fontFamily: "'Poppins', sans-serif", color: product.accent }}
            >
              {detail.priceFrom}
            </div>
            <div className="text-sm" style={{ color: "#B8C0D0" }}>
              {detail.priceNote}
            </div>
          </section>
        </div>

        {/* ══════════ FOOTER CON CTAs ══════════ */}
        <div
          className="px-6 md:px-10 py-5 flex flex-col sm:flex-row gap-3 flex-shrink-0 border-t"
          style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(0,0,0,0.3)" }}
        >
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-white text-sm transition-all duration-300 hover:-translate-y-0.5"
            style={{
              background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)",
              boxShadow: "0 12px 32px rgba(37,211,102,0.35)",
            }}
          >
            <FaWhatsapp size={18} />
            Hablar por WhatsApp
          </a>
          <button
            onClick={() => { onClose(); onOpenQuote(); }}
            className="neon-btn flex-1 inline-flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-white text-sm transition-all duration-300"
            style={{
              background: "linear-gradient(135deg, #0066FF 0%, #0052CC 100%)",
              border: "1px solid rgba(0,194,255,0.5)",
              cursor: "pointer",
            }}
          >
            <Sparkles size={16} className="relative z-10" />
            <span className="relative z-10">Cotizar este producto</span>
            <ArrowRight size={16} className="relative z-10" />
          </button>
        </div>
      </div>
    </div>
  );
}