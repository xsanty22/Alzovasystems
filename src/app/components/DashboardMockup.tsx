import { useState, useEffect, useRef } from "react";
import {
  Code2, Activity, TrendingUp, Users, DollarSign, Package,
  Server, Lock, BarChart3, Cpu, Database, Wifi, Shield,
  Zap, Terminal as TerminalIcon, Circle, Radio,
} from "lucide-react";

/* ══════════════════════════════════════════════════════════
   DATOS
   ══════════════════════════════════════════════════════════ */
const terminalLines = [
  { prompt: "$", text: "alzova --deploy production", color: "#4A5568" },
  { prompt: ">", text: "Compilando bundle...", color: "#8B94A8" },
  { prompt: "✓", text: "Build optimizado (2.1s)", color: "#22C55E" },
  { prompt: "✓", text: "Tests pasados: 248/248", color: "#22C55E" },
  { prompt: "✓", text: "Deploy exitoso", color: "#00C2FF" },
];

const metrics = [
  { icon: TrendingUp, label: "MRR", value: "$4.2K", change: "+18%", color: "#22C55E" },
  { icon: Users,      label: "Users", value: "1,284", change: "+12%", color: "#00C2FF" },
  { icon: Zap,        label: "Latency", value: "12ms", change: "-8%", color: "#7C3AED" },
];

const systemStats = [
  { icon: Server,    label: "CPU",     value: 42, color: "#0066FF" },
  { icon: Database,  label: "RAM",     value: 68, color: "#00C2FF" },
  { icon: Activity,  label: "Network", value: 34, color: "#22C55E" },
];

const logStream = [
  { time: "15:42:11", text: "GET /api/products", status: 200, color: "#22C55E" },
  { time: "15:42:12", text: "POST /api/orders",  status: 201, color: "#22C55E" },
  { time: "15:42:13", text: "GET /api/users/me", status: 200, color: "#22C55E" },
  { time: "15:42:14", text: "PUT /api/cart",     status: 200, color: "#22C55E" },
  { time: "15:42:15", text: "GET /api/metrics",  status: 200, color: "#22C55E" },
  { time: "15:42:16", text: "POST /api/login",   status: 401, color: "#EF4444" },
  { time: "15:42:17", text: "POST /api/login",   status: 200, color: "#22C55E" },
];

const barChartData = [45, 62, 38, 78, 55, 92, 71, 88, 66, 95, 82, 74];

/* ══════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
   ══════════════════════════════════════════════════════════ */
export function DashboardMockup() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [terminalIdx, setTerminalIdx] = useState(0);
  const [logIdx, setLogIdx] = useState(0);
  const [time, setTime] = useState("");
  const [barHeights, setBarHeights] = useState(barChartData);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parallax
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - (rect.left + rect.width / 2)) / rect.width;
      const y = (e.clientY - (rect.top + rect.height / 2)) / rect.height;
      setMouse({
        x: Math.max(-0.5, Math.min(0.5, x)),
        y: Math.max(-0.5, Math.min(0.5, y)),
      });
    };
    const onLeave = () => setMouse({ x: 0, y: 0 });
    window.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  // Reloj
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setTime(`${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`);
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  // Terminal
  useEffect(() => {
    const interval = setInterval(() => {
      setTerminalIdx((prev) => (prev >= terminalLines.length ? 0 : prev + 1));
    }, 900);
    return () => clearInterval(interval);
  }, []);

  // Log stream
  useEffect(() => {
    const interval = setInterval(() => {
      setLogIdx((prev) => (prev + 1) % (logStream.length + 3));
    }, 1400);
    return () => clearInterval(interval);
  }, []);

  // Barras que respiran
  useEffect(() => {
    const interval = setInterval(() => {
      setBarHeights((prev) => prev.map(() => 30 + Math.random() * 65));
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  const parallax = `perspective(1400px) rotateY(${mouse.x * 8}deg) rotateX(${-mouse.y * 8}deg)`;

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[640px] mx-auto select-none"
      style={{ perspective: "1400px", minHeight: 520 }}
    >
      {/* ══════════ HUD EXTERNO ══════════ */}
      <span className="absolute top-0 left-0 w-6 h-6 pointer-events-none z-30" style={{ borderTop: "2px solid #00C2FF", borderLeft: "2px solid #00C2FF" }} />
      <span className="absolute top-0 right-0 w-6 h-6 pointer-events-none z-30" style={{ borderTop: "2px solid #00C2FF", borderRight: "2px solid #00C2FF" }} />
      <span className="absolute bottom-0 left-0 w-6 h-6 pointer-events-none z-30" style={{ borderBottom: "2px solid #00C2FF", borderLeft: "2px solid #00C2FF" }} />
      <span className="absolute bottom-0 right-0 w-6 h-6 pointer-events-none z-30" style={{ borderBottom: "2px solid #00C2FF", borderRight: "2px solid #00C2FF" }} />

      {/* Header HUD */}
      <div className="absolute top-2 left-2 z-30 pointer-events-none">
        <div className="flex items-center gap-1.5 text-[9px] tracking-widest" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#00C2FF" }}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" style={{ boxShadow: "0 0 6px #22C55E" }} />
          ALZOVA.CONTROL
        </div>
        <div className="text-[8px] mt-0.5" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#4A5568" }}>
          v3.0 · UPTIME 99.9%
        </div>
      </div>

      <div className="absolute top-2 right-2 z-30 pointer-events-none text-right">
        <div className="flex items-center justify-end gap-1.5 text-[9px] tracking-widest" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#00C2FF" }}>
          <Radio size={9} />
          LIVE
        </div>
        <div className="text-[8px] mt-0.5" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#4A5568" }}>
          {time}
        </div>
      </div>

      {/* ══════════ ESCENA 3D ISOMÉTRICA ══════════ */}
      <div
        className="absolute inset-0"
        style={{ transform: parallax, transition: "transform 0.3s ease-out", transformStyle: "preserve-3d" }}
      >
        {/* Glow ambiental */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(circle at 50% 50%, rgba(0,102,255,0.15) 0%, transparent 60%)" }}
        />

        {/* Grid isométrico de fondo */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.08]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,194,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,194,255,0.5) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
            transform: "perspective(600px) rotateX(55deg) translateY(20px)",
            transformOrigin: "center bottom",
            maskImage: "radial-gradient(ellipse at 50% 100%, black 30%, transparent 70%)",
            WebkitMaskImage: "radial-gradient(ellipse at 50% 100%, black 30%, transparent 70%)",
          }}
        />

        {/* ═══════════════════════════════════════════════════
           PANEL 1 — TERMINAL (arriba izquierda)
           ═══════════════════════════════════════════════════ */}
        <div
          className="absolute w-[260px] animate-float-isometric"
          style={{ top: "8%", left: "4%", transform: "translateZ(60px)" }}
        >
          <HackerPanel title="deploy@alzova" status="success">
            <div className="p-3 h-[110px] overflow-hidden">
              {terminalLines.slice(0, terminalIdx + 1).map((line, i) => (
                <div
                  key={i}
                  className="text-[9px] leading-[1.6] flex items-start gap-1.5 animate-slide-in-right"
                  style={{ fontFamily: "'JetBrains Mono', monospace", animationDelay: `${i * 30}ms` }}
                >
                  <span style={{ color: line.prompt === "✓" ? "#22C55E" : line.prompt === ">" ? "#00C2FF" : "#4A5568", flexShrink: 0 }}>
                    {line.prompt}
                  </span>
                  <span style={{ color: line.color }}>{line.text}</span>
                </div>
              ))}
              <span
                className="inline-block w-1.5 h-3 align-middle animate-pulse"
                style={{ background: "#00C2FF", boxShadow: "0 0 8px #00C2FF" }}
              />
            </div>
          </HackerPanel>
        </div>

        {/* ═══════════════════════════════════════════════════
           PANEL 2 — LOG STREAM (arriba derecha)
           ═══════════════════════════════════════════════════ */}
        <div
          className="absolute w-[280px] animate-float-isometric-slow"
          style={{ top: "4%", right: "2%", transform: "translateZ(80px)" }}
        >
          <HackerPanel title="api.logs" status="live">
            <div className="p-2.5 h-[130px] overflow-hidden">
              {logStream.slice(0, Math.min(logIdx + 1, logStream.length)).map((log, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-[9px] leading-[1.7] animate-slide-in-right"
                  style={{ fontFamily: "'JetBrains Mono', monospace", animationDelay: `${i * 30}ms` }}
                >
                  <span style={{ color: "#4A5568" }}>{log.time}</span>
                  <span className="flex-1 truncate" style={{ color: "#C4CCDB" }}>{log.text}</span>
                  <span style={{ color: log.color }}>{log.status}</span>
                </div>
              ))}
              {logIdx < logStream.length && (
                <span
                  className="inline-block w-1.5 h-3 align-middle animate-pulse"
                  style={{ background: "#22C55E", boxShadow: "0 0 8px #22C55E" }}
                />
              )}
            </div>
          </HackerPanel>
        </div>

        {/* ═══════════════════════════════════════════════════
           PANEL 3 — MÉTRICAS (centro)
           ═══════════════════════════════════════════════════ */}
        <div
          className="absolute w-[360px] animate-float-isometric-slower"
          style={{ top: "38%", left: "50%", marginLeft: -180, transform: "translateZ(120px)" }}
        >
          <HackerPanel title="analytics.live" status="metrics">
            <div className="p-4">
              {/* Métricas */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                {metrics.map((m) => {
                  const Icon = m.icon;
                  return (
                    <div key={m.label} className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1.5">
                        <Icon size={10} style={{ color: m.color }} />
                        <span className="text-[8px] tracking-widest uppercase" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#4A5568" }}>
                          {m.label}
                        </span>
                      </div>
                      <div className="text-base font-bold mb-0.5" style={{ fontFamily: "'Poppins', sans-serif", color: "#FFFFFF" }}>
                        {m.value}
                      </div>
                      <div className="text-[9px] font-bold" style={{ fontFamily: "'JetBrains Mono', monospace", color: m.color }}>
                        {m.change}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Gráfica de barras */}
              <div className="h-16 flex items-end gap-1 px-2 py-2 rounded-md" style={{ background: "rgba(0,102,255,0.05)", border: "1px solid rgba(0,102,255,0.15)" }}>
                {barHeights.map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-sm transition-all duration-1000 ease-out"
                    style={{
                      height: `${h}%`,
                      background: "linear-gradient(to top, #0066FF, #00C2FF)",
                      boxShadow: "0 0 8px rgba(0,102,255,0.4)",
                    }}
                  />
                ))}
              </div>
            </div>
          </HackerPanel>
        </div>

        {/* ═══════════════════════════════════════════════════
           PANEL 4 — SYSTEM STATS (abajo izquierda)
           ═══════════════════════════════════════════════════ */}
        <div
          className="absolute w-[220px] animate-float-isometric"
          style={{ bottom: "8%", left: "2%", transform: "translateZ(70px)", animationDelay: "1s" }}
        >
          <HackerPanel title="system.monitor" status="ok">
            <div className="p-3 space-y-3">
              {systemStats.map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.label}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <Icon size={10} style={{ color: s.color }} />
                        <span className="text-[9px] tracking-widest uppercase" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#8B94A8" }}>
                          {s.label}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold" style={{ fontFamily: "'JetBrains Mono', monospace", color: s.color }}>
                        {s.value}%
                      </span>
                    </div>
                    <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{
                          width: `${s.value}%`,
                          background: `linear-gradient(90deg, ${s.color}, ${s.color}80)`,
                          boxShadow: `0 0 8px ${s.color}`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </HackerPanel>
        </div>

        {/* ═══════════════════════════════════════════════════
           PANEL 5 — STATUS CHIPS (abajo derecha)
           ═══════════════════════════════════════════════════ */}
        <div
          className="absolute w-[200px] animate-float-isometric-slow"
          style={{ bottom: "6%", right: "4%", transform: "translateZ(90px)", animationDelay: "0.5s" }}
        >
          <HackerPanel title="status" status="ok">
            <div className="p-3 space-y-2">
              {[
                { icon: Shield, label: "SSL",      value: "TLS 1.3",  color: "#22C55E" },
                { icon: Cpu,    label: "Cluster",  value: "3 nodes",  color: "#00C2FF" },
                { icon: Wifi,   label: "Network",  value: "Optimal",  color: "#22C55E" },
                { icon: Lock,   label: "Auth",     value: "JWT",      color: "#7C3AED" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Icon size={10} style={{ color: item.color }} />
                      <span className="text-[9px] tracking-widest uppercase" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#8B94A8" }}>
                        {item.label}
                      </span>
                    </div>
                    <span className="text-[9px] font-bold" style={{ fontFamily: "'JetBrains Mono', monospace", color: item.color }}>
                      {item.value}
                    </span>
                  </div>
                );
              })}
            </div>
          </HackerPanel>
        </div>

        {/* ═══════════════════════════════════════════════════
           NÚCLEO CENTRAL (pequeño, hexágono girando)
           ═══════════════════════════════════════════════════ */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none"
          style={{ transform: "translate(-50%, -50%) translateZ(180px)" }}
        >
          <div
            className="relative w-20 h-20 flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #0066FF 0%, #00C2FF 100%)",
              boxShadow: "0 0 60px rgba(0,102,255,0.9), 0 0 120px rgba(0,102,255,0.5)",
              clipPath: "polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)",
              animation: "pulse-ring 3s ease-in-out infinite",
            }}
          >
            <span className="text-3xl font-black text-white" style={{ fontFamily: "'Poppins', sans-serif", textShadow: "0 0 20px rgba(255,255,255,0.9)" }}>
              A
            </span>
          </div>
          {/* Anillos giratorios */}
          <div
            className="absolute -inset-4 rounded-full animate-spin-slow"
            style={{
              background: "conic-gradient(from 0deg, transparent 0%, #00C2FF 20%, transparent 40%, #0066FF 60%, transparent 80%, #00C2FF 100%)",
              maskImage: "radial-gradient(circle, transparent 65%, black 67%, black 72%, transparent 74%)",
              WebkitMaskImage: "radial-gradient(circle, transparent 65%, black 67%, black 72%, transparent 74%)",
            }}
          />
        </div>

        {/* Líneas de conexión entre paneles */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 640 520" style={{ transform: "translateZ(40px)" }}>
          <defs>
            <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00C2FF" stopOpacity="0" />
              <stop offset="50%" stopColor="#00C2FF" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#00C2FF" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Terminal → Core */}
          <line x1="170" y1="120" x2="320" y2="260" stroke="url(#lineGrad)" strokeWidth="1" strokeDasharray="4 4" className="animate-dash" />
          {/* Logs → Core */}
          <line x1="490" y1="100" x2="320" y2="260" stroke="url(#lineGrad)" strokeWidth="1" strokeDasharray="4 4" className="animate-dash" />
          {/* Stats → Core */}
          <line x1="120" y1="400" x2="320" y2="260" stroke="url(#lineGrad)" strokeWidth="1" strokeDasharray="4 4" className="animate-dash" />
          {/* Status → Core */}
          <line x1="530" y1="400" x2="320" y2="260" stroke="url(#lineGrad)" strokeWidth="1" strokeDasharray="4 4" className="animate-dash" />
        </svg>
      </div>

      {/* ══════════ BARRA INFERIOR ══════════ */}
      <div
        className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 px-5 py-2.5 rounded-full border backdrop-blur-md whitespace-nowrap z-30"
        style={{
          background: "rgba(10,26,47,0.95)",
          borderColor: "rgba(0,194,255,0.4)",
          boxShadow: "0 8px 32px rgba(0,102,255,0.3)",
        }}
      >
        <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" style={{ boxShadow: "0 0 10px #22C55E" }} />
        <span className="text-[10px] tracking-[0.2em] uppercase font-bold" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#FFFFFF" }}>
          Control Center
        </span>
        <span className="w-px h-3" style={{ background: "rgba(255,255,255,0.2)" }} />
        <span className="text-[10px] tracking-widest" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#00C2FF" }}>
          ALL SYSTEMS NOMINAL
        </span>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   HACKER PANEL — Contenedor con marco isométrico
   ══════════════════════════════════════════════════════════ */
function HackerPanel({
  title,
  status,
  children,
}: {
  title: string;
  status: string;
  children: React.ReactNode;
}) {
  const statusColors: Record<string, string> = {
    success: "#22C55E",
    live: "#EF4444",
    metrics: "#00C2FF",
    ok: "#22C55E",
  };
  const statusColor = statusColors[status] || "#00C2FF";

  return (
    <div
      className="relative rounded-lg overflow-hidden backdrop-blur-md transition-transform duration-500 hover:scale-[1.02]"
      style={{
        background: "rgba(5,10,20,0.92)",
        border: `1px solid rgba(0,194,255,0.25)`,
        boxShadow: `0 20px 60px rgba(0,0,0,0.7), 0 0 30px rgba(0,102,255,0.15), inset 0 0 30px rgba(0,102,255,0.03)`,
      }}
    >
      {/* Barra superior */}
      <div
        className="flex items-center justify-between px-3 py-1.5 border-b"
        style={{ borderColor: "rgba(0,194,255,0.15)", background: "rgba(0,102,255,0.04)" }}
      >
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF5F57]" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#FEBC2E]" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#28C840]" />
        </div>
        <span className="text-[8px] tracking-widest" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#4A5568" }}>
          {title}
        </span>
        <div className="flex items-center gap-1">
          <Circle size={5} fill={statusColor} style={{ color: statusColor }} />
          <span className="text-[7px] tracking-widest uppercase" style={{ fontFamily: "'JetBrains Mono', monospace", color: statusColor }}>
            {status}
          </span>
        </div>
      </div>

      {/* Contenido */}
      <div className="relative">
        {children}
        {/* Scanlines sutiles */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.05]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,194,255,0.5) 2px, rgba(0,194,255,0.5) 3px)",
          }}
        />
      </div>
    </div>
  );
}