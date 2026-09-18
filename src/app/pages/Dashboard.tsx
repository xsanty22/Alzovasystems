import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../lib/supabase";
import {
  generateProposal,
  generateProposalBase64,
  generateProposalNumber,
} from "../lib/generateProposal";
import {
  ArrowLeft, Package, TrendingUp, DollarSign, MessageSquare,
  Clock, CheckCircle2, XCircle, AlertCircle, Eye, X,
  Plus, Settings, LogOut, User, Mail, Phone, Building2,
  Calendar, RefreshCw, Sparkles, Download, Send, Loader2,
  Home, BarChart3, FileText, Zap, Activity, Circle,
} from "lucide-react";

/* ══════════════════════════════════════════════════════════
   TIPOS
   ══════════════════════════════════════════════════════════ */
type LeadStatus = "new" | "contacted" | "converted" | "lost";

interface Lead {
  id: string;
  source: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  company: string | null;
  metadata: Record<string, any>;
  status: LeadStatus;
  created_at: string;
}

type Tab = "home" | "quotes" | "account";

/* ══════════════════════════════════════════════════════════
   CONFIGURACIÓN
   ══════════════════════════════════════════════════════════ */
const statusConfig: Record<LeadStatus, { label: string; color: string; icon: any }> = {
  new:       { label: "Nuevo",       color: "#00C2FF", icon: AlertCircle },
  contacted: { label: "En revisión", color: "#F59E0B", icon: Clock },
  converted: { label: "Aprobado",    color: "#22C55E", icon: CheckCircle2 },
  lost:      { label: "Cerrado",     color: "#8B94A8", icon: XCircle },
};

const sourceLabels: Record<string, { label: string; emoji: string; color: string }> = {
  cotizador:        { label: "Cotización",    emoji: "💼", color: "#0066FF" },
  auditoria:        { label: "Auditoría",     emoji: "🔍", color: "#00C2FF" },
  servicio_tecnico: { label: "Serv. técnico", emoji: "🛠️", color: "#7C3AED" },
  contacto:         { label: "Contacto",      emoji: "💬", color: "#22C55E" },
  newsletter:       { label: "Newsletter",    emoji: "📧", color: "#F59E0B" },
};

const navItems = [
  { id: "home",    label: "Inicio",          icon: Home,      desc: "Vista general" },
  { id: "quotes",  label: "Mis cotizaciones", icon: Package,   desc: "Historial completo" },
  { id: "account", label: "Mi cuenta",       icon: User,      desc: "Datos personales" },
];

/* ══════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
   ══════════════════════════════════════════════════════════ */
export function Dashboard() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [clock, setClock] = useState("");

  // Reloj HUD
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setClock(
        `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`
      );
    };
    tick();
    const i = setInterval(tick, 1000);
    return () => clearInterval(i);
  }, []);

  const fetchMyLeads = async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .or(`user_id.eq.${user.id},email.eq.${user.email}`)
      .order("created_at", { ascending: false });

    if (!error && data) setLeads(data as Lead[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchMyLeads();
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const fmt = (n: number) =>
    new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);

  const displayName = profile?.full_name?.split(" ")[0] || user?.email?.split("@")[0] || "Cliente";
  const initials = (profile?.full_name || user?.email || "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const stats = {
    total: leads.length,
    active: leads.filter((l) => l.status === "new" || l.status === "contacted").length,
    converted: leads.filter((l) => l.status === "converted").length,
    totalValue: leads
      .filter((l) => l.metadata?.total)
      .reduce((sum, l) => sum + Number(l.metadata.total), 0),
  };

  if (!user) {
    navigate("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* ══════════ FONDO DECORATIVO ══════════ */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Grid sutil */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,102,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(0,102,255,0.4) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            maskImage: "radial-gradient(ellipse at 50% 0%, black 30%, transparent 75%)",
            WebkitMaskImage: "radial-gradient(ellipse at 50% 0%, black 30%, transparent 75%)",
          }}
        />
        {/* Orbes */}
        <div
          className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full blur-3xl opacity-[0.15]"
          style={{ background: "#0066FF" }}
        />
        <div
          className="absolute top-1/3 -right-40 w-[400px] h-[400px] rounded-full blur-3xl opacity-[0.12]"
          style={{ background: "#00C2FF" }}
        />
      </div>

      {/* ══════════ HEADER HUD ══════════ */}
      <header
        className="sticky top-0 z-40 border-b backdrop-blur-xl relative"
        style={{ borderColor: "rgba(0,194,255,0.15)", background: "rgba(11,11,11,0.85)" }}
      >
        {/* Línea superior azul */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{ background: "linear-gradient(90deg, transparent, #0066FF, #00C2FF, #0066FF, transparent)" }}
        />

        <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between gap-4">
          {/* Logo + título */}
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="w-10 h-10 rounded-lg flex items-center justify-center border transition-all duration-300 hover:bg-white/5 hover:-translate-x-0.5"
              style={{ borderColor: "rgba(0,194,255,0.25)", color: "#B8C0D0" }}
              title="Volver al sitio"
            >
              <ArrowLeft size={16} />
            </Link>

            <div className="relative">
              <div className="flex items-center gap-2 mb-0.5">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" style={{ boxShadow: "0 0 6px #22C55E" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00C2FF] animate-pulse" style={{ animationDelay: "0.3s" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0066FF] animate-pulse" style={{ animationDelay: "0.6s" }} />
                </div>
                <span className="text-[10px] tracking-[0.25em] uppercase" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#00C2FF" }}>
                  ALZOVA.PORTAL // v3.0
                </span>
              </div>
              <h1 className="text-lg md:text-xl font-bold tracking-tight" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Mi cuenta
              </h1>
            </div>
          </div>

          {/* Readouts centrales (hidden en mobile) */}
          <div className="hidden lg:flex items-center gap-6 text-[10px]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            <div className="text-center">
              <div style={{ color: "#4A5568" }}>STATUS</div>
              <div className="flex items-center gap-1.5" style={{ color: "#22C55E" }}>
                <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
                ONLINE
              </div>
            </div>
            <div className="w-px h-6" style={{ background: "rgba(255,255,255,0.08)" }} />
            <div className="text-center">
              <div style={{ color: "#4A5568" }}>SYNC</div>
              <div style={{ color: "#00C2FF" }}>{clock}</div>
            </div>
            <div className="w-px h-6" style={{ background: "rgba(255,255,255,0.08)" }} />
            <div className="text-center">
              <div style={{ color: "#4A5568" }}>SESSION</div>
              <div style={{ color: "#FFFFFF" }}>ACTIVE</div>
            </div>
          </div>

          {/* Avatar + logout */}
          <div className="flex items-center gap-2">
            <button
              onClick={fetchMyLeads}
              className="w-10 h-10 rounded-lg flex items-center justify-center border transition-all duration-300 hover:bg-white/5"
              style={{ borderColor: "rgba(255,255,255,0.1)", color: "#B8C0D0" }}
              title="Actualizar"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            </button>

            <div
              className="flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-xl border"
              style={{ borderColor: "rgba(0,194,255,0.25)", background: "rgba(0,102,255,0.06)" }}
            >
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
                style={{ background: "linear-gradient(135deg, #0066FF, #00C2FF)", color: "#FFFFFF" }}
              >
                {initials}
              </div>
              <span className="text-sm font-semibold hidden md:inline">{displayName}</span>
            </div>

            <button
              onClick={handleSignOut}
              className="w-10 h-10 rounded-lg flex items-center justify-center border transition-all duration-300 hover:bg-red-500/5"
              style={{ borderColor: "rgba(239,68,68,0.3)", color: "#FCA5A5" }}
              title="Cerrar sesión"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </header>

      {/* ══════════ LAYOUT: SIDEBAR + CONTENIDO ══════════ */}
      <div className="relative max-w-[1400px] mx-auto px-6 py-8 flex gap-6">
        {/* ────── SIDEBAR ────── */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div
            className="sticky top-28 rounded-2xl border overflow-hidden"
            style={{
              background: "linear-gradient(145deg, rgba(10,26,47,0.6), rgba(11,11,11,0.6))",
              borderColor: "rgba(0,194,255,0.15)",
            }}
          >
            {/* Header sidebar */}
            <div
              className="px-5 py-4 border-b"
              style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(0,102,255,0.04)" }}
            >
              <div className="flex items-center gap-2 mb-1">
                <Circle size={5} fill="#22C55E" style={{ color: "#22C55E" }} />
                <span className="text-[9px] tracking-widest uppercase" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#4A5568" }}>
                  NAVIGATION
                </span>
              </div>
              <div className="text-xs font-bold" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Panel de cliente
              </div>
            </div>

                        {/* Nav items */}
            <nav className="p-2 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = activeTab === item.id;

                // Contador de cotizaciones
                const badge =
                  item.id === "quotes" && leads.length > 0 ? leads.length : null;

                // Cantidad de propuestas descargables
                const itemPdfCount =
                  item.id === "quotes"
                    ? leads.filter((l) => l.metadata?.project_type).length
                    : 0;

                // Subtítulo dinámico
                const dynamicDesc =
                  item.id === "quotes"
                    ? itemPdfCount > 0
                      ? `Descarga ${itemPdfCount} propuesta${itemPdfCount !== 1 ? "s" : ""} PDF`
                      : "Aún sin propuestas"
                    : item.desc;

                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as Tab)}
                    className="group w-full text-left px-3 py-3 rounded-xl transition-all duration-300 relative overflow-hidden"
                    style={{
                      background: active ? "rgba(0,102,255,0.12)" : "transparent",
                      border: `1px solid ${active ? "rgba(0,102,255,0.4)" : "transparent"}`,
                    }}
                  >
                    {/* Indicador lateral */}
                    {active && (
                      <span
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full"
                        style={{ background: "#0066FF", boxShadow: "0 0 12px #0066FF" }}
                      />
                    )}

                    <div className="flex items-start gap-3">
                      {/* Icono */}
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 mt-0.5"
                        style={{
                          background: active
                            ? "linear-gradient(135deg, #0066FF, #00C2FF)"
                            : "rgba(255,255,255,0.04)",
                          boxShadow: active ? "0 0 20px rgba(0,102,255,0.5)" : "none",
                        }}
                      >
                        <Icon size={14} style={{ color: active ? "#FFFFFF" : "#8B94A8" }} />
                      </div>

                      {/* Texto */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2 mb-0.5">
                          <div
                            className="text-sm font-semibold truncate"
                            style={{ color: active ? "#FFFFFF" : "#B8C0D0" }}
                          >
                            {item.label}
                          </div>

                          {/* Badge contador */}
                          {badge !== null && (
                            <span
                              className="text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0"
                              style={{
                                background: active ? "#0066FF" : "rgba(0,102,255,0.15)",
                                color: active ? "#FFFFFF" : "#00C2FF",
                                fontFamily: "'JetBrains Mono', monospace",
                                border: active ? "none" : "1px solid rgba(0,102,255,0.3)",
                              }}
                            >
                              {badge}
                            </span>
                          )}
                        </div>

                        {/* Sub-descripción dinámica */}
                        <div
                          className="text-[10px] truncate flex items-center gap-1"
                          style={{
                            color:
                              item.id === "quotes" && itemPdfCount > 0
                                ? "#22C55E"
                                : "#4A5568",
                          }}
                        >
                          {item.id === "quotes" && itemPdfCount > 0 && (
                            <span
                              className="w-1 h-1 rounded-full animate-pulse flex-shrink-0"
                              style={{ background: "#22C55E", boxShadow: "0 0 6px #22C55E" }}
                            />
                          )}
                          {dynamicDesc}
                        </div>
                      </div>
                    </div>

                    {/* Mini hint PDF al hover */}
                    {item.id === "quotes" && itemPdfCount > 0 && !active && (
                      <div
                        className="absolute right-2 bottom-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] font-bold"
                        style={{
                          background: "rgba(34,197,94,0.15)",
                          border: "1px solid rgba(34,197,94,0.4)",
                          color: "#22C55E",
                          fontFamily: "'JetBrains Mono', monospace",
                        }}
                      >
                        📄 PDF
                      </div>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Footer sidebar */}
            <div className="p-4 border-t" style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(0,0,0,0.2)" }}>
              <div className="flex items-center justify-between text-[9px]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                <span style={{ color: "#4A5568" }}>UPTIME</span>
                <span className="flex items-center gap-1" style={{ color: "#22C55E" }}>
                  <span className="w-1 h-1 rounded-full bg-[#22C55E] animate-pulse" />
                  99.9%
                </span>
              </div>
            </div>
          </div>
        </aside>

        {/* ────── CONTENIDO PRINCIPAL ────── */}
        <main className="flex-1 min-w-0">
          {/* Tabs móviles */}
          <div className="lg:hidden mb-6 flex gap-1 overflow-x-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as Tab)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all"
                  style={{
                    background: active ? "rgba(0,102,255,0.15)" : "rgba(255,255,255,0.02)",
                    border: `1px solid ${active ? "rgba(0,102,255,0.5)" : "rgba(255,255,255,0.08)"}`,
                    color: active ? "#FFFFFF" : "#8B94A8",
                  }}
                >
                  <Icon size={12} />
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* ────── TAB: HOME ────── */}
          {activeTab === "home" && (
            <div className="space-y-8">
              {/* Bienvenida HUD */}
              <div
                className="relative rounded-3xl border p-6 md:p-8 overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, rgba(0,102,255,0.12) 0%, rgba(0,194,255,0.05) 100%)",
                  borderColor: "rgba(0,102,255,0.3)",
                }}
              >
                {/* Corner brackets */}
                <span className="absolute top-3 left-3 w-4 h-4 pointer-events-none" style={{ borderTop: "2px solid #00C2FF", borderLeft: "2px solid #00C2FF" }} />
                <span className="absolute top-3 right-3 w-4 h-4 pointer-events-none" style={{ borderTop: "2px solid #00C2FF", borderRight: "2px solid #00C2FF" }} />
                <span className="absolute bottom-3 left-3 w-4 h-4 pointer-events-none" style={{ borderBottom: "2px solid #00C2FF", borderLeft: "2px solid #00C2FF" }} />
                <span className="absolute bottom-3 right-3 w-4 h-4 pointer-events-none" style={{ borderBottom: "2px solid #00C2FF", borderRight: "2px solid #00C2FF" }} />

                <div className="relative">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles size={14} style={{ color: "#00C2FF" }} />
                    <span className="text-[10px] tracking-[0.25em] uppercase" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#00C2FF" }}>
                      WELCOME BACK
                    </span>
                  </div>

                  <h2 className="text-3xl md:text-5xl font-extrabold mb-3 leading-tight" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Hola <span className="gradient-text">{displayName}</span> 👋
                  </h2>
                  <p className="text-base max-w-2xl" style={{ color: "#B8C0D0" }}>
                    Bienvenido a tu portal de cliente. Aquí puedes ver el estado de tus solicitudes, descargar propuestas y gestionar tu cuenta.
                  </p>
                </div>
              </div>

              {/* Stats grid */}
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <BarChart3 size={14} style={{ color: "#00C2FF" }} />
                  <span className="text-[10px] tracking-[0.25em] uppercase" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#00C2FF" }}>
                    MÉTRICAS
                  </span>
                  <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, rgba(0,194,255,0.3), transparent)" }} />
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard icon={Package} label="Cotizaciones" value={stats.total} color="#0066FF" />
                  <StatCard icon={Clock} label="En proceso" value={stats.active} color="#F59E0B" />
                  <StatCard icon={CheckCircle2} label="Aprobadas" value={stats.converted} color="#22C55E" />
                  <StatCard icon={DollarSign} label="Total invertido" value={fmt(stats.totalValue)} color="#00C2FF" />
                </div>
              </div>

              {/* Acciones rápidas */}
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <Zap size={14} style={{ color: "#00C2FF" }} />
                  <span className="text-[10px] tracking-[0.25em] uppercase" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#00C2FF" }}>
                    ACCIONES RÁPIDAS
                  </span>
                  <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, rgba(0,194,255,0.3), transparent)" }} />
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <QuickAction icon={Plus} title="Nueva cotización" desc="Solicita un presupuesto para tu proyecto" color="#0066FF" onClick={() => navigate("/#soluciones")} />
                  <QuickAction icon={MessageSquare} title="Contactar soporte" desc="Escríbenos por WhatsApp" color="#22C55E" onClick={() => window.open("https://wa.me/message/KYXYN7UEKJM6N1", "_blank")} />
                  <QuickAction icon={Settings} title="Mis datos" desc="Actualiza tu información personal" color="#7C3AED" onClick={() => setActiveTab("account")} />
                </div>
              </div>

              {/* Últimas solicitudes */}
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <Activity size={14} style={{ color: "#00C2FF" }} />
                  <span className="text-[10px] tracking-[0.25em] uppercase" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#00C2FF" }}>
                    ÚLTIMAS SOLICITUDES
                  </span>
                  <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, rgba(0,194,255,0.3), transparent)" }} />
                  {!loading && leads.length > 0 && (
                    <button
                      onClick={() => setActiveTab("quotes")}
                      className="text-[10px] tracking-widest uppercase font-semibold transition-colors hover:text-white"
                      style={{ fontFamily: "'JetBrains Mono', monospace", color: "#0066FF" }}
                    >
                      VER TODAS →
                    </button>
                  )}
                </div>

                {loading ? (
                  <LoadingState />
                ) : leads.length === 0 ? (
                  <EmptyState
                    title="Aún no tienes solicitudes"
                    desc="Cuando pidas una cotización, aparecerá aquí."
                    ctaLabel="Hacer mi primera cotización"
                    onCta={() => navigate("/#soluciones")}
                  />
                ) : (
                  <div className="space-y-3">
                    {leads.slice(0, 3).map((l, i) => (
                      <LeadCard key={l.id} lead={l} onView={() => setSelectedLead(l)} index={i} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ────── TAB: QUOTES ────── */}
          {activeTab === "quotes" && (
            <div className="space-y-8">
              <div className="flex items-center gap-3 mb-2">
                <FileText size={14} style={{ color: "#00C2FF" }} />
                <span className="text-[10px] tracking-[0.25em] uppercase" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#00C2FF" }}>
                  HISTORIAL COMPLETO
                </span>
              </div>

              <div>
                <h2 className="text-3xl md:text-4xl font-extrabold mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Mis cotizaciones
                </h2>
                <p className="text-base" style={{ color: "#8B94A8" }}>
                  Todas tus solicitudes en un solo lugar.
                </p>
              </div>

              {loading ? (
                <LoadingState />
              ) : leads.length === 0 ? (
                <EmptyState
                  title="No hay cotizaciones todavía"
                  desc="Cuando pidas una, aparecerá acá con todos los detalles."
                  ctaLabel="Solicitar cotización"
                  onCta={() => navigate("/#soluciones")}
                />
              ) : (
                <div className="space-y-3">
                  {leads.map((l, i) => (
                    <LeadCard key={l.id} lead={l} onView={() => setSelectedLead(l)} index={i} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ────── TAB: ACCOUNT ────── */}
          {activeTab === "account" && (
            <div className="space-y-8">
              <div className="flex items-center gap-3 mb-2">
                <User size={14} style={{ color: "#00C2FF" }} />
                <span className="text-[10px] tracking-[0.25em] uppercase" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#00C2FF" }}>
                  PERFIL DE USUARIO
                </span>
              </div>

              <div>
                <h2 className="text-3xl md:text-4xl font-extrabold mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Mi cuenta
                </h2>
                <p className="text-base" style={{ color: "#8B94A8" }}>
                  Información personal asociada a tu cuenta.
                </p>
              </div>

              <div className="max-w-2xl space-y-4">
                <InfoField icon={User} label="Nombre completo" value={profile?.full_name || "—"} />
                <InfoField icon={Mail} label="Email" value={user.email || "—"} />
                <InfoField icon={Phone} label="Teléfono" value={profile?.phone || "—"} />
                <InfoField icon={Building2} label="Empresa" value={profile?.company || "—"} />
                <InfoField icon={Calendar} label="Cliente desde" value={new Date(user.created_at).toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" })} />

                <div
                  className="p-5 rounded-2xl border relative overflow-hidden"
                  style={{ background: "rgba(0,102,255,0.05)", borderColor: "rgba(0,102,255,0.2)" }}
                >
                  <span className="absolute top-2 left-2 w-3 h-3 pointer-events-none" style={{ borderTop: "1.5px solid #00C2FF", borderLeft: "1.5px solid #00C2FF" }} />
                  <span className="absolute bottom-2 right-2 w-3 h-3 pointer-events-none" style={{ borderBottom: "1.5px solid #00C2FF", borderRight: "1.5px solid #00C2FF" }} />

                  <p className="text-sm mb-3" style={{ color: "#C4CCDB" }}>
                    ¿Necesitas actualizar tus datos? Escríbenos y te ayudamos.
                  </p>
                  <a
                    href="mailto:contacto@alzova.systems"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all hover:-translate-y-0.5"
                    style={{
                      background: "linear-gradient(135deg, #0066FF 0%, #0052CC 100%)",
                      color: "#FFFFFF",
                      boxShadow: "0 8px 24px rgba(0,102,255,0.35)",
                    }}
                  >
                    <Mail size={14} />
                    Contactar soporte
                  </a>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modal detalle */}
      {selectedLead && (
        <LeadDetailModal lead={selectedLead} onClose={() => setSelectedLead(null)} />
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   SUBCOMPONENTES
   ══════════════════════════════════════════════════════════ */

function LoadingState() {
  return (
    <div className="text-center py-20 rounded-2xl border" style={{ background: "rgba(255,255,255,0.01)", borderColor: "rgba(255,255,255,0.06)" }}>
      <div className="relative w-14 h-14 mx-auto mb-4">
        <div className="absolute inset-0 rounded-full border-2 border-[#0066FF]/20" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#00C2FF] animate-spin" />
      </div>
      <div className="text-xs tracking-widest" style={{ color: "#8B94A8", fontFamily: "'JetBrains Mono', monospace" }}>
        CARGANDO DATOS...
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: string | number; color: string }) {
  return (
    <div
      className="group relative p-5 rounded-2xl border overflow-hidden transition-all duration-500 hover:-translate-y-1"
      style={{
        background: "linear-gradient(145deg, rgba(10,26,47,0.5), rgba(11,11,11,0.5))",
        borderColor: "rgba(255,255,255,0.06)",
      }}
    >
      {/* Glow hover */}
      <div
        className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(400px circle at 50% 0%, ${color}15, transparent 60%)` }}
      />

      {/* Corner bracket */}
      <span
        className="absolute top-2 right-2 w-3 h-3 transition-opacity duration-300"
        style={{ borderTop: `1.5px solid ${color}`, borderRight: `1.5px solid ${color}`, opacity: 0.4 }}
      />

      <div className="relative">
        <div className="flex items-center gap-2 mb-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-transform duration-500 group-hover:scale-110"
            style={{ background: `${color}15`, border: `1px solid ${color}40`, boxShadow: `0 0 12px ${color}20` }}
          >
            <Icon size={14} style={{ color }} />
          </div>
          <span className="text-[10px] tracking-widest uppercase" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#4A5568" }}>
            {label}
          </span>
        </div>
        <div className="text-2xl md:text-3xl font-black tracking-tight" style={{ fontFamily: "'Poppins', sans-serif" }}>
          {value}
        </div>
      </div>
    </div>
  );
}

function QuickAction({ icon: Icon, title, desc, color, onClick }: { icon: any; title: string; desc: string; color: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group relative text-left p-5 rounded-2xl border overflow-hidden transition-all duration-500 hover:-translate-y-1"
      style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.06)" }}
    >
      {/* Glow */}
      <div
        className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(300px circle at 50% 0%, ${color}18, transparent 60%)` }}
      />

      {/* Corner bracket */}
      <span
        className="absolute top-2 right-2 w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ borderTop: `1.5px solid ${color}`, borderRight: `1.5px solid ${color}` }}
      />

      <div className="relative">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-[-6deg]"
          style={{
            background: `${color}15`,
            border: `1px solid ${color}40`,
            boxShadow: `0 0 20px ${color}25`,
          }}
        >
          <Icon size={16} style={{ color }} />
        </div>
        <div className="text-sm font-bold mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
          {title}
        </div>
        <div className="text-xs" style={{ color: "#8B94A8" }}>{desc}</div>
      </div>
    </button>
  );
}

function LeadCard({ lead, onView, index = 0 }: { lead: Lead; onView: () => void; index?: number }) {
  const s = statusConfig[lead.status] || statusConfig.new;
  const StatusIcon = s.icon;
  const src = sourceLabels[lead.source] || sourceLabels.cotizador;
  const total = lead.metadata?.total ? Number(lead.metadata.total) : 0;
  const hasProposal = !!lead.metadata?.project_type;
  const fmt = (n: number) => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const days = Math.floor(diff / 86400000);
    if (days < 1) return "hoy";
    if (days === 1) return "ayer";
    if (days < 30) return `hace ${days}d`;
    return new Date(date).toLocaleDateString("es-CO", { day: "numeric", month: "short" });
  };

  return (
    <button
      onClick={onView}
      className="group w-full text-left p-5 rounded-2xl border transition-all duration-500 hover:-translate-y-1 relative overflow-hidden animate-fade-slide-in"
      style={{
        background: "linear-gradient(145deg, rgba(10,26,47,0.4), rgba(11,11,11,0.4))",
        borderColor: hasProposal ? "rgba(34,197,94,0.2)" : "rgba(255,255,255,0.06)",
        animationDelay: `${index * 80}ms`,
      }}
    >
      {/* Glow hover */}
      <div
        className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(400px circle at 0% 50%, ${src.color}12, transparent 50%)` }}
      />

      {/* Barra lateral */}
      <span
        className="absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full transition-all duration-300"
        style={{ background: src.color, opacity: 0.3, boxShadow: `0 0 12px ${src.color}` }}
      />

      <div className="relative flex items-center gap-4 flex-wrap">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase"
              style={{
                background: `${src.color}15`,
                border: `1px solid ${src.color}40`,
                color: src.color,
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              {src.emoji} {src.label}
            </span>
          </div>
          <div className="text-base font-bold mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
            {lead.metadata?.project_type_label || lead.message?.slice(0, 50) || "Solicitud"}
          </div>
          <div className="flex items-center gap-3 text-xs" style={{ color: "#8B94A8", fontFamily: "'JetBrains Mono', monospace" }}>
            <span>{timeAgo(lead.created_at)}</span>
          </div>

          {/* Hint verde de descarga PDF */}
          {hasProposal && (
            <div
              className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold"
              style={{
                background: "rgba(34,197,94,0.1)",
                border: "1px solid rgba(34,197,94,0.35)",
                color: "#22C55E",
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              <span
                className="w-1 h-1 rounded-full animate-pulse"
                style={{ background: "#22C55E", boxShadow: "0 0 6px #22C55E" }}
              />
              📄 ¡Descarga esta propuesta en PDF!
            </div>
          )}
        </div>

        {total > 0 && (
          <div className="text-lg font-bold" style={{ color: "#00C2FF", fontFamily: "'JetBrains Mono', monospace" }}>
            {fmt(total)}
          </div>
        )}

        <span
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase"
          style={{
            background: `${s.color}15`,
            border: `1px solid ${s.color}40`,
            color: s.color,
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          <StatusIcon size={10} />
          {s.label}
        </span>

        <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:bg-[#0066FF]/10" style={{ color: "#8B94A8" }}>
          <Eye size={16} />
        </div>
      </div>
    </button>
  );
}

function EmptyState({ title, desc, ctaLabel, onCta }: { title: string; desc: string; ctaLabel: string; onCta: () => void }) {
  return (
    <div
      className="relative text-center py-16 rounded-2xl border overflow-hidden"
      style={{ background: "rgba(255,255,255,0.01)", borderColor: "rgba(255,255,255,0.06)" }}
    >
      <span className="absolute top-3 left-3 w-4 h-4" style={{ borderTop: "1.5px solid #00C2FF60", borderLeft: "1.5px solid #00C2FF60" }} />
      <span className="absolute bottom-3 right-3 w-4 h-4" style={{ borderBottom: "1.5px solid #00C2FF60", borderRight: "1.5px solid #00C2FF60" }} />

      <div className="text-5xl mb-4 opacity-60">📭</div>
      <div className="text-lg font-bold mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>{title}</div>
      <div className="text-sm mb-6" style={{ color: "#8B94A8" }}>{desc}</div>
      <button
        onClick={onCta}
        className="neon-btn inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm text-white"
        style={{
          background: "linear-gradient(135deg, #0066FF 0%, #0052CC 100%)",
          border: "1px solid rgba(0,194,255,0.5)",
          fontFamily: "'Poppins', sans-serif",
          cursor: "pointer",
        }}
      >
        <Plus size={14} className="relative z-10" />
        <span className="relative z-10">{ctaLabel}</span>
      </button>
    </div>
  );
}

function InfoField({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div
      className="flex items-start gap-3 p-4 rounded-xl border transition-all duration-300 hover:border-[#0066FF]/30"
      style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.06)" }}
    >
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: "rgba(0,102,255,0.1)", border: "1px solid rgba(0,102,255,0.25)" }}
      >
        <Icon size={14} style={{ color: "#0066FF" }} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[10px] tracking-widest uppercase mb-0.5" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#8B94A8" }}>
          {label}
        </div>
        <div className="text-sm font-medium truncate" style={{ color: "#FFFFFF" }}>{value}</div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MODAL DE DETALLE
   ══════════════════════════════════════════════════════════ */
function LeadDetailModal({ lead, onClose }: { lead: Lead; onClose: () => void }) {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

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

  const s = statusConfig[lead.status] || statusConfig.new;
  const StatusIcon = s.icon;
  const src = sourceLabels[lead.source] || sourceLabels.cotizador;
  const fmt = (n: number) =>
    new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);
  const meta = lead.metadata || {};

  const handleDownloadPDF = () => {
    if (!meta.project_type) {
      alert("Esta solicitud no tiene datos de proyecto para generar propuesta");
      return;
    }

    generateProposal({
      clientName: lead.name || "Cliente",
      clientEmail: lead.email || "",
      clientPhone: lead.phone || "",
      clientCompany: lead.company || undefined,
      projectType: meta.project_type,
      projectTypeLabel: meta.project_type_label || meta.project_type,
      basePrice: Number(meta.base_price || 0),
      modules: Array.isArray(meta.modules) ? meta.modules : [],
      modulesPrice: Number(meta.modules_price || 0),
      extras: Array.isArray(meta.extras) ? meta.extras : [],
      extrasPrice: Number(meta.extras_price || 0),
      total: Number(meta.total || 0),
      proposalNumber: generateProposalNumber(lead.id),
      createdAt: new Date(lead.created_at),
    });
  };

  const handleSendEmail = async () => {
    if (!lead.email) {
      alert("Este lead no tiene email registrado");
      return;
    }

    if (!meta.project_type) {
      alert("Esta solicitud no tiene datos de proyecto para generar propuesta");
      return;
    }

    setSending(true);

    try {
      const proposalData = {
        clientName: lead.name || "Cliente",
        clientEmail: lead.email,
        clientPhone: lead.phone || "",
        clientCompany: lead.company || undefined,
        projectType: meta.project_type,
        projectTypeLabel: meta.project_type_label || meta.project_type,
        basePrice: Number(meta.base_price || 0),
        modules: Array.isArray(meta.modules) ? meta.modules : [],
        modulesPrice: Number(meta.modules_price || 0),
        extras: Array.isArray(meta.extras) ? meta.extras : [],
        extrasPrice: Number(meta.extras_price || 0),
        total: Number(meta.total || 0),
        proposalNumber: generateProposalNumber(lead.id),
        createdAt: new Date(lead.created_at),
      };

      const { base64, fileName } = generateProposalBase64(proposalData);

      const response = await fetch("/api/send-proposal-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: lead.email,
          clientName: proposalData.clientName,
          projectLabel: proposalData.projectTypeLabel,
          total: proposalData.total,
          pdfBase64: base64,
          fileName,
          proposalNumber: proposalData.proposalNumber,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error HTTP ${response.status}`);
      }

      setSent(true);
      setTimeout(() => setSent(false), 4000);
    } catch (err) {
      console.error("Error enviando propuesta:", err);
      alert("No pudimos enviar la propuesta. Intenta de nuevo.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 md:p-6" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/85 backdrop-blur-md" onClick={onClose} />

      <div
        className="relative w-full max-w-2xl max-h-[92vh] rounded-3xl overflow-hidden flex flex-col animate-slide-up"
        style={{
          background: "linear-gradient(145deg, #0A1A2F 0%, #0B0F1A 100%)",
          border: `1px solid ${src.color}50`,
          boxShadow: `0 40px 120px -20px ${src.color}60`,
        }}
      >
        {/* Header */}
        <div
          className="relative px-6 py-5 border-b flex items-center justify-between flex-shrink-0"
          style={{ borderColor: "rgba(255,255,255,0.06)", background: `${src.color}08` }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
              style={{ background: `${src.color}20`, border: `1px solid ${src.color}50`, boxShadow: `0 0 24px ${src.color}30` }}
            >
              {src.emoji}
            </div>
            <div>
              <div className="text-lg font-bold" style={{ fontFamily: "'Poppins', sans-serif" }}>
                {meta.project_type_label || src.label}
              </div>
              <div className="text-xs" style={{ color: "#8B94A8", fontFamily: "'JetBrains Mono', monospace" }}>
                {new Date(lead.created_at).toLocaleString("es-CO")}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/5" aria-label="Cerrar">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Estado */}
          <div>
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase"
              style={{ background: `${s.color}15`, border: `1px solid ${s.color}40`, color: s.color, fontFamily: "'JetBrains Mono', monospace" }}
            >
              <StatusIcon size={12} />
              {s.label}
            </span>
          </div>

          {/* Mensaje */}
          {lead.message && (
            <div>
              <div className="text-[10px] tracking-widest uppercase mb-2" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#00C2FF" }}>
                // MENSAJE
              </div>
              <div className="p-4 rounded-xl border" style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.06)" }}>
                <p className="text-sm leading-relaxed" style={{ color: "#C4CCDB" }}>{lead.message}</p>
              </div>
            </div>
          )}

          {/* Proyecto */}
          {meta.project_type && (
            <>
              <div>
                <div className="text-[10px] tracking-widest uppercase mb-2" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#00C2FF" }}>
                  // PROYECTO
                </div>
                <div
                  className="p-4 rounded-xl border flex items-start justify-between gap-3"
                  style={{ background: "rgba(0,102,255,0.08)", borderColor: "rgba(0,102,255,0.25)" }}
                >
                  <div className="text-base font-bold" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    {meta.project_type_label || meta.project_type}
                  </div>
                  <div className="text-base font-bold flex-shrink-0" style={{ color: "#00C2FF", fontFamily: "'JetBrains Mono', monospace" }}>
                    {fmt(Number(meta.base_price || 0))}
                  </div>
                </div>
              </div>

              {Array.isArray(meta.modules) && meta.modules.length > 0 && (
                <div>
                  <div className="text-[10px] tracking-widest uppercase mb-2" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#00C2FF" }}>
                    // MÓDULOS ({meta.modules.length})
                  </div>
                  <div className="space-y-1.5">
                    {meta.modules.map((m: any, i: number) => (
                      <div key={i} className="flex items-center justify-between text-sm py-2 px-3 rounded-lg" style={{ background: "rgba(255,255,255,0.02)" }}>
                        <span style={{ color: "#B8C0D0" }}>{m.label}</span>
                        <span style={{ color: "#00C2FF", fontFamily: "'JetBrains Mono', monospace" }}>+{fmt(m.price)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {Array.isArray(meta.extras) && meta.extras.length > 0 && (
                <div>
                  <div className="text-[10px] tracking-widest uppercase mb-2" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#00C2FF" }}>
                    // EXTRAS ({meta.extras.length})
                  </div>
                  <div className="space-y-1.5">
                    {meta.extras.map((e: any, i: number) => (
                      <div key={i} className="flex items-center justify-between text-sm py-2 px-3 rounded-lg" style={{ background: "rgba(255,255,255,0.02)" }}>
                        <span style={{ color: "#B8C0D0" }}>{e.label}</span>
                        <span style={{ color: "#00C2FF", fontFamily: "'JetBrains Mono', monospace" }}>+{fmt(e.price)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div
                className="p-5 rounded-xl border text-center relative overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, rgba(0,102,255,0.12), rgba(0,194,255,0.06))",
                  borderColor: "rgba(0,102,255,0.3)",
                }}
              >
                <span className="absolute top-2 left-2 w-3 h-3" style={{ borderTop: "1.5px solid #00C2FF", borderLeft: "1.5px solid #00C2FF" }} />
                <span className="absolute bottom-2 right-2 w-3 h-3" style={{ borderBottom: "1.5px solid #00C2FF", borderRight: "1.5px solid #00C2FF" }} />

                <div className="text-[10px] tracking-widest uppercase mb-1" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#8B94A8" }}>
                  TOTAL ESTIMADO
                </div>
                <div className="text-3xl md:text-4xl font-black gradient-text" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  {fmt(Number(meta.total || 0))}
                </div>
              </div>
            </>
          )}

          {/* Nota */}
          <div className="p-4 rounded-xl border-l-4" style={{ background: "rgba(0,102,255,0.05)", borderLeftColor: "#0066FF" }}>
            <p className="text-xs leading-relaxed" style={{ color: "#8B94A8" }}>
              ¿Tienes dudas sobre esta solicitud? Contáctanos por WhatsApp y te responderemos en menos de 1 hora.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t flex flex-col gap-3 flex-shrink-0" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          {meta.project_type && (
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleDownloadPDF}
                className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white text-sm transition-all hover:-translate-y-0.5"
                style={{
                  background: "linear-gradient(135deg, #0066FF 0%, #0052CC 100%)",
                  boxShadow: "0 8px 24px rgba(0,102,255,0.4)",
                  cursor: "pointer",
                  border: "none",
                }}
              >
                <Download size={16} />
                Descargar
              </button>

              <button
                onClick={handleSendEmail}
                disabled={sending || sent}
                className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white text-sm transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed"
                style={{
                  background: sent
                    ? "linear-gradient(135deg, #22C55E 0%, #16A34A 100%)"
                    : "linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)",
                  boxShadow: sent
                    ? "0 8px 24px rgba(34,197,94,0.4)"
                    : "0 8px 24px rgba(124,58,237,0.4)",
                  cursor: sending || sent ? "not-allowed" : "pointer",
                  border: "none",
                  opacity: sending ? 0.7 : 1,
                }}
              >
                {sending ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Enviando...
                  </>
                ) : sent ? (
                  <>
                    <CheckCircle2 size={16} />
                    ¡Enviado!
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Enviar por email
                  </>
                )}
              </button>
            </div>
          )}

          <a
            href="https://wa.me/message/KYXYN7UEKJM6N1"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white text-sm transition-all hover:-translate-y-0.5"
            style={{ background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)" }}
          >
            💬 Consultar por WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}