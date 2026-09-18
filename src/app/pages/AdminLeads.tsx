import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, Search, RefreshCw, Eye, X, Mail, Phone,
  Building2, Calendar, DollarSign, Package, TrendingUp,
  Clock, CheckCircle2, XCircle, AlertCircle, Trash2,
} from "lucide-react";
import { supabase } from "../lib/supabase";

/* ══════════════════════════════════════════════════════════
   TIPOS
   ══════════════════════════════════════════════════════════ */
type LeadStatus = "new" | "contacted" | "converted" | "lost";
type LeadSource = "cotizador" | "auditoria" | "servicio_tecnico" | "contacto" | "newsletter" | "producto";
type FilterStatus = "all" | LeadStatus;
type FilterSource = "all" | LeadSource;

interface Lead {
  id: string;
  user_id: string | null;
  source: LeadSource;
  name: string | null;
  email: string | null;
  phone: string | null;
  company: string | null;
  message: string | null;
  metadata: Record<string, any>;
  status: LeadStatus;
  notes: string | null;
  created_at: string;
}

/* ══════════════════════════════════════════════════════════
   CONFIGURACIÓN
   ══════════════════════════════════════════════════════════ */
const statusConfig: Record<LeadStatus, { label: string; color: string; icon: any }> = {
  new:       { label: "Nuevo",      color: "#00C2FF", icon: AlertCircle },
  contacted: { label: "Contactado", color: "#F59E0B", icon: Clock },
  converted: { label: "Convertido", color: "#22C55E", icon: CheckCircle2 },
  lost:      { label: "Perdido",    color: "#EF4444", icon: XCircle },
};

const sourceConfig: Record<LeadSource, { label: string; emoji: string; color: string }> = {
  cotizador:        { label: "Cotizador",     emoji: "💼", color: "#0066FF" },
  auditoria:        { label: "Auditoría",     emoji: "🔍", color: "#00C2FF" },
  servicio_tecnico: { label: "Servicio téc.", emoji: "🛠️", color: "#7C3AED" },
  contacto:         { label: "Contacto",      emoji: "💬", color: "#22C55E" },
  newsletter:       { label: "Newsletter",    emoji: "📧", color: "#F59E0B" },
  producto:         { label: "Producto",      emoji: "📦", color: "#EC4899" },
};

/* ══════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
   ══════════════════════════════════════════════════════════ */
export function AdminLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [filterSource, setFilterSource] = useState<FilterSource>("all");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const fetchLeads = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) setLeads(data as Lead[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const updateStatus = async (id: string, newStatus: LeadStatus) => {
    const { error } = await supabase
      .from("leads")
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (!error) {
      setLeads((prev) =>
        prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l))
      );
      if (selectedLead?.id === id) {
        setSelectedLead({ ...selectedLead, status: newStatus });
      }
    }
  };

  const deleteLead = async (id: string) => {
    if (!confirm("¿Eliminar este lead definitivamente?")) return;
    const { error } = await supabase.from("leads").delete().eq("id", id);
    if (!error) {
      setLeads((prev) => prev.filter((l) => l.id !== id));
      setSelectedLead(null);
    }
  };

  const fmt = (n: number) =>
    new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "ahora";
    if (mins < 60) return `hace ${mins} min`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `hace ${hrs}h`;
    const days = Math.floor(hrs / 24);
    if (days < 30) return `hace ${days}d`;
    return new Date(date).toLocaleDateString("es-CO", { day: "numeric", month: "short" });
  };

  const getTotal = (lead: Lead): number => {
    return Number(lead.metadata?.total || 0);
  };

  const filtered = leads.filter((l) => {
    const matchesStatus = filterStatus === "all" || l.status === filterStatus;
    const matchesSource = filterSource === "all" || l.source === filterSource;
    const searchLower = search.toLowerCase();
    const matchesSearch =
      !search ||
      l.name?.toLowerCase().includes(searchLower) ||
      l.email?.toLowerCase().includes(searchLower) ||
      l.phone?.includes(search) ||
      l.company?.toLowerCase().includes(searchLower);
    return matchesStatus && matchesSource && matchesSearch;
  });

  const stats = {
    total: leads.length,
    new: leads.filter((l) => l.status === "new").length,
    revenue: leads.filter((l) => l.status === "converted").reduce((s, l) => s + getTotal(l), 0),
    pipelineValue: leads.filter((l) => l.status === "new" || l.status === "contacted").reduce((s, l) => s + getTotal(l), 0),
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b backdrop-blur-xl" style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(11,11,11,0.85)" }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link to="/" className="w-10 h-10 rounded-lg flex items-center justify-center border transition-colors hover:bg-white/5" style={{ borderColor: "rgba(255,255,255,0.1)", color: "#B8C0D0" }}>
              <ArrowLeft size={18} />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] tracking-widest uppercase" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#00C2FF" }}>ALZOVA.ADMIN</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
              </div>
              <h1 className="text-lg md:text-xl font-bold" style={{ fontFamily: "'Poppins', sans-serif" }}>Panel de Leads</h1>
            </div>
          </div>

          <button onClick={fetchLeads} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors hover:bg-white/5" style={{ borderColor: "rgba(255,255,255,0.1)", color: "#B8C0D0" }}>
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            <span className="hidden md:inline">Actualizar</span>
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard icon={Package} label="Total leads" value={stats.total} color="#0066FF" />
          <StatCard icon={AlertCircle} label="Nuevos" value={stats.new} color="#00C2FF" />
          <StatCard icon={TrendingUp} label="Pipeline" value={fmt(stats.pipelineValue)} color="#F59E0B" />
          <StatCard icon={DollarSign} label="Convertido" value={fmt(stats.revenue)} color="#22C55E" />
        </div>

        {/* Búsqueda */}
        <div className="relative mb-4">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#8B94A8" }} />
          <input
            type="text"
            placeholder="Buscar por nombre, email, teléfono o empresa..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl border text-sm focus:outline-none focus:border-[#0066FF]"
            style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.08)", color: "#FFFFFF" }}
          />
        </div>

        {/* Filtros por source */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-3">
          <FilterPill active={filterSource === "all"} onClick={() => setFilterSource("all")} label="Todas las fuentes" count={leads.length} />
          {(Object.keys(sourceConfig) as LeadSource[]).map((s) => {
            const count = leads.filter((l) => l.source === s).length;
            if (count === 0) return null;
            return (
              <FilterPill
                key={s}
                active={filterSource === s}
                onClick={() => setFilterSource(s)}
                label={`${sourceConfig[s].emoji} ${sourceConfig[s].label}`}
                count={count}
                color={sourceConfig[s].color}
              />
            );
          })}
        </div>

        {/* Filtros por status */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
          <FilterPill active={filterStatus === "all"} onClick={() => setFilterStatus("all")} label="Todos" count={leads.length} />
          {(Object.keys(statusConfig) as LeadStatus[]).map((s) => (
            <FilterPill
              key={s}
              active={filterStatus === s}
              onClick={() => setFilterStatus(s)}
              label={statusConfig[s].label}
              count={leads.filter((l) => l.status === s).length}
              color={statusConfig[s].color}
            />
          ))}
        </div>

        {/* Tabla */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-12 h-12 rounded-full border-4 border-[#0066FF] border-t-transparent animate-spin mx-auto mb-4" />
            <div className="text-sm" style={{ color: "#8B94A8", fontFamily: "'JetBrains Mono', monospace" }}>Cargando leads...</div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 rounded-2xl border" style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.06)" }}>
            <div className="text-4xl mb-4">📭</div>
            <div className="text-lg font-semibold mb-1">No hay leads</div>
            <div className="text-sm" style={{ color: "#8B94A8" }}>
              {search || filterStatus !== "all" || filterSource !== "all" ? "Prueba ajustando los filtros" : "Los leads nuevos aparecerán aquí"}
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            {filtered.map((l) => {
              const s = statusConfig[l.status] || statusConfig.new;
              const StatusIcon = s.icon;
              const src = sourceConfig[l.source] || sourceConfig.cotizador;
              const total = getTotal(l);

              return (
                <div
                  key={l.id}
                  className="grid grid-cols-1 lg:grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-3 lg:gap-4 px-5 py-4 border-b last:border-b-0 items-center transition-colors hover:bg-white/[0.02] cursor-pointer"
                  style={{ borderColor: "rgba(255,255,255,0.04)" }}
                  onClick={() => setSelectedLead(l)}
                >
                  {/* Cliente */}
                  <div className="min-w-0 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold" style={{ background: "linear-gradient(135deg, #0066FF, #00C2FF)", color: "#FFFFFF" }}>
                      {l.name?.charAt(0).toUpperCase() || "?"}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold truncate">{l.name || "Sin nombre"}</div>
                      <div className="text-xs truncate" style={{ color: "#8B94A8" }}>{l.email}</div>
                    </div>
                  </div>

                  {/* Source */}
                  <div>
                    <span
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase"
                      style={{
                        background: `${src.color}15`,
                        border: `1px solid ${src.color}40`,
                        color: src.color,
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                    >
                      <span>{src.emoji}</span>
                      {src.label}
                    </span>
                  </div>

                  {/* Total */}
                  <div className="text-base font-bold" style={{ color: "#00C2FF", fontFamily: "'JetBrains Mono', monospace" }}>
                    {total > 0 ? fmt(total) : "—"}
                  </div>

                  {/* Estado */}
                  <div>
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
                  </div>

                  {/* Fecha */}
                  <div className="text-xs" style={{ color: "#8B94A8", fontFamily: "'JetBrains Mono', monospace" }}>
                    {timeAgo(l.created_at)}
                  </div>

                  {/* Detalle */}
                  <div className="hidden lg:flex w-8 h-8 items-center justify-center rounded-lg" style={{ color: "#8B94A8" }}>
                    <Eye size={16} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal detalle */}
      {selectedLead && (
        <LeadDetailModal
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onUpdateStatus={updateStatus}
          onDelete={deleteLead}
        />
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   COMPONENTES AUXILIARES
   ══════════════════════════════════════════════════════════ */
function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: string | number; color: string }) {
  return (
    <div className="p-5 rounded-2xl border" style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.06)" }}>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}15`, border: `1px solid ${color}40` }}>
          <Icon size={14} style={{ color }} />
        </div>
        <span className="text-[10px] tracking-widest uppercase" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#8B94A8" }}>{label}</span>
      </div>
      <div className="text-2xl font-bold" style={{ fontFamily: "'Poppins', sans-serif" }}>{value}</div>
    </div>
  );
}

function FilterPill({ active, onClick, label, count, color = "#0066FF" }: { active: boolean; onClick: () => void; label: string; count: number; color?: string }) {
  return (
    <button
      onClick={onClick}
      className="px-3.5 py-2 rounded-lg border text-xs font-medium transition-all whitespace-nowrap"
      style={{
        background: active ? `${color}15` : "rgba(255,255,255,0.02)",
        borderColor: active ? `${color}50` : "rgba(255,255,255,0.08)",
        color: active ? color : "#B8C0D0",
        fontFamily: "'JetBrains Mono', monospace",
      }}
    >
      {label} <span style={{ opacity: 0.7 }}>({count})</span>
    </button>
  );
}

function LeadDetailModal({
  lead,
  onClose,
  onUpdateStatus,
  onDelete,
}: {
  lead: Lead;
  onClose: () => void;
  onUpdateStatus: (id: string, status: LeadStatus) => void;
  onDelete: (id: string) => void;
}) {
  const fmt = (n: number) =>
    new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);

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

  const src = sourceConfig[lead.source] || sourceConfig.cotizador;
  const meta = lead.metadata || {};

  const waMessage = encodeURIComponent(
    `Hola ${lead.name?.split(" ")[0] || ""}! Recibimos tu solicitud en ALZOVA SYSTEMS. Te escribimos para coordinar los siguientes pasos.`
  );
  const waLink = lead.phone ? `https://wa.me/${lead.phone.replace(/\D/g, "")}?text=${waMessage}` : null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 md:p-6" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/85 backdrop-blur-md" onClick={onClose} />

      <div
        className="relative w-full max-w-2xl max-h-[92vh] rounded-3xl overflow-hidden flex flex-col animate-slide-up"
        style={{
          background: "linear-gradient(145deg, #0A1A2F 0%, #0B0F1A 100%)",
          border: `1px solid ${src.color}50`,
        }}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b flex items-center justify-between flex-shrink-0" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-base font-bold" style={{ background: "linear-gradient(135deg, #0066FF, #00C2FF)", color: "#FFFFFF" }}>
              {lead.name?.charAt(0).toUpperCase() || "?"}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <div className="text-lg font-bold" style={{ fontFamily: "'Poppins', sans-serif" }}>{lead.name || "Sin nombre"}</div>
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
          {/* Contacto */}
          <div>
            <div className="text-[10px] tracking-widest uppercase mb-3" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#00C2FF" }}>// Contacto</div>
            <div className="grid sm:grid-cols-2 gap-3">
              <InfoRow icon={Mail} label="Email" value={lead.email || "—"} />
              <InfoRow icon={Phone} label="Teléfono" value={lead.phone || "—"} />
              <InfoRow icon={Building2} label="Empresa" value={lead.company || "—"} />
              <InfoRow icon={Calendar} label="Fecha" value={new Date(lead.created_at).toLocaleDateString("es-CO")} />
            </div>
          </div>

          {/* Mensaje */}
          {lead.message && (
            <div>
              <div className="text-[10px] tracking-widest uppercase mb-3" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#00C2FF" }}>// Mensaje</div>
              <div className="p-4 rounded-xl border" style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.06)" }}>
                <p className="text-sm leading-relaxed" style={{ color: "#C4CCDB" }}>{lead.message}</p>
              </div>
            </div>
          )}

          {/* Metadata del cotizador */}
          {meta.project_type && (
            <>
              <div>
                <div className="text-[10px] tracking-widest uppercase mb-3" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#00C2FF" }}>// Proyecto</div>
                <div className="p-4 rounded-xl border flex items-start justify-between gap-3" style={{ background: "rgba(0,102,255,0.08)", borderColor: "rgba(0,102,255,0.25)" }}>
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
                  <div className="text-[10px] tracking-widest uppercase mb-3" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#00C2FF" }}>// Módulos ({meta.modules.length})</div>
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
                  <div className="text-[10px] tracking-widest uppercase mb-3" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#00C2FF" }}>// Extras ({meta.extras.length})</div>
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

              <div className="p-4 rounded-xl border text-center" style={{ background: "linear-gradient(135deg, rgba(0,102,255,0.12), rgba(0,194,255,0.06))", borderColor: "rgba(0,102,255,0.3)" }}>
                <div className="text-[10px] tracking-widest uppercase mb-1" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#8B94A8" }}>Total estimado</div>
                <div className="text-3xl font-extrabold gradient-text" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  {fmt(Number(meta.total || 0))}
                </div>
              </div>
            </>
          )}

          {/* Cambiar estado */}
          <div>
            <div className="text-[10px] tracking-widest uppercase mb-3" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#00C2FF" }}>// Cambiar estado</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(Object.keys(statusConfig) as LeadStatus[]).map((s) => {
                const cfg = statusConfig[s];
                const active = lead.status === s;
                const Icon = cfg.icon;
                return (
                  <button
                    key={s}
                    onClick={() => onUpdateStatus(lead.id, s)}
                    className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border text-xs font-semibold transition-all"
                    style={{
                      background: active ? `${cfg.color}20` : "rgba(255,255,255,0.02)",
                      borderColor: active ? `${cfg.color}60` : "rgba(255,255,255,0.08)",
                      color: active ? cfg.color : "#B8C0D0",
                    }}
                  >
                    <Icon size={12} />
                    {cfg.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Eliminar */}
          <button
            onClick={() => onDelete(lead.id)}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border text-xs font-semibold transition-colors hover:bg-red-500/5"
            style={{ borderColor: "rgba(239,68,68,0.3)", color: "#FCA5A5", background: "transparent", cursor: "pointer" }}
          >
            <Trash2 size={12} />
            Eliminar lead
          </button>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t flex flex-col sm:flex-row gap-3 flex-shrink-0" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          {waLink && (
            <a href={waLink} target="_blank" rel="noopener noreferrer" className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white text-sm" style={{ background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)" }}>
              💬 Responder por WhatsApp
            </a>
          )}
          {lead.email && (
            <a href={`mailto:${lead.email}?subject=${encodeURIComponent("Tu solicitud - ALZOVA SYSTEMS")}`} className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm border transition-colors hover:bg-white/5" style={{ borderColor: "rgba(255,255,255,0.12)", color: "#FFFFFF" }}>
              <Mail size={14} />
              Enviar email
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg" style={{ background: "rgba(255,255,255,0.02)" }}>
      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "rgba(0,102,255,0.1)", border: "1px solid rgba(0,102,255,0.25)" }}>
        <Icon size={14} style={{ color: "#0066FF" }} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[10px] tracking-widest uppercase mb-0.5" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#8B94A8" }}>{label}</div>
        <div className="text-sm font-medium truncate" style={{ color: "#FFFFFF" }}>{value}</div>
      </div>
    </div>
  );
}