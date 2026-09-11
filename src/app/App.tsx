import { useState, useEffect, useRef, useMemo, type ReactNode, type CSSProperties } from "react";
import { FaWhatsapp, FaInstagram, FaLinkedin, FaGithub } from "react-icons/fa";
import {
  Code2, Smartphone, Cloud, ShoppingCart, Utensils, Store,
  Wrench, ArrowRight, Check, Menu, X,
  Zap, Shield, BarChart3, Boxes, Sparkles, Rocket,
  Database, Layers, Lock, Settings,
  Clock, Award, Headphones, ChevronRight, Play,
  Printer, Monitor, HardDrive, Network
} from "lucide-react";

/* ============================================================
   IMÁGENES
   ============================================================ */
const IMAGES = {
  heroBg: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&h=1200&fit=crop&auto=format",
  circuit: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600&h=1000&fit=crop&auto=format",
};

/* ============================================================
   DATA
   ============================================================ */
const solutions = [
  {
    tag: "Software",
    title: "Creación de Software",
    subtitle: "Para empresas · negocios · usuarios",
    desc: "Diseñamos y desarrollamos software a la medida: desde sistemas internos hasta plataformas SaaS, apps móviles y puntos de venta. Nos adaptamos a tu operación, no al revés.",
    bullets: [
      "Software para empresas, negocios y usuarios",
      "Apps web y móviles (iOS · Android)",
      "Sistemas POS, inventarios y facturación",
      "ERP, CRM y automatización de procesos",
      "Integraciones, APIs y migración de datos",
    ],
    cta: "Explorar desarrollo",
    icons: [Code2, Smartphone, ShoppingCart, Database, Layers],
    accent: "#0066FF",
  },
  {
    tag: "Servicio técnico",
    title: "Soporte, Mantenimiento y Reparación",
    subtitle: "Impresoras · computadoras · redes",
    desc: "Servicio técnico especializado para mantener tu operación funcionando. Reparamos, damos mantenimiento y optimizamos tus equipos con atención rápida y garantizada.",
    bullets: [
      "Reparación de impresoras (láser, tinta, térmicas)",
      "Mantenimiento preventivo y correctivo de PCs",
      "Formateo, instalación de software y drivers",
      "Cambio de piezas y upgrades (RAM, SSD, etc.)",
      "Redes, WiFi y configuración de impresoras compartidas",
    ],
    cta: "Solicitar servicio técnico",
    icons: [Printer, Monitor, HardDrive, Network, Wrench],
    accent: "#00C2FF",
  },
];

const products = [
  { name: "ALZOVA POS",        icon: ShoppingCart, desc: "Punto de venta rápido, offline-first y multi-sucursal." },
  { name: "ALZOVA Inventory",  icon: Boxes,        desc: "Inventario inteligente con alertas y reposición automática." },
  { name: "ALZOVA Restaurant", icon: Utensils,     desc: "Gestión completa para cocina, mesas y delivery." },
  { name: "ALZOVA Fashion",    icon: Store,        desc: "Variantes, colecciones y analítica de tendencias." },
  { name: "ALZOVA Market",     icon: ShoppingCart, desc: "Supermercados, caducidades y balanzas integradas." },
  { name: "ALZOVA Custom",     icon: Code2,        desc: "Software a la medida para tu operación específica." },
];

const services = [
  { icon: Rocket,    title: "Consultoría tecnológica", desc: "Diagnóstico, arquitectura y hoja de ruta." },
  { icon: Code2,     title: "Desarrollo web y móvil",  desc: "Apps escalables con stack moderno." },
  { icon: Layers,    title: "Diseño UX/UI",            desc: "Interfaces claras, medibles y usables." },
  { icon: Shield,    title: "QA y testing",            desc: "Calidad automatizada y manual continua." },
  { icon: Settings,  title: "Mantenimiento y soporte", desc: "SLA, monitoreo y evolución continua." },
  { icon: Cloud,     title: "Infraestructura y nube",  desc: "AWS, GCP, Azure y despliegue CI/CD." },
  { icon: Lock,      title: "Ciberseguridad",          desc: "Hardening, pentesting y cumplimiento." },
  { icon: BarChart3, title: "Analítica y BI",          desc: "Dashboards que deciden por ti." },
];

const process = [
  { n: "01", title: "Descubrimiento", desc: "Entendemos tu operación, KPIs y dolores reales." },
  { n: "02", title: "Diseño",         desc: "Wireframes, prototipos y validación contigo." },
  { n: "03", title: "Desarrollo",     desc: "Sprints ágiles con entregas cada 2 semanas." },
  { n: "04", title: "Despliegue + Soporte", desc: "Go live, capacitación y acompañamiento 24/7." },
];

const stats = [
  { value: 120, suffix: "+",  label: "Proyectos entregados" },
  { value: 45,  suffix: "+",  label: "Clientes activos" },
  { value: 99,  suffix: "%",  label: "Uptime garantizado" },
  { value: 24,  suffix: "/7", label: "Soporte técnico" },
];

const techs = ["React", "Node.js", "TypeScript", "PostgreSQL", "AWS", "Docker", "Kubernetes", "Next.js", "Tailwind", "Flutter", "Python", "Redis"];

const testimonials = [
  { name: "Camila Restrepo", role: "Dueña",   company: "Boutique Lumière", text: "Con ALZOVA POS duplicamos ventas y por fin controlamos el inventario por talla. El equipo es impecable." },
  { name: "Andrés Molina",   role: "Gerente", company: "La Trattoria",     text: "Las comandas y el KDS cambiaron nuestra cocina. Los pedidos salen más rápido y sin errores." },
  { name: "Daniela Cruz",    role: "COO",     company: "Mercado Vecino",   text: "Automatizamos caducidades y promociones. Redujimos mermas un 32% en el primer trimestre." },
];

/* ============================================================
   HOOKS
   ============================================================ */
function useIntersection(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function useCountUp(target: number, active: boolean, duration = 1600) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, active, duration]);
  return val;
}

/* ============================================================
   PRIMITIVOS
   ============================================================ */
function Reveal({ children, delay = 0, className = "", style }: { children: ReactNode; delay?: number; className?: string; style?: CSSProperties }) {
  const { ref, visible } = useIntersection();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.9s cubic-bezier(.2,.7,.2,1) ${delay}ms, transform 0.9s cubic-bezier(.2,.7,.2,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

function Badge({ children }: { children: ReactNode }) {
  return (
    <span
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] tracking-[0.2em] uppercase"
      style={{
        fontFamily: "'JetBrains Mono', monospace",
        color: "#8B94A8",
        background: "rgba(0,102,255,0.06)",
        border: "1px solid rgba(0,102,255,0.18)",
      }}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-[#0066FF] animate-pulse" />
      {children}
    </span>
  );
}

/* ============================================================
   DASHBOARD MOCKUP
   ============================================================ */
function DashboardMockup() {
  return (
    <div className="relative">
      <div className="absolute -inset-8 rounded-3xl blur-3xl opacity-40 pointer-events-none" style={{ background: "radial-gradient(circle at 50% 50%, #0066FF 0%, transparent 70%)" }} />
      <div className="relative rounded-2xl overflow-hidden border shadow-2xl animate-float" style={{ background: "linear-gradient(145deg, #0A1A2F 0%, #0B0F1A 100%)", borderColor: "rgba(255,255,255,0.08)" }}>
        <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
          <span className="ml-4 text-[10px] tracking-widest" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#8B94A8" }}>alzova.dashboard / live</span>
        </div>
        <div className="grid grid-cols-12">
          <div className="col-span-3 border-r p-3 space-y-2" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            {["Inicio", "Ventas", "Stock", "Clientes", "Reportes"].map((it, i) => (
              <div key={it} className="flex items-center gap-2 px-2 py-1.5 rounded-md text-[10px]" style={{ fontFamily: "'JetBrains Mono', monospace", color: i === 1 ? "#FFFFFF" : "#8B94A8", background: i === 1 ? "rgba(0,102,255,0.15)" : "transparent", border: i === 1 ? "1px solid rgba(0,102,255,0.3)" : "1px solid transparent" }}>
                <span className="w-1 h-1 rounded-full bg-current opacity-60" />{it}
              </div>
            ))}
          </div>
          <div className="col-span-9 p-4 space-y-3">
            <div className="grid grid-cols-3 gap-2">
              {[{ l: "Ventas hoy", v: "$4.2K", c: "#00C2FF" }, { l: "Órdenes", v: "182", c: "#0066FF" }, { l: "Ticket avg", v: "$23.1", c: "#7C3AED" }].map((s) => (
                <div key={s.l} className="rounded-lg p-2.5 border" style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.06)" }}>
                  <div className="text-[9px] mb-1" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#8B94A8" }}>{s.l}</div>
                  <div className="text-sm font-semibold" style={{ color: s.c, fontFamily: "'Poppins', sans-serif" }}>{s.v}</div>
                </div>
              ))}
            </div>
            <div className="rounded-lg p-3 border" style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.06)" }}>
              <div className="flex items-end justify-between h-24 gap-1.5">
                {[40, 55, 35, 70, 52, 88, 62, 95, 74, 60, 82, 68].map((h, i) => (
                  <div key={i} className="flex-1 rounded-sm animate-bar" style={{ height: `${h}%`, background: "linear-gradient(to top, #0066FF, #00C2FF)", animationDelay: `${i * 90}ms` }} />
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 text-[10px]" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#8B94A8" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-[#28C840] animate-pulse" />Sincronizado · hace 2s
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   WHATSAPP FLOAT — SIN overflow-hidden, con z muy alto
   ============================================================ */
function WhatsAppFloat() {
  const [open, setOpen] = useState(false);
  const [showTip, setShowTip] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowTip(true), 4000);
    const t2 = setTimeout(() => setShowTip(false), 12000);
    return () => { clearTimeout(t); clearTimeout(t2); };
  }, []);

  const phone = "573000000000";
  const waLink = (msg: string) => `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;

  const quickReplies = [
    { label: "💻 Quiero software a la medida", msg: "Hola, quiero cotizar un software a la medida para mi negocio." },
    { label: "🖨️ Reparación de impresora",     msg: "Hola, necesito soporte técnico / reparación de una impresora." },
    { label: "🖥️ Mantenimiento de PCs",        msg: "Hola, quiero información sobre mantenimiento de computadoras." },
    { label: "🌐 Redes y WiFi",                msg: "Hola, necesito ayuda con configuración de red / WiFi." },
  ];

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
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white animate-bounce-in" style={{ background: "#EF4444" }}>
              1
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   APP
   ============================================================ */
export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);

  const particles = useMemo(
    () => Array.from({ length: 28 }).map(() => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: 1 + Math.random() * 2,
      delay: Math.random() * 8,
      duration: 8 + Math.random() * 10,
      opacity: 0.2 + Math.random() * 0.5,
    })),
    []
  );

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(h > 0 ? (window.scrollY / h) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => e.isIntersecting && setStatsVisible(true), { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const navItems = [
    ["Soluciones", "soluciones"],
    ["Productos",  "productos"],
    ["Servicios",  "servicios"],
    ["Proceso",    "proceso"],
    ["Contacto",   "contacto"],
  ];

  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <div className="fixed top-0 left-0 h-[2px] z-[60]" style={{ width: `${scrollProgress}%`, background: "linear-gradient(90deg, #0066FF, #00C2FF)", transition: "width 0.1s linear" }} />

      <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-500" style={{ paddingTop: scrolled ? "12px" : "20px", paddingBottom: scrolled ? "12px" : "20px", background: scrolled ? "rgba(11,11,11,0.85)" : "transparent", backdropFilter: scrolled ? "blur(20px)" : "none", borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent" }}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #0066FF 0%, #00C2FF 100%)" }}>
              <span className="text-white font-black text-lg" style={{ fontFamily: "'Poppins', sans-serif" }}>A</span>
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-[15px] font-bold tracking-wide" style={{ fontFamily: "'Poppins', sans-serif" }}>ALZOVA</span>
              <span className="text-[9px] tracking-[0.35em]" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#8B94A8" }}>SYSTEMS</span>
            </div>
          </a>
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map(([label, id]) => (
              <a key={id} href={`#${id}`} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ color: "#B8C0D0" }}>{label}</a>
            ))}
          </div>
          <div className="hidden lg:flex items-center gap-3">
            <a href="#contacto" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white" style={{ background: "linear-gradient(135deg, #0066FF 0%, #0052CC 100%)" }}>
              Cotiza tu proyecto <ArrowRight size={15} />
            </a>
          </div>
          <button className="lg:hidden w-10 h-10 rounded-lg flex items-center justify-center border" style={{ borderColor: "rgba(255,255,255,0.1)" }} onClick={() => setMenuOpen(!menuOpen)} aria-label="Menú">
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden pt-24 px-6" style={{ background: "rgba(11,11,11,0.98)" }}>
          <div className="flex flex-col gap-2">
            {navItems.map(([label, id]) => (
              <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)} className="py-4 text-2xl font-semibold border-b flex items-center justify-between" style={{ borderColor: "rgba(255,255,255,0.06)", fontFamily: "'Poppins', sans-serif" }}>
                {label}<ChevronRight size={20} style={{ color: "#0066FF" }} />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* HERO */}
      <section className="relative min-h-screen flex items-center pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <img src={IMAGES.heroBg} alt="" className="absolute inset-0 w-full h-full object-cover animate-kenburns" style={{ opacity: 0.18 }} />
          <div className="absolute inset-0 grid-bg animate-grid" />
          <div className="orb orb-1" /><div className="orb orb-2" /><div className="orb orb-3" />
          {particles.map((p, i) => (
            <span key={i} className="particle" style={{ left: `${p.left}%`, top: `${p.top}%`, width: `${p.size}px`, height: `${p.size}px`, opacity: p.opacity, animationDelay: `${p.delay}s`, animationDuration: `${p.duration}s` }} />
          ))}
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <Reveal><Badge>Software · Automatización · Cloud</Badge></Reveal>
              <Reveal delay={100}>
                <h1 className="mt-8 text-5xl md:text-6xl lg:text-7xl leading-[1.05] font-extrabold tracking-tight" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Tecnología que <span className="gradient-text">impulsa</span> tu negocio al futuro.
                </h1>
              </Reveal>
              <Reveal delay={200}>
                <p className="mt-7 text-lg md:text-xl leading-relaxed max-w-xl" style={{ color: "#8B94A8" }}>
                  Desarrollamos software a la medida, POS, inventarios y automatización para retail, gastronomía, supermercados y más.
                </p>
              </Reveal>
              <Reveal delay={300}>
                <div className="mt-10 flex flex-wrap items-center gap-4">
                  <a href="#soluciones" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white" style={{ background: "linear-gradient(135deg, #0066FF 0%, #0052CC 100%)" }}>
                    Explorar soluciones <ArrowRight size={16} />
                  </a>
                  <a href="#productos" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold border" style={{ borderColor: "rgba(255,255,255,0.12)", color: "#FFFFFF" }}>
                    <Play size={14} style={{ color: "#0066FF" }} /> Ver demo
                  </a>
                </div>
              </Reveal>
              <Reveal delay={400}>
                <div className="mt-12 flex flex-wrap items-center gap-6 text-xs" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#8B94A8" }}>
                  <span className="flex items-center gap-2"><Check size={14} style={{ color: "#0066FF" }} /> Sin contratos largos</span>
                  <span className="flex items-center gap-2"><Check size={14} style={{ color: "#0066FF" }} /> Implementación en semanas</span>
                  <span className="flex items-center gap-2"><Check size={14} style={{ color: "#0066FF" }} /> Soporte 24/7</span>
                </div>
              </Reveal>
            </div>
            <Reveal delay={200}><DashboardMockup /></Reveal>
          </div>
        </div>
      </section>

      {/* TECHS */}
      <section className="py-16 border-y" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-[11px] tracking-[0.3em] uppercase mb-8" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#8B94A8" }}>Stack tecnológico que dominamos</p>
          <div className="overflow-hidden">
            <div className="marquee flex gap-12 whitespace-nowrap">
              {[...techs, ...techs].map((t, i) => (
                <span key={i} className="text-lg font-semibold" style={{ fontFamily: "'Poppins', sans-serif", color: "#4A5568" }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SOLUCIONES */}
      <section id="soluciones" className="py-28 md:py-36">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <Badge>Soluciones</Badge>
            <h2 className="mt-6 text-4xl md:text-5xl font-extrabold tracking-tight max-w-3xl" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Dos formas de <span className="gradient-text">impulsar</span> tu negocio
            </h2>
            <p className="mt-5 text-lg max-w-2xl" style={{ color: "#8B94A8" }}>Creamos el software que necesitas y mantenemos los equipos que ya tienes funcionando.</p>
          </Reveal>
          <div className="mt-16 grid lg:grid-cols-2 gap-6">
            {solutions.map((s, i) => (
              <Reveal key={s.title} delay={i * 120}>
                <div className="group relative h-full p-8 md:p-10 rounded-3xl border" style={{ background: "linear-gradient(145deg, rgba(10,26,47,0.7), rgba(11,11,11,0.7))", borderColor: "rgba(255,255,255,0.07)" }}>
                  <div className="flex items-start justify-between mb-7">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${s.accent} 0%, ${s.accent}AA 100%)`, boxShadow: `0 12px 40px ${s.accent}55` }}>
                      {(() => { const Icon = s.icons[0]; return <Icon size={28} className="text-white" />; })()}
                    </div>
                    <span className="text-[10px] tracking-widest uppercase px-3 py-1.5 rounded-full" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#8B94A8", background: "rgba(255,255,255,0.04)" }}>{s.tag}</span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-extrabold mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>{s.title}</h3>
                  <p className="text-xs tracking-widest uppercase mb-5" style={{ fontFamily: "'JetBrains Mono', monospace", color: s.accent }}>{s.subtitle}</p>
                  <p className="text-base leading-relaxed mb-7" style={{ color: "#8B94A8" }}>{s.desc}</p>
                  <ul className="space-y-3 mb-9">
                    {s.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-3">
                        <span className="mt-1 w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: `${s.accent}1A`, border: `1px solid ${s.accent}44` }}>
                          <Check size={11} style={{ color: s.accent }} />
                        </span>
                        <span className="text-sm" style={{ color: "#C4CCDB" }}>{b}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center gap-2 mb-7">
                    {s.icons.slice(1).map((Ico, k) => (
                      <div key={k} className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                        <Ico size={15} style={{ color: "#8B94A8" }} />
                      </div>
                    ))}
                  </div>
                  <a href="#contacto" className="inline-flex items-center gap-2 text-sm font-semibold" style={{ color: s.accent }}>
                    {s.cta} <ArrowRight size={15} />
                  </a>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCTOS */}
      <section id="productos" className="py-28 md:py-36" style={{ background: "linear-gradient(180deg, transparent 0%, rgba(10,26,47,0.4) 50%, transparent 100%)" }}>
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <Badge>Nuestros productos</Badge>
            <h2 className="mt-6 text-4xl md:text-5xl font-extrabold tracking-tight max-w-3xl" style={{ fontFamily: "'Poppins', sans-serif" }}>
              La familia <span className="gradient-text">ALZOVA</span>
            </h2>
          </Reveal>
          <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {products.map((p, i) => {
              const Icon = p.icon;
              return (
                <Reveal key={p.name} delay={i * 60}>
                  <div className="p-7 rounded-2xl border" style={{ background: "#0A1A2F", borderColor: "rgba(255,255,255,0.06)" }}>
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6" style={{ background: "linear-gradient(135deg, #0066FF 0%, #00C2FF 100%)" }}>
                      <Icon size={22} className="text-white" />
                    </div>
                    <h3 className="text-lg font-bold mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>{p.name}</h3>
                    <p className="text-sm" style={{ color: "#8B94A8" }}>{p.desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* SERVICIOS */}
      <section id="servicios" className="py-28 md:py-36">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <Badge>Servicios</Badge>
            <h2 className="mt-6 text-4xl md:text-5xl font-extrabold tracking-tight max-w-2xl" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Todo lo que necesitas para digitalizar tu empresa
            </h2>
          </Reveal>
          <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {services.map((s, i) => {
              const Icon = s.icon;
              return (
                <Reveal key={s.title} delay={i * 50}>
                  <div className="p-6 rounded-2xl border" style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.06)" }}>
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-5" style={{ background: "rgba(0,102,255,0.1)" }}>
                      <Icon size={18} style={{ color: "#0066FF" }} />
                    </div>
                    <h3 className="text-base font-bold mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>{s.title}</h3>
                    <p className="text-sm" style={{ color: "#8B94A8" }}>{s.desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* PROCESO */}
      <section id="proceso" className="py-28 md:py-36" style={{ background: "linear-gradient(180deg, transparent 0%, rgba(10,26,47,0.5) 50%, transparent 100%)" }}>
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <Badge>Cómo trabajamos</Badge>
            <h2 className="mt-6 text-4xl md:text-5xl font-extrabold tracking-tight max-w-3xl" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Un proceso claro, sin sorpresas
            </h2>
          </Reveal>
          <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {process.map((p, i) => (
              <Reveal key={p.n} delay={i * 100}>
                <div>
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-xl mb-6" style={{ fontFamily: "'JetBrains Mono', monospace", background: "linear-gradient(135deg, #0066FF 0%, #0052CC 100%)", color: "#FFFFFF" }}>
                    {p.n}
                  </div>
                  <h3 className="text-lg font-bold mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>{p.title}</h3>
                  <p className="text-sm" style={{ color: "#8B94A8" }}>{p.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section ref={statsRef} className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="rounded-3xl border overflow-hidden relative" style={{ background: "linear-gradient(135deg, #0A1A2F 0%, #0B0F1A 100%)", borderColor: "rgba(255,255,255,0.06)" }}>
            <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-20 blur-3xl" style={{ background: "#0066FF" }} />
            <div className="relative grid md:grid-cols-4 gap-8 p-10 md:p-16">
              {stats.map((s, i) => {
                const val = useCountUp(s.value, statsVisible, 1600 + i * 100);
                return (
                  <div key={s.label} className="text-center md:text-left">
                    <div className="text-5xl md:text-6xl font-extrabold gradient-text" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      {val}{s.suffix}
                    </div>
                    <div className="mt-3 text-sm" style={{ color: "#8B94A8" }}>{s.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIOS */}
      <section className="py-28 md:py-36">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <Badge>Testimonios</Badge>
            <h2 className="mt-6 text-4xl md:text-5xl font-extrabold tracking-tight max-w-3xl" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Lo que dicen nuestros clientes
            </h2>
          </Reveal>
          <div className="mt-16 grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <Reveal key={t.name} delay={i * 100}>
                <div className="h-full p-8 rounded-2xl border" style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.06)" }}>
                  <div className="flex gap-1 mb-5">
                    {Array.from({ length: 5 }).map((_, k) => (<Sparkles key={k} size={14} style={{ color: "#0066FF" }} />))}
                  </div>
                  <p className="text-base mb-7" style={{ color: "#C4CCDB" }}>"{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm" style={{ background: "linear-gradient(135deg, #0066FF, #00C2FF)", color: "#FFFFFF" }}>
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{t.name}</div>
                      <div className="text-xs" style={{ color: "#8B94A8" }}>{t.role} · {t.company}</div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="contacto" className="py-28 md:py-36 relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={IMAGES.circuit} alt="" className="w-full h-full object-cover animate-kenburns-slow" style={{ opacity: 0.12 }} />
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, rgba(0,102,255,0.15) 0%, #0B0B0B 70%)" }} />
        </div>
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <Reveal>
            <Badge>Empieza hoy</Badge>
            <h2 className="mt-6 text-4xl md:text-6xl font-extrabold tracking-tight leading-tight" style={{ fontFamily: "'Poppins', sans-serif" }}>
              ¿Listo para <span className="gradient-text">transformar</span> tu negocio?
            </h2>
            <p className="mt-6 text-lg max-w-2xl mx-auto" style={{ color: "#8B94A8" }}>
              Agenda una demo gratuita y descubre cómo ALZOVA SYSTEMS puede impulsar tu operación.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <a href="https://wa.me/message/KYXYN7UEKJM6N1" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-7 py-4 rounded-xl font-semibold text-white" style={{ background: "linear-gradient(135deg, #0066FF 0%, #0052CC 100%)" }}>
                <FaWhatsapp size={18} /> Agenda una demo <ArrowRight size={16} />
              </a>
              <a href="mailto:contacto@alzova.systems" className="inline-flex items-center gap-2 px-7 py-4 rounded-xl font-semibold border" style={{ borderColor: "rgba(255,255,255,0.12)", color: "#FFFFFF" }}>
                contacto@alzova.systems
              </a>
            </div>
            <div className="mt-10 flex flex-wrap justify-center gap-8 text-xs" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#8B94A8" }}>
              <span className="flex items-center gap-2"><Clock size={14} style={{ color: "#0066FF" }} /> Respuesta en &lt; 24h</span>
              <span className="flex items-center gap-2"><Award size={14} style={{ color: "#0066FF" }} /> +120 proyectos</span>
              <span className="flex items-center gap-2"><Headphones size={14} style={{ color: "#0066FF" }} /> Soporte 24/7</span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-4 gap-10">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #0066FF 0%, #00C2FF 100%)" }}>
                  <span className="text-white font-black text-lg" style={{ fontFamily: "'Poppins', sans-serif" }}>A</span>
                </div>
                <div className="flex flex-col leading-none">
                  <span className="text-[15px] font-bold" style={{ fontFamily: "'Poppins', sans-serif" }}>ALZOVA</span>
                  <span className="text-[9px] tracking-[0.35em]" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#8B94A8" }}>SYSTEMS</span>
                </div>
              </div>
              <p className="text-sm" style={{ color: "#8B94A8" }}>Software a la medida y soluciones tecnológicas para empresas que quieren crecer.</p>
            </div>
            {[
              { t: "Soluciones", l: ["Creación de software", "Soporte técnico", "Reparación de equipos", "Mantenimiento", "Redes y WiFi"] },
              { t: "Servicios",  l: ["Consultoría", "Desarrollo web y móvil", "UX/UI", "Mantenimiento", "Ciberseguridad"] },
              { t: "Empresa",    l: ["Nosotros", "Casos de éxito", "Blog", "Trabaja con nosotros", "Contacto"] },
            ].map((col) => (
              <div key={col.t}>
                <h4 className="text-xs tracking-widest uppercase mb-4" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#FFFFFF" }}>{col.t}</h4>
                <ul className="space-y-2.5">
                  {col.l.map((it) => (<li key={it}><a href="#" className="text-sm" style={{ color: "#8B94A8" }}>{it}</a></li>))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-14 pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-6" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            <p className="text-xs" style={{ color: "#8B94A8" }}>© {new Date().getFullYear()} ALZOVA SYSTEMS · Todos los derechos reservados.</p>
            <div className="flex items-center gap-3">
              {[
                { icon: FaWhatsapp,  href: "https://wa.me/message/KYXYN7UEKJM6N1" },
                { icon: FaInstagram, href: "https://www.instagram.com/" },
                { icon: FaLinkedin,  href: "https://www.linkedin.com/" },
                { icon: FaGithub,    href: "https://github.com/" },
              ].map(({ icon: Icon, href }, i) => (
                <a key={i} href={href} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg flex items-center justify-center border" style={{ borderColor: "rgba(255,255,255,0.08)", color: "#8B94A8" }}>
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* WHATSAPP FLOTANTE */}
      <WhatsAppFloat />

      <style>{`
        html { scroll-behavior: smooth; }
        body { background: #0B0B0B; }
        html, body { overflow-x: hidden; }
        ::selection { background: rgba(0,102,255,0.35); color: #FFFFFF; }
        ::-webkit-scrollbar { width: 10px; }
        ::-webkit-scrollbar-track { background: #0B0B0B; }
        ::-webkit-scrollbar-thumb { background: linear-gradient(to bottom, #0066FF, #0052CC); border-radius: 20px; }
        .gradient-text { background: linear-gradient(135deg, #0066FF 0%, #00C2FF 100%); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }
        .grid-bg { background-image: linear-gradient(rgba(0,102,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(0,102,255,0.07) 1px, transparent 1px); background-size: 60px 60px; mask-image: radial-gradient(ellipse at center, black 30%, transparent 75%); }
        @keyframes grid-pan { 0% { background-position: 0 0, 0 0; } 100% { background-position: 60px 60px, 60px 60px; } }
        .animate-grid { animation: grid-pan 20s linear infinite; }
        .orb { position: absolute; border-radius: 50%; filter: blur(80px); pointer-events: none; }
        .orb-1 { width: 500px; height: 500px; background: #0066FF; top: -100px; left: -100px; opacity: 0.25; animation: orb-float 18s ease-in-out infinite; }
        .orb-2 { width: 400px; height: 400px; background: #00C2FF; bottom: -80px; right: -80px; opacity: 0.18; animation: orb-float 22s ease-in-out infinite reverse; }
        .orb-3 { width: 350px; height: 350px; background: #7C3AED; top: 40%; left: 50%; opacity: 0.12; animation: orb-float 26s ease-in-out infinite; }
        @keyframes orb-float { 0%, 100% { transform: translate(0, 0) scale(1); } 33% { transform: translate(60px, -50px) scale(1.12); } 66% { transform: translate(-40px, 40px) scale(0.92); } }
        .particle { position: absolute; background: #0066FF; border-radius: 50%; box-shadow: 0 0 8px #0066FF; animation: particle-rise linear infinite; }
        @keyframes particle-rise { 0% { transform: translateY(0); opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { transform: translateY(-120vh); opacity: 0; } }
        @keyframes kenburns { 0% { transform: scale(1); } 100% { transform: scale(1.15) translate(-2%, -2%); } }
        .animate-kenburns { animation: kenburns 30s ease-in-out infinite alternate; }
        .animate-kenburns-slow { animation: kenburns 45s ease-in-out infinite alternate; }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-14px); } }
        .animate-float { animation: float 6s ease-in-out infinite; }
        @keyframes bar-grow { from { transform: scaleY(0); } to { transform: scaleY(1); } }
        .animate-bar { transform-origin: bottom; animation: bar-grow 1s cubic-bezier(.2,.7,.2,1) both; }
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .marquee { display: flex; animation: marquee 40s linear infinite; width: max-content; }
        @keyframes slide-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slide-up { animation: slide-up 0.35s cubic-bezier(.2,.7,.2,1) both; }
        @keyframes slide-in-right { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        .animate-slide-in-right { animation: slide-in-right 0.4s cubic-bezier(.2,.7,.2,1) both; }
        @keyframes bounce-in { 0% { transform: scale(0); } 60% { transform: scale(1.2); } 100% { transform: scale(1); } }
        .animate-bounce-in { animation: bounce-in 0.4s cubic-bezier(.2,.7,.2,1) both; }
        @keyframes ping-slow { 0% { transform: scale(1); opacity: 0.4; } 100% { transform: scale(1.8); opacity: 0; } }
        .animate-ping-slow { animation: ping-slow 2.2s cubic-bezier(0,0,.2,1) infinite; }
      `}</style>
    </div>
  );
}