import { useState, useEffect, useRef } from "react";
import { ArrowRight, Sparkles, Zap, Activity } from "lucide-react";
import { Reveal } from "../ui/Reveal";
import { Badge } from "../ui/Badge";
import { servicePillars } from "../../data/services";

interface Props {
  onOpenQuote: () => void;
}

export function Services({ onOpenQuote }: Props) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [clock, setClock] = useState("");
  const activePillar = servicePillars[activeIdx];

  // Auto-rotate hasta que el usuario haga click
  useEffect(() => {
    if (hasInteracted) return;
    const interval = setInterval(() => {
      setActiveIdx((p) => (p + 1) % servicePillars.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [hasInteracted]);

  // Reloj HUD
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setClock(
        `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`
      );
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  const handlePillarClick = (i: number) => {
    setActiveIdx(i);
    setHasInteracted(true);
  };

  return (
    <section id="servicios" className="py-28 md:py-36 relative overflow-hidden">
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

      {/* Glow ambiental que cambia de color según pilar activo */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full blur-3xl opacity-20 pointer-events-none transition-all duration-1000"
        style={{ background: activePillar.accent }}
      />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* HUD superior */}
        <Reveal>
          <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
            <Badge>Servicios</Badge>
            <div
              className="flex items-center gap-4 text-[10px] tracking-widest"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              <span className="flex items-center gap-1.5" style={{ color: "#22C55E" }}>
                <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" style={{ boxShadow: "0 0 6px #22C55E" }} />
                SYSTEM ONLINE
              </span>
              <span style={{ color: "#00C2FF" }}>SYNC {clock}</span>
            </div>
          </div>
        </Reveal>

        {/* Encabezado */}
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <h2
              className="text-4xl md:text-5xl font-extrabold tracking-tight max-w-2xl"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Todo lo que necesitas para{" "}
              <span className="gradient-text">digitalizar</span> tu empresa
            </h2>
            <a
              href="#contacto"
              className="inline-flex items-center gap-2 text-sm font-semibold self-start md:self-end pb-1 border-b transition-all hover:gap-3"
              style={{ color: "#0066FF", borderColor: "#0066FF" }}
            >
              Hablemos de tu proyecto <ArrowRight size={14} />
            </a>
          </div>
        </Reveal>

        {/* ══════════ TABS DE PILARES ══════════ */}
        <Reveal delay={100}>
          <div className="mt-12 grid grid-cols-3 gap-2 md:gap-3 max-w-3xl">
            {servicePillars.map((p, i) => {
              const isActive = i === activeIdx;
              return (
                <button
                  key={p.id}
                  onClick={() => handlePillarClick(i)}
                  className="group relative p-3 md:p-4 rounded-xl border transition-all duration-500 overflow-hidden"
                  style={{
                    background: isActive
                      ? `linear-gradient(135deg, rgba(${p.accentRgb},0.18), rgba(${p.accentRgb},0.05))`
                      : "rgba(255,255,255,0.02)",
                    borderColor: isActive ? `${p.accent}80` : "rgba(255,255,255,0.06)",
                    boxShadow: isActive
                      ? `0 0 24px ${p.accent}40, inset 0 0 20px ${p.accent}15`
                      : "none",
                  }}
                >
                  {/* Scan line animada cuando activo */}
                  {isActive && (
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: `linear-gradient(90deg, transparent, ${p.accent}30, transparent)`,
                        animation: "scan-sweep 2.4s ease-in-out infinite",
                      }}
                    />
                  )}

                  <div className="relative flex items-center gap-3">
                    <span
                      className="text-lg md:text-2xl font-black flex-shrink-0 transition-all duration-500"
                      style={{
                        fontFamily: "'Poppins', sans-serif",
                        color: "transparent",
                        WebkitTextStroke: isActive ? `1.5px ${p.accent}` : "1px rgba(255,255,255,0.3)",
                        textShadow: isActive ? `0 0 20px ${p.accent}` : "none",
                      }}
                    >
                      {p.number}
                    </span>
                    <div className="hidden md:block text-left min-w-0">
                      <div
                        className="text-xs md:text-sm font-bold truncate transition-colors duration-300"
                        style={{ fontFamily: "'Poppins', sans-serif", color: isActive ? "#FFFFFF" : "#8B94A8" }}
                      >
                        {p.title}
                      </div>
                      <div
                        className="text-[9px] tracking-widest uppercase truncate"
                        style={{ fontFamily: "'JetBrains Mono', monospace", color: isActive ? p.accent : "#4A5568" }}
                      >
                        {isActive ? "● ACTIVE" : p.status}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* ══════════ PANEL DEL PILAR ACTIVO ══════════ */}
        <div className="mt-10 md:mt-14">
          <PillarPanel
            key={activePillar.id}
            pillar={activePillar}
            onOpenQuote={onOpenQuote}
          />
        </div>

        {/* CTA final */}
        <Reveal delay={400}>
          <div
            className="mt-20 rounded-3xl border p-8 md:p-12 relative overflow-hidden text-center"
            style={{
              background: "linear-gradient(135deg, rgba(0,102,255,0.12) 0%, rgba(0,194,255,0.06) 100%)",
              borderColor: "rgba(0,102,255,0.35)",
              boxShadow: "0 20px 60px -20px rgba(0,102,255,0.4)",
            }}
          >
            <div
              className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-30 blur-3xl pointer-events-none animate-pulse-slow"
              style={{ background: "#0066FF" }}
            />
            <div
              className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none animate-pulse-slow"
              style={{ background: "#00C2FF", animationDelay: "1s" }}
            />

            <div className="relative">
              <h3
                className="text-2xl md:text-4xl font-extrabold mb-4 leading-tight"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                ¿No sabes cuál servicio necesitas?
              </h3>
              <p className="text-base md:text-lg max-w-xl mx-auto mb-8" style={{ color: "#B8C0D0" }}>
                Cuéntanos qué quieres lograr y armamos un plan a la medida. Sin compromiso, en menos de 24 horas.
              </p>

              <button
                onClick={onOpenQuote}
                className="neon-btn group inline-flex items-center gap-2 px-7 py-4 rounded-xl font-bold text-white transition-all duration-300"
                style={{
                  background: "linear-gradient(135deg, #0066FF 0%, #0052CC 100%)",
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "15px",
                  border: "1px solid rgba(0,194,255,0.5)",
                  cursor: "pointer",
                }}
              >
                <Sparkles size={16} className="relative z-10" />
                <span className="relative z-10">Escribenos tu idea!</span>
                <ArrowRight size={16} className="relative z-10 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   Panel del pilar activo con cards interactivas
   ══════════════════════════════════════════════════════════ */
function PillarPanel({
  pillar,
  onOpenQuote,
}: {
  pillar: (typeof servicePillars)[number];
  onOpenQuote: () => void;
}) {
  return (
    <div className="animate-fade-slide-in">
      {/* Header del pilar */}
      <div className="relative flex items-end gap-5 mb-8">
        <div
          className="flex-shrink-0 font-black leading-none select-none animate-glitch-in"
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: "clamp(3rem, 8vw, 5.5rem)",
            color: "transparent",
            WebkitTextStroke: `1.5px ${pillar.accent}80`,
            textShadow: `0 0 40px ${pillar.accent}60, 0 0 80px ${pillar.accent}30`,
          }}
        >
          {pillar.number}
        </div>

        <div className="pb-2 md:pb-3">
          <div
            className="text-[10px] tracking-[0.3em] uppercase mb-2 flex items-center gap-2"
            style={{ fontFamily: "'JetBrains Mono', monospace", color: pillar.accent }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: pillar.accent, boxShadow: `0 0 8px ${pillar.accent}` }} />
            {pillar.subtitle}
          </div>
          <h3 className="text-2xl md:text-3xl font-extrabold" style={{ fontFamily: "'Poppins', sans-serif" }}>
            {pillar.title}
          </h3>
        </div>

        <div
          className="hidden md:block flex-1 h-px mb-4"
          style={{ background: `linear-gradient(90deg, ${pillar.accent}80, transparent)` }}
        />

        <div
          className="hidden md:flex items-center gap-2 pb-4 text-[10px] tracking-widest"
          style={{ fontFamily: "'JetBrains Mono', monospace", color: pillar.accent }}
        >
          <Activity size={12} />
          {pillar.status}
        </div>
      </div>

      {/* Cards del pilar */}
      <div className="grid gap-5 md:grid-cols-3">
        {pillar.services.map((service, i) => (
          <ServiceCard
            key={service.title}
            service={service}
            accent={pillar.accent}
            accentRgb={pillar.accentRgb}
            index={i}
          />
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   Card interactiva con mouse tracking + tilt 3D + neon
   ══════════════════════════════════════════════════════════ */
function ServiceCard({
  service,
  accent,
  accentRgb,
  index,
}: {
  service: (typeof servicePillars)[number]["services"][number];
  accent: string;
  accentRgb: string;
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 50, y: 50 });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);

  // IntersectionObserver para animación de entrada
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), index * 100);
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

    // Tilt 3D: -6° a 6°
    const tiltX = ((y - 50) / 50) * -6;
    const tiltY = ((x - 50) / 50) * 6;
    setTilt({ x: tiltX, y: tiltY });
  };

  const handleMouseLeave = () => {
    setHovered(false);
    setMouse({ x: 50, y: 50 });
    setTilt({ x: 0, y: 0 });
  };

  const Icon = service.icon;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="group relative h-full transition-all duration-700"
      style={{
        opacity: visible ? 1 : 0,
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(${visible ? 0 : 30}px)`,
        transformStyle: "preserve-3d",
      }}
    >
      <div
        className="relative h-full p-6 md:p-7 rounded-2xl border overflow-hidden transition-shadow duration-500"
        style={{
          background: "linear-gradient(145deg, rgba(10,26,47,0.7), rgba(11,11,11,0.7))",
          borderColor: hovered ? `${accent}80` : "rgba(255,255,255,0.07)",
          boxShadow: hovered
            ? `0 20px 60px ${accent}30, 0 0 40px ${accent}20, inset 0 0 30px ${accent}08`
            : "0 8px 24px rgba(0,0,0,0.3)",
        }}
      >
        {/* Mouse-tracking radial glow */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-500"
          style={{
            opacity: hovered ? 1 : 0,
            background: `radial-gradient(400px circle at ${mouse.x}% ${mouse.y}%, rgba(${accentRgb},0.18), transparent 50%)`,
          }}
        />

        {/* Neon border pulse continuo */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none animate-neon-border"
          style={{
            boxShadow: `inset 0 0 20px rgba(${accentRgb},0.15)`,
          }}
        />

        {/* Scan line horizontal */}
        {hovered && (
          <div
            className="absolute left-0 right-0 h-px pointer-events-none"
            style={{
              background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
              animation: "scan-vertical 2s ease-in-out infinite",
              boxShadow: `0 0 12px ${accent}`,
            }}
          />
        )}

        {/* Corner brackets (4 esquinas) */}
        <span
          className="absolute top-2.5 left-2.5 w-3 h-3 pointer-events-none transition-opacity duration-500"
          style={{
            borderTop: `1.5px solid ${accent}`,
            borderLeft: `1.5px solid ${accent}`,
            opacity: hovered ? 1 : 0.3,
          }}
        />
        <span
          className="absolute top-2.5 right-2.5 w-3 h-3 pointer-events-none transition-opacity duration-500"
          style={{
            borderTop: `1.5px solid ${accent}`,
            borderRight: `1.5px solid ${accent}`,
            opacity: hovered ? 1 : 0.3,
          }}
        />
        <span
          className="absolute bottom-2.5 left-2.5 w-3 h-3 pointer-events-none transition-opacity duration-500"
          style={{
            borderBottom: `1.5px solid ${accent}`,
            borderLeft: `1.5px solid ${accent}`,
            opacity: hovered ? 1 : 0.3,
          }}
        />
        <span
          className="absolute bottom-2.5 right-2.5 w-3 h-3 pointer-events-none transition-opacity duration-500"
          style={{
            borderBottom: `1.5px solid ${accent}`,
            borderRight: `1.5px solid ${accent}`,
            opacity: hovered ? 1 : 0.3,
          }}
        />

        {/* Readout HUD superior derecho */}
        <div
          className="absolute top-3 right-3 text-[8px] tracking-widest pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ fontFamily: "'JetBrains Mono', monospace", color: accent }}
        >
          {service.metric}
        </div>

        <div className="relative" style={{ transform: "translateZ(30px)" }}>
          {/* Icono + tag */}
          <div className="flex items-start justify-between mb-6">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500"
              style={{
                background: `linear-gradient(135deg, ${accent}25 0%, ${accent}10 100%)`,
                border: `1px solid ${accent}60`,
                boxShadow: hovered
                  ? `0 0 30px ${accent}70, inset 0 0 20px ${accent}30`
                  : `0 0 20px ${accent}30, inset 0 0 12px ${accent}15`,
                transform: hovered ? "scale(1.1) rotate(-6deg)" : "scale(1) rotate(0deg)",
              }}
            >
              <Icon size={22} style={{ color: accent }} />
            </div>

            <span
              className="text-[9px] tracking-widest uppercase px-2.5 py-1 rounded-full whitespace-nowrap transition-all duration-300"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                color: accent,
                background: `${accent}15`,
                border: `1px solid ${accent}30`,
                boxShadow: hovered ? `0 0 12px ${accent}40` : "none",
              }}
            >
              {service.tag}
            </span>
          </div>

          {/* Título */}
          <h4 className="text-base md:text-lg font-bold mb-2.5 leading-tight" style={{ fontFamily: "'Poppins', sans-serif" }}>
            {service.title}
          </h4>

          {/* Descripción */}
          <p className="text-sm leading-relaxed" style={{ color: "#8B94A8" }}>
            {service.desc}
          </p>

          {/* Barra de progreso neón inferior */}
          <div className="mt-6 relative h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.04)" }}>
            <div
              className="absolute top-0 left-0 h-full rounded-full transition-all duration-700"
              style={{
                width: hovered ? "100%" : "20%",
                background: `linear-gradient(90deg, ${accent}, ${accent}80)`,
                boxShadow: `0 0 12px ${accent}`,
              }}
            />
          </div>

          {/* Flecha que aparece al hover */}
          <div
            className="mt-4 flex items-center gap-1.5 text-[11px] font-semibold transition-all duration-500"
            style={{
              color: accent,
              opacity: hovered ? 1 : 0,
              transform: hovered ? "translateX(0)" : "translateX(-8px)",
            }}
          >
            <Zap size={12} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.15em" }}>
              READY
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}