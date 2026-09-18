import { useState, useEffect, useRef } from "react";
import { ArrowRight, TrendingUp, Users, Activity } from "lucide-react";
import { Reveal } from "../ui/Reveal";
import { Badge } from "../ui/Badge";
import { products, productsStats, type Product } from "../../data/products";
import { WHATSAPP_PHONE } from "../../data/social";
import { ProductDetailModal } from "../ProductDetailModal";
import { getProductDetail, type ProductDetail } from "../../data/productDetails";

interface Props {
  onOpenQuote: () => void;
}

export function Products({ onOpenQuote }: Props) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [detail, setDetail] = useState<ProductDetail | null>(null);

  return (
    <section
      id="productos"
      className="py-20 md:py-24 relative overflow-hidden"
      style={{ background: "linear-gradient(180deg, transparent 0%, rgba(10,26,47,0.4) 50%, transparent 100%)" }}
    >
      {/* Grid decorativa de fondo */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,102,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(0,102,255,0.4) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse at 50% 40%, black 30%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse at 50% 40%, black 30%, transparent 75%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Encabezado */}
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <Badge>Nuestros productos</Badge>
              <h2 className="mt-6 text-4xl md:text-5xl font-extrabold tracking-tight max-w-2xl" style={{ fontFamily: "'Poppins', sans-serif" }}>
                La familia <span className="gradient-text">ALZOVA</span>
              </h2>
              <p className="mt-4 text-lg max-w-2xl" style={{ color: "#8B94A8" }}>
                {productsStats.count} productos modulares que se adaptan a tu operación y crecen contigo.
              </p>
            </div>

            {/* Mini stats */}
            <div className="flex gap-3 self-start md:self-end flex-wrap">
              <MiniStat icon={Users} label="Clientes" value={productsStats.clients} color="#22C55E" />
              <MiniStat icon={Activity} label="Uptime" value={productsStats.uptime} color="#00C2FF" />
              <MiniStat icon={TrendingUp} label="Activos" value={`${productsStats.count}`} color="#0066FF" />
            </div>
          </div>
        </Reveal>

        {/* Grid de productos */}
        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((product, i) => (
            <ProductCard
              key={product.name}
              product={product}
              index={i}
              onOpenDetail={() => {
                const d = getProductDetail(product.name);
                if (d) {
                  setSelectedProduct(product);
                  setDetail(d);
                }
              }}
            />
          ))}
        </div>

        {/* CTA final */}
        <Reveal delay={400}>
          <div className="mt-10 text-center">
            <a
              href={`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent("Hola ALZOVA! Quiero una demo de sus productos.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold border transition-all duration-300 hover:-translate-y-0.5"
              style={{ borderColor: "rgba(255,255,255,0.12)", color: "#FFFFFF" }}
            >
              Agenda una demo con un asesor
              <ArrowRight size={16} />
            </a>
          </div>
        </Reveal>
      </div>

      {/* Modal de detalle de producto */}
      {selectedProduct && detail && (
        <ProductDetailModal
          product={selectedProduct}
          detail={detail}
          onClose={() => {
            setSelectedProduct(null);
            setDetail(null);
          }}
          onOpenQuote={onOpenQuote}
        />
      )}
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   Mini stat del header
   ══════════════════════════════════════════════════════════ */
function MiniStat({ icon: Icon, label, value, color }: { icon: any; label: string; value: string; color: string }) {
  return (
    <div
      className="flex items-center gap-2 px-3 py-2 rounded-xl border"
      style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.06)" }}
    >
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center"
        style={{ background: `${color}15`, border: `1px solid ${color}40` }}
      >
        <Icon size={12} style={{ color }} />
      </div>
      <div className="flex flex-col leading-tight">
        <span className="text-[9px] tracking-widest uppercase" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#8B94A8" }}>
          {label}
        </span>
        <span className="text-xs font-bold" style={{ color: "#FFFFFF", fontFamily: "'Poppins', sans-serif" }}>
          {value}
        </span>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   Card interactiva de producto
   ══════════════════════════════════════════════════════════ */
function ProductCard({
  product,
  index,
  onOpenDetail,
}: {
  product: Product;
  index: number;
  onOpenDetail: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 50, y: 50 });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);
  const Icon = product.icon;

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), index * 80);
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [index]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMouse({ x, y });
    setTilt({
      x: ((y - 50) / 50) * -5,
      y: ((x - 50) / 50) * 5,
    });
  };

  const handleMouseLeave = () => {
    setHovered(false);
    setMouse({ x: 50, y: 50 });
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="group h-full transition-all duration-700"
      style={{
        opacity: visible ? 1 : 0,
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(${visible ? 0 : 30}px)`,
        transformStyle: "preserve-3d",
      }}
    >
      <div
        className="relative h-full p-7 rounded-2xl border overflow-hidden transition-all duration-500 flex flex-col"
        style={{
          background: "linear-gradient(145deg, rgba(10,26,47,0.7), rgba(11,11,11,0.7))",
          borderColor: hovered ? `${product.accent}80` : "rgba(255,255,255,0.07)",
          boxShadow: hovered
            ? `0 20px 60px ${product.accent}30, 0 0 40px ${product.accent}20, inset 0 0 30px ${product.accent}08`
            : "0 8px 24px rgba(0,0,0,0.3)",
        }}
      >
        {/* Mouse-tracking radial glow */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-500"
          style={{
            opacity: hovered ? 1 : 0,
            background: `radial-gradient(400px circle at ${mouse.x}% ${mouse.y}%, rgba(${product.accentRgb},0.18), transparent 50%)`,
          }}
        />

        {/* Corner brackets (4 esquinas) */}
        <span
          className="absolute top-2.5 left-2.5 w-3 h-3 pointer-events-none transition-opacity duration-500"
          style={{ borderTop: `1.5px solid ${product.accent}`, borderLeft: `1.5px solid ${product.accent}`, opacity: hovered ? 1 : 0.3 }}
        />
        <span
          className="absolute top-2.5 right-2.5 w-3 h-3 pointer-events-none transition-opacity duration-500"
          style={{ borderTop: `1.5px solid ${product.accent}`, borderRight: `1.5px solid ${product.accent}`, opacity: hovered ? 1 : 0.3 }}
        />
        <span
          className="absolute bottom-2.5 left-2.5 w-3 h-3 pointer-events-none transition-opacity duration-500"
          style={{ borderBottom: `1.5px solid ${product.accent}`, borderLeft: `1.5px solid ${product.accent}`, opacity: hovered ? 1 : 0.3 }}
        />
        <span
          className="absolute bottom-2.5 right-2.5 w-3 h-3 pointer-events-none transition-opacity duration-500"
          style={{ borderBottom: `1.5px solid ${product.accent}`, borderRight: `1.5px solid ${product.accent}`, opacity: hovered ? 1 : 0.3 }}
        />

        {/* Scan line horizontal al hover */}
        {hovered && (
          <div
            className="absolute left-0 right-0 h-px pointer-events-none"
            style={{
              background: `linear-gradient(90deg, transparent, ${product.accent}, transparent)`,
              animation: "scan-vertical 2s ease-in-out infinite",
              boxShadow: `0 0 12px ${product.accent}`,
            }}
          />
        )}

        <div className="relative flex flex-col h-full" style={{ transform: "translateZ(30px)" }}>
          {/* Header: icono + badge */}
          <div className="flex items-start justify-between mb-6">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500"
              style={{
                background: `linear-gradient(135deg, ${product.accent}25 0%, ${product.accent}10 100%)`,
                border: `1px solid ${product.accent}60`,
                boxShadow: hovered
                  ? `0 0 30px ${product.accent}70, inset 0 0 20px ${product.accent}30`
                  : `0 0 20px ${product.accent}30, inset 0 0 12px ${product.accent}15`,
                transform: hovered ? "scale(1.1) rotate(-6deg)" : "scale(1) rotate(0deg)",
              }}
            >
              <Icon size={22} style={{ color: product.accent }} />
            </div>

            {product.badge && product.badgeColor && (
              <span
                className="text-[9px] tracking-widest uppercase px-2.5 py-1 rounded-full whitespace-nowrap font-bold"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  color: product.badgeColor,
                  background: `${product.badgeColor}15`,
                  border: `1px solid ${product.badgeColor}40`,
                  boxShadow: hovered ? `0 0 12px ${product.badgeColor}40` : "none",
                }}
              >
                {product.badge}
              </span>
            )}
          </div>

          {/* Nombre */}
          <h3 className="text-lg font-bold mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
            {product.name}
          </h3>

          {/* Descripción */}
          <p className="text-sm leading-relaxed mb-5" style={{ color: "#8B94A8" }}>
            {product.desc}
          </p>

          {/* Features */}
          <ul className="space-y-2 mb-6">
            {product.features.map((feature) => (
              <li key={feature} className="flex items-center gap-2 text-xs" style={{ color: "#C4CCDB" }}>
                <span
                  className="w-1 h-1 rounded-full flex-shrink-0"
                  style={{ background: product.accent, boxShadow: `0 0 6px ${product.accent}` }}
                />
                {feature}
              </li>
            ))}
          </ul>

          {/* Barra inferior neón */}
          <div className="mt-auto">
            <div className="relative h-1 rounded-full overflow-hidden mb-5" style={{ background: "rgba(255,255,255,0.04)" }}>
              <div
                className="absolute top-0 left-0 h-full rounded-full transition-all duration-700"
                style={{
                  width: hovered ? "100%" : "25%",
                  background: `linear-gradient(90deg, ${product.accent}, ${product.accent}80)`,
                  boxShadow: `0 0 12px ${product.accent}`,
                }}
              />
            </div>

            {/* CTA — ahora es un botón que abre el modal */}
            <button
              onClick={onOpenDetail}
              className="group/cta inline-flex items-center gap-2 text-sm font-semibold transition-all duration-300"
              style={{
                color: product.accent,
                background: "transparent",
                border: "none",
                padding: 0,
                cursor: "pointer",
              }}
            >
              Ver detalles
              <ArrowRight size={14} className="transition-transform group-hover/cta:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}