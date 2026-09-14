import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Code2, Cpu, Cloud, Shield, Database, Wifi, Zap, Activity, X, MousePointerClick } from "lucide-react";
import { AboutModal } from "./AboutModal";

interface NodeInfo {
  id: string;
  icon: any;
  label: string;
  title: string;
  desc: string;
  color: string;
}

const nodeInfos: Record<string, NodeInfo> = {
  code:     { id: "code",     icon: Code2,    label: "Software",  title: "Desarrollo de Software",   desc: "Apps web, moviles y sistemas a la medida.", color: "#0066FF" },
  database: { id: "database", icon: Database, label: "Data",      title: "Base de Datos",            desc: "PostgreSQL, backups y alta disponibilidad.", color: "#00C2FF" },
  shield:   { id: "shield",   icon: Shield,   label: "Seguridad", title: "Ciberseguridad",           desc: "Proteccion, pentesting y monitoreo 24/7.",   color: "#7C3AED" },
  cpu:      { id: "cpu",      icon: Cpu,      label: "Hardware",  title: "Hardware",                 desc: "Reparacion, mantenimiento y upgrades.",      color: "#00C2FF" },
  cloud:    { id: "cloud",    icon: Cloud,    label: "Cloud",     title: "Cloud",                    desc: "AWS, GCP y Azure. Deploy y monitoreo.",      color: "#0066FF" },
  wifi:     { id: "wifi",     icon: Wifi,     label: "Redes",     title: "Redes",                    desc: "Instalacion, configuracion y soporte.",      color: "#22C55E" },
};

const outerOrbit = ["code", "database", "shield"];
const innerOrbit = ["cpu", "cloud", "wifi"];
const allIds = [...outerOrbit, ...innerOrbit];

export function DashboardMockup() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [autoIdx, setAutoIdx] = useState(0);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [time, setTime] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Parallax
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - (rect.left + rect.width / 2)) / rect.width;
      const y = (e.clientY - (rect.top + rect.height / 2)) / rect.height;
      setMouse({ x: Math.max(-0.5, Math.min(0.5, x)), y: Math.max(-0.5, Math.min(0.5, y)) });
    };
    const onLeave = () => setMouse({ x: 0, y: 0 });
    window.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  // Auto highlight
  useEffect(() => {
    if (hasInteracted) return;
    const interval = setInterval(() => {
      setAutoIdx((p) => (p + 1) % allIds.length);
    }, 1800);
    return () => clearInterval(interval);
  }, [hasInteracted]);

  // Reloj HUD
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setTime(
        `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`
      );
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCoreClick = () => {
    setHasInteracted(true);
    setAboutOpen(true);
  };

  const handleNodeClick = (id: string) => {
    setActiveId(activeId === id ? null : id);
    setHasInteracted(true);
  };

  const parallax = `perspective(1000px) rotateY(${mouse.x * 6}deg) rotateX(${-mouse.y * 6}deg)`;
  const activeNode = activeId ? nodeInfos[activeId] : null;
  const autoHighlightId = hasInteracted ? null : allIds[autoIdx];

  const renderOrbit = (ids: string[], radius: number, duration: number, reverse: boolean) => (
    <div
      className="absolute rounded-full"
      style={{
        width: radius * 2,
        height: radius * 2,
        top: "50%",
        left: "50%",
        marginTop: -radius,
        marginLeft: -radius,
        animation: `orbit-rotate ${duration}s linear infinite${reverse ? " reverse" : ""}`,
      }}
    >
      {ids.map((id, i) => {
        const info = nodeInfos[id];
        const Icon = info.icon;
        const angle = (360 / ids.length) * i;
        const rad = (angle * Math.PI) / 180;
        const x = radius + Math.cos(rad) * radius - 22;
        const y = radius + Math.sin(rad) * radius - 22;
        const active = activeId === id;
        const isAuto = autoHighlightId === id;

        return (
          <button
            key={id}
            onClick={() => handleNodeClick(id)}
            className="absolute w-11 h-11 rounded-xl flex items-center justify-center backdrop-blur-sm group cursor-pointer transition-transform duration-300 hover:scale-125"
            style={{
              left: x,
              top: y,
              background: active ? `${info.color}30` : isAuto ? `${info.color}28` : `${info.color}12`,
              border: `1px solid ${info.color}${active ? "AA" : isAuto ? "99" : "55"}`,
              boxShadow: active
                ? `0 0 30px ${info.color}, inset 0 0 15px ${info.color}40`
                : isAuto
                ? `0 0 35px ${info.color}, 0 0 15px ${info.color}80, inset 0 0 15px ${info.color}30`
                : `0 0 20px ${info.color}40, inset 0 0 12px ${info.color}15`,
              animation: `orbit-counter ${duration}s linear infinite${reverse ? " reverse" : ""}`,
              zIndex: 20,
            }}
            aria-label={info.label}
          >
            <Icon size={18} style={{ color: info.color }} />

            {isAuto && (
              <span className="absolute inset-0 rounded-xl animate-ping-slow pointer-events-none" style={{ border: `2px solid ${info.color}`, opacity: 0.6 }} />
            )}

            <span
              className={`absolute -bottom-7 left-1/2 -translate-x-1/2 px-2 py-1 rounded text-[9px] font-semibold tracking-widest uppercase whitespace-nowrap transition-opacity pointer-events-none ${
                isAuto || active ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              }`}
              style={{
                background: "rgba(10,26,47,0.95)",
                border: `1px solid ${info.color}40`,
                color: info.color,
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              {info.label}
            </span>
          </button>
        );
      })}
    </div>
  );

  return (
    <>
      <div
        ref={containerRef}
        className="relative w-full max-w-[520px] mx-auto aspect-square select-none"
        style={{ perspective: "1000px" }}
      >
        {/* HUD: Brackets esquinas exteriores */}
        <span className="absolute -top-2 -left-2 w-8 h-8 pointer-events-none z-10 animate-pulse" style={{ borderTop: "2px solid #00C2FF", borderLeft: "2px solid #00C2FF", opacity: 0.7 }} />
        <span className="absolute -top-2 -right-2 w-8 h-8 pointer-events-none z-10 animate-pulse" style={{ borderTop: "2px solid #00C2FF", borderRight: "2px solid #00C2FF", opacity: 0.7 }} />
        <span className="absolute -bottom-2 -left-2 w-8 h-8 pointer-events-none z-10 animate-pulse" style={{ borderBottom: "2px solid #00C2FF", borderLeft: "2px solid #00C2FF", opacity: 0.7 }} />
        <span className="absolute -bottom-2 -right-2 w-8 h-8 pointer-events-none z-10 animate-pulse" style={{ borderBottom: "2px solid #00C2FF", borderRight: "2px solid #00C2FF", opacity: 0.7 }} />

        {/* HUD: Readouts esquinas */}
        <div className="absolute top-2 left-2 z-20 pointer-events-none">
          <div className="text-[8px] tracking-widest" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#00C2FF" }}>
            ALZOVA.CORE
          </div>
          <div className="text-[8px]" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#8B94A8" }}>
            v2.4 // LIVE
          </div>
        </div>
        <div className="absolute top-2 right-2 z-20 pointer-events-none text-right">
          <div className="text-[8px] tracking-widest" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#00C2FF" }}>
            LAT 4.7110
          </div>
          <div className="text-[8px]" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#8B94A8" }}>
            LON -74.0721
          </div>
        </div>
        <div className="absolute bottom-8 left-2 z-20 pointer-events-none">
          <div className="text-[8px] tracking-widest" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#00C2FF" }}>
            SYNC
          </div>
          <div className="text-[8px]" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#8B94A8" }}>
            {time}
          </div>
        </div>
        <div className="absolute bottom-8 right-2 z-20 pointer-events-none text-right">
          <div className="text-[8px] tracking-widest" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#00C2FF" }}>
            SIG
          </div>
          <div className="text-[8px]" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#22C55E" }}>
            ● STRONG
          </div>
        </div>

        {/* Hint superior */}
        {!hasInteracted && (
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-30 animate-slide-in-right whitespace-nowrap">
            <div
              className="relative flex items-center gap-2.5 px-4 py-2.5 rounded-full border animate-glow-pulse"
              style={{
                background: "rgba(0,102,255,0.15)",
                borderColor: "rgba(0,194,255,0.6)",
                backdropFilter: "blur(10px)",
                boxShadow: "0 0 24px rgba(0,102,255,0.5)",
              }}
            >
              <MousePointerClick size={14} className="text-[#00C2FF]" />
              <span className="text-[11px] font-bold tracking-wider uppercase" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#FFFFFF" }}>
                Sistema interactivo
              </span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="animate-bounce" style={{ animationDuration: "1.5s" }}>
                <path d="M12 5v14m0 0l-6-6m6 6l6-6" stroke="#00C2FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        )}

        {/* Escena con parallax */}
        <div
          className="absolute inset-0"
          style={{ transform: parallax, transition: "transform 0.2s ease-out", transformStyle: "preserve-3d" }}
        >
          {/* Glow central */}
          <div className="absolute inset-0 rounded-full blur-3xl opacity-50 pointer-events-none" style={{ background: "radial-gradient(circle, #0066FF 0%, transparent 60%)" }} />

          {/* Grid circular */}
          <div
            className="absolute inset-0 rounded-full animate-spin-slow pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(circle, rgba(0,102,255,0.15) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
              maskImage: "radial-gradient(circle, black 40%, transparent 75%)",
              WebkitMaskImage: "radial-gradient(circle, black 40%, transparent 75%)",
            }}
          />

          {/* Hexágonos decorativos de fondo */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.08]" viewBox="0 0 520 520">
            {[0, 1, 2, 3, 4, 5].map((ring) => {
              const radius = 60 + ring * 30;
              const points = Array.from({ length: 6 }).map((_, i) => {
                const a = (i * 60 - 90) * (Math.PI / 180);
                return `${260 + Math.cos(a) * radius},${260 + Math.sin(a) * radius}`;
              }).join(" ");
              return <polygon key={ring} points={points} fill="none" stroke="#00C2FF" strokeWidth="0.5" />;
            })}
          </svg>

          {/* Anillos pulsantes */}
          {[130, 95, 65].map((r, i) => (
            <div
              key={r}
              className="absolute rounded-full border pointer-events-none animate-pulse-ring"
              style={{
                width: r * 2,
                height: r * 2,
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                borderColor: `rgba(0,102,255,${0.35 - i * 0.08})`,
                animationDelay: `${i * 0.5}s`,
              }}
            />
          ))}

          {renderOrbit(outerOrbit, 130, 20, false)}
          {renderOrbit(innerOrbit, 95, 14, true)}

          {/* Núcleo central — CLICKABLE */}
          <button
            onClick={handleCoreClick}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
            aria-label="Quienes somos"
          >
            {/* Halo exterior */}
            <div className="absolute -inset-8 rounded-full blur-2xl opacity-70 animate-pulse-slow" style={{ background: "radial-gradient(circle, #00C2FF 0%, #0066FF 50%, transparent 75%)" }} />

            {/* Aro giratorio */}
            <div
              className="absolute -inset-4 rounded-full animate-spin-slow"
              style={{
                background: "conic-gradient(from 0deg, transparent 0%, #00C2FF 25%, transparent 50%, #0066FF 75%, transparent 100%)",
                maskImage: "radial-gradient(circle, transparent 58%, black 60%, black 70%, transparent 72%)",
                WebkitMaskImage: "radial-gradient(circle, transparent 58%, black 60%, black 70%, transparent 72%)",
              }}
            />

            {/* Aro giratorio inverso */}
            <div
              className="absolute -inset-2 rounded-full animate-spin-reverse"
              style={{
                background: "conic-gradient(from 180deg, transparent 0%, #7C3AED 30%, transparent 60%)",
                maskImage: "radial-gradient(circle, transparent 60%, black 62%, black 66%, transparent 68%)",
                WebkitMaskImage: "radial-gradient(circle, transparent 60%, black 62%, black 66%, transparent 68%)",
              }}
            />

            {/* Core hexagonal */}
            <div
              className="relative w-28 h-28 flex items-center justify-center transition-transform duration-500 group-hover:scale-110"
              style={{
                background: "linear-gradient(135deg, #0066FF 0%, #00C2FF 100%)",
                boxShadow: "0 0 60px rgba(0,102,255,0.9), 0 0 120px rgba(0,102,255,0.4), inset 0 0 30px rgba(255,255,255,0.2)",
                clipPath: "polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)",
              }}
            >
              {/* Grid interno */}
              <div
                className="absolute inset-0 opacity-30 pointer-events-none"
                style={{
                  backgroundImage: "linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)",
                  backgroundSize: "12px 12px",
                  clipPath: "polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)",
                }}
              />

              {/* Letra A */}
              <span className="relative text-5xl font-black text-white" style={{ fontFamily: "'Poppins', sans-serif", textShadow: "0 0 20px rgba(255,255,255,0.8)" }}>
                A
              </span>

              {/* Texto "TOCA AQUÍ" */}
              {!hasInteracted && (
                <span
                  className="absolute -bottom-10 text-[9px] font-bold tracking-[0.25em] uppercase text-white/90 whitespace-nowrap animate-pulse"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  → TOCA AQUI ←
                </span>
              )}
            </div>

            {/* Chispas */}
            <span className="absolute -top-2 left-1/2 w-1.5 h-1.5 rounded-full bg-[#00C2FF] animate-ping-slow" style={{ boxShadow: "0 0 10px #00C2FF" }} />
            <span className="absolute -bottom-2 right-1/4 w-1 h-1 rounded-full bg-[#0066FF] animate-ping-slower" style={{ boxShadow: "0 0 8px #0066FF" }} />
          </button>

          {/* Líneas SVG */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 520 520">
            <defs>
              <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0066FF" stopOpacity="0" />
                <stop offset="50%" stopColor="#00C2FF" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#0066FF" stopOpacity="0" />
              </linearGradient>
            </defs>
            {[0, 60, 120, 180, 240, 300].map((angle) => {
              const rad = (angle * Math.PI) / 180;
              return (
                <line
                  key={angle}
                  x1={260 + Math.cos(rad) * 60}
                  y1={260 + Math.sin(rad) * 60}
                  x2={260 + Math.cos(rad) * 230}
                  y2={260 + Math.sin(rad) * 230}
                  stroke="url(#lineGrad)"
                  strokeWidth="1"
                />
              );
            })}
          </svg>

          {/* Stat chips */}
          <StatChip position={{ top: "8%", left: "2%" }}        icon={Activity} label="Uptime"    value="99.9%"  color="#22C55E" delay={0} />
          <StatChip position={{ top: "22%", right: "0%" }}      icon={Zap}      label="Latencia"  value="12ms"   color="#00C2FF" delay={400} />
          <StatChip position={{ bottom: "18%", left: "0%" }}    icon={Cpu}      label="Procesos"  value="248"    color="#0066FF" delay={800} />
          <StatChip position={{ bottom: "10%", right: "2%" }}   icon={Shield}   label="Seguridad" value="ON"     color="#7C3AED" delay={1200} />
        </div>

        {/* Panel info nodo activo */}
        {activeNode && (
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 p-4 z-40 animate-slide-up"
            style={{
              background: "rgba(10,26,47,0.98)",
              border: `1px solid ${activeNode.color}55`,
              boxShadow: `0 20px 60px ${activeNode.color}40`,
              backdropFilter: "blur(20px)",
              clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)",
            }}
          >
            <button
              onClick={() => setActiveId(null)}
              className="absolute top-2 right-2 w-6 h-6 rounded-md flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Cerrar"
            >
              <X size={12} />
            </button>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `${activeNode.color}20`, border: `1px solid ${activeNode.color}50` }}>
              {(() => { const Icon = activeNode.icon; return <Icon size={18} style={{ color: activeNode.color }} />; })()}
            </div>
            <h4 className="text-sm font-bold mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>{activeNode.title}</h4>
            <p className="text-xs leading-relaxed" style={{ color: "#8B94A8" }}>{activeNode.desc}</p>
          </div>
        )}

        {/* Barra inferior */}
        <div
          className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 border backdrop-blur-md whitespace-nowrap z-30"
          style={{
            background: "rgba(10,26,47,0.9)",
            borderColor: "rgba(0,102,255,0.4)",
            boxShadow: "0 8px 24px rgba(0,102,255,0.3)",
            clipPath: "polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)",
          }}
        >
          <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" style={{ boxShadow: "0 0 8px #22C55E" }} />
          <span className="text-[10px] tracking-widest uppercase" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#E5E7EB" }}>
            {hasInteracted ? "Sistema activo · SW + HW" : "Modo interactivo"}
          </span>
        </div>
      </div>

      {/* Modal Quiénes Somos — vía Portal */}
      {aboutOpen && createPortal(
        <AboutModal open={aboutOpen} onClose={() => setAboutOpen(false)} />,
        document.body
      )}
    </>
  );
}

function StatChip({
  position, icon: Icon, label, value, color, delay,
}: {
  position: React.CSSProperties;
  icon: any;
  label: string;
  value: string;
  color: string;
  delay: number;
}) {
  return (
    <div
      className="absolute flex items-center gap-2.5 px-3 py-2 border backdrop-blur-md animate-float-slow transition-transform duration-300 hover:scale-110 cursor-default"
      style={{
        ...position,
        background: "rgba(10,26,47,0.85)",
        borderColor: `${color}40`,
        boxShadow: `0 8px 24px ${color}25`,
        animationDelay: `${delay}ms`,
        clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)",
      }}
    >
      <div className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: `${color}20`, border: `1px solid ${color}40` }}>
        <Icon size={12} style={{ color }} />
      </div>
      <div className="flex flex-col leading-tight">
        <span className="text-[8px] tracking-widest uppercase" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#8B94A8" }}>
          {label}
        </span>
        <span className="text-xs font-bold" style={{ color: "#FFFFFF", fontFamily: "'Poppins', sans-serif" }}>
          {value}
        </span>
      </div>
    </div>
  );
}