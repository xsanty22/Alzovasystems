import { useState, useEffect, useMemo } from "react";
import { X, Check, ArrowRight, MessageCircle, Sparkles, User, Mail, Phone, Building2, Loader2, CheckCircle2 } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { projectTypes, modules, extras } from "../data/quote";
import { WHATSAPP_PHONE, CONTACT_EMAIL } from "../data/social";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../lib/supabase";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function QuoteCalculator({ open, onClose }: Props) {
  const { user, profile } = useAuth();
  const [projectType, setProjectType] = useState(projectTypes[1].id);
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [showContactForm, setShowContactForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Precarga con datos del usuario logueado
  useEffect(() => {
    if (!open) return;
    if (user) {
      setEmail(user.email || "");
      setName(profile?.full_name || (user.user_metadata?.full_name as string) || "");
      setPhone(profile?.phone || (user.user_metadata?.phone as string) || "");
      setCompany(profile?.company || (user.user_metadata?.company as string) || "");
    }
  }, [open, user, profile]);

  // Scroll lock
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = original; };
  }, [open]);

  // ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const toggleModule = (id: string) =>
    setSelectedModules((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const toggleExtra = (id: string) =>
    setSelectedExtras((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const basePrice = projectTypes.find((p) => p.id === projectType)?.price || 0;
  const modulesPrice = modules.filter((m) => selectedModules.includes(m.id)).reduce((s, m) => s + m.price, 0);
  const extrasPrice = extras.filter((e) => selectedExtras.includes(e.id)).reduce((s, e) => s + e.price, 0);
  const total = useMemo(() => basePrice + modulesPrice + extrasPrice, [basePrice, modulesPrice, extrasPrice]);

  const formatPrice = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

  const waMessage = useMemo(() => {
    const pt = projectTypes.find((p) => p.id === projectType);
    const modsList = modules.filter((m) => selectedModules.includes(m.id));
    const extsList = extras.filter((e) => selectedExtras.includes(e.id));

    let msg = "Hola ALZOVA SYSTEMS! Quiero cotizar un proyecto:\n\n";
    msg += `📌 Tipo: ${pt?.label} (${formatPrice(pt?.price || 0)})\n`;
    if (modsList.length) {
      msg += "\n🧩 Módulos:\n";
      modsList.forEach((m) => { msg += `  • ${m.label} — ${formatPrice(m.price)}\n`; });
    }
    if (extsList.length) {
      msg += "\n✨ Extras:\n";
      extsList.forEach((e) => { msg += `  • ${e.label} — ${formatPrice(e.price)}\n`; });
    }
    msg += `\n💰 TOTAL ESTIMADO: ${formatPrice(total)}\n`;
    if (name || email || phone) {
      msg += `\n📇 Contacto:\n`;
      if (name) msg += `  Nombre: ${name}\n`;
      if (email) msg += `  Email: ${email}\n`;
      if (phone) msg += `  Teléfono: ${phone}\n`;
      if (company) msg += `  Empresa: ${company}\n`;
    }
    msg += "\n¿Me pueden dar más información?";
    return msg;
  }, [projectType, selectedModules, selectedExtras, total, name, email, phone, company]);

  const waLink = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(waMessage)}`;
  const mailLink = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Cotización de software")}&body=${encodeURIComponent(waMessage)}`;

  const validateContact = () => {
    if (!name.trim()) return "El nombre es obligatorio";
    if (!email.trim() || !email.includes("@")) return "El email no es válido";
    if (!phone.trim() || phone.replace(/\D/g, "").length < 7) return "El teléfono no es válido";
    return null;
  };

  /* ══════════════════════════════════════════════════════════
     GUARDAR EN SUPABASE
     ══════════════════════════════════════════════════════════ */
  const saveQuote = async (): Promise<boolean> => {
    const err = validateContact();
    if (err) {
      alert(err);
      return false;
    }

    setSaving(true);
    try {
      const pt = projectTypes.find((p) => p.id === projectType);
      const modsList = modules.filter((m) => selectedModules.includes(m.id));
      const extsList = extras.filter((e) => selectedExtras.includes(e.id));

      const { error } = await supabase.from("quotes").insert({
        user_id: user?.id ?? null,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        company: company.trim() || null,
        project_type: projectType,
        project_type_label: pt?.label || "",
        base_price: basePrice,
        modules: modsList,
        modules_price: modulesPrice,
        extras: extsList,
        extras_price: extrasPrice,
        total,
        status: "new",
      });

      if (error) {
        console.error("Error guardando cotización:", error);
        alert("No pudimos guardar tu cotización. Intenta de nuevo.");
        setSaving(false);
        return false;
      }

      setSaving(false);
      setSaved(true);
      return true;
    } catch (e) {
      console.error(e);
      setSaving(false);
      return false;
    }
  };

  const handleWhatsApp = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const ok = await saveQuote();
    if (ok) {
      window.open(waLink, "_blank");
      setTimeout(() => {
        setSaved(false);
        onClose();
      }, 1500);
    }
  };

  const handleEmail = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const ok = await saveQuote();
    if (ok) {
      window.location.href = mailLink;
      setTimeout(() => {
        setSaved(false);
        onClose();
      }, 1500);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 md:p-6" role="dialog" aria-modal="true">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />

      {/* Panel */}
      <div
        className="relative w-full max-w-6xl max-h-[92vh] rounded-3xl overflow-hidden flex flex-col animate-slide-up"
        style={{
          background: "linear-gradient(145deg, #0A1A2F 0%, #0B0F1A 100%)",
          border: "1px solid rgba(0,102,255,0.25)",
          boxShadow: "0 40px 120px -20px rgba(0,102,255,0.4)",
        }}
      >
        {/* Header */}
        <div
          className="relative px-5 md:px-8 py-4 md:py-5 flex items-center justify-between border-b flex-shrink-0"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #0066FF 0%, #00C2FF 100%)" }}
            >
              <Sparkles size={18} className="text-white" />
            </div>
            <div>
              <div className="text-base md:text-lg font-bold" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Cotiza tu software
              </div>
              <div className="text-[10px] md:text-xs" style={{ color: "#8B94A8", fontFamily: "'JetBrains Mono', monospace" }}>
                Precio estimado en tiempo real
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/5 transition-colors"
            aria-label="Cerrar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 md:px-8 py-6 grid lg:grid-cols-[1fr_340px] gap-6 lg:gap-8">
          {/* Columna izquierda — opciones */}
          <div className="space-y-8">
            {/* Tipo de proyecto */}
            <div>
              <h3 className="text-xs md:text-sm tracking-[0.2em] uppercase mb-4" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#0066FF" }}>
                1 · Tipo de proyecto
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {projectTypes.map((p) => {
                  const active = projectType === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setProjectType(p.id)}
                      className="text-left p-4 rounded-2xl border transition-all duration-300"
                      style={{
                        background: active ? "rgba(0,102,255,0.12)" : "rgba(255,255,255,0.02)",
                        borderColor: active ? "rgba(0,102,255,0.5)" : "rgba(255,255,255,0.06)",
                        boxShadow: active ? "0 0 24px rgba(0,102,255,0.25)" : "none",
                      }}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <span className="font-semibold text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          {p.label}
                        </span>
                        <span className="text-xs font-bold flex-shrink-0" style={{ color: "#00C2FF", fontFamily: "'JetBrains Mono', monospace" }}>
                          {formatPrice(p.price)}
                        </span>
                      </div>
                      <p className="text-xs" style={{ color: "#8B94A8" }}>{p.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Módulos */}
            <div>
              <h3 className="text-xs md:text-sm tracking-[0.2em] uppercase mb-4" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#0066FF" }}>
                2 · Módulos {selectedModules.length > 0 && `(${selectedModules.length})`}
              </h3>
              <div className="grid sm:grid-cols-2 gap-2">
                {modules.map((m) => {
                  const checked = selectedModules.includes(m.id);
                  return (
                    <button
                      key={m.id}
                      onClick={() => toggleModule(m.id)}
                      className="flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-200"
                      style={{
                        background: checked ? "rgba(0,102,255,0.1)" : "rgba(255,255,255,0.02)",
                        borderColor: checked ? "rgba(0,102,255,0.4)" : "rgba(255,255,255,0.06)",
                      }}
                    >
                      <span
                        className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 transition-all"
                        style={{
                          background: checked ? "#0066FF" : "transparent",
                          border: checked ? "1px solid #0066FF" : "1px solid rgba(255,255,255,0.2)",
                        }}
                      >
                        {checked && <Check size={12} className="text-white" />}
                      </span>
                      <span className="flex-1 text-sm leading-tight">{m.label}</span>
                      <span className="text-[10px] md:text-xs font-semibold flex-shrink-0" style={{ color: "#00C2FF", fontFamily: "'JetBrains Mono', monospace" }}>
                        +{formatPrice(m.price)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Extras */}
            <div>
              <h3 className="text-xs md:text-sm tracking-[0.2em] uppercase mb-4" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#0066FF" }}>
                3 · Extras {selectedExtras.length > 0 && `(${selectedExtras.length})`}
              </h3>
              <div className="grid sm:grid-cols-2 gap-2">
                {extras.map((e) => {
                  const checked = selectedExtras.includes(e.id);
                  return (
                    <button
                      key={e.id}
                      onClick={() => toggleExtra(e.id)}
                      className="flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-200"
                      style={{
                        background: checked ? "rgba(0,194,255,0.08)" : "rgba(255,255,255,0.02)",
                        borderColor: checked ? "rgba(0,194,255,0.4)" : "rgba(255,255,255,0.06)",
                      }}
                    >
                      <span
                        className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 transition-all"
                        style={{
                          background: checked ? "#00C2FF" : "transparent",
                          border: checked ? "1px solid #00C2FF" : "1px solid rgba(255,255,255,0.2)",
                        }}
                      >
                        {checked && <Check size={12} className="text-white" />}
                      </span>
                      <span className="flex-1 text-sm leading-tight">{e.label}</span>
                      <span className="text-[10px] md:text-xs font-semibold flex-shrink-0" style={{ color: "#00C2FF", fontFamily: "'JetBrains Mono', monospace" }}>
                        +{formatPrice(e.price)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Columna derecha — resumen */}
          <aside className="lg:sticky lg:top-0 h-fit">
            <div className="rounded-2xl border p-5 md:p-6" style={{ background: "rgba(0,0,0,0.35)", borderColor: "rgba(0,102,255,0.3)" }}>
              <div className="text-xs tracking-widest uppercase mb-4" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#8B94A8" }}>
                Resumen
              </div>

              <div className="space-y-2 text-sm mb-5">
                <div className="flex justify-between">
                  <span style={{ color: "#8B94A8" }}>Base</span>
                  <span>{formatPrice(basePrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: "#8B94A8" }}>Módulos ({selectedModules.length})</span>
                  <span>{formatPrice(modulesPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: "#8B94A8" }}>Extras ({selectedExtras.length})</span>
                  <span>{formatPrice(extrasPrice)}</span>
                </div>
              </div>

              <div className="pt-5 border-t mb-6" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                <div className="text-xs tracking-widest uppercase mb-2" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#8B94A8" }}>
                  Total estimado
                </div>
                <div className="text-4xl font-extrabold gradient-text" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  {formatPrice(total)}
                </div>
                <div className="text-[11px] mt-2 leading-relaxed" style={{ color: "#8B94A8" }}>
                  * Precio orientativo. El valor final se define tras la reunión de descubrimiento.
                </div>
              </div>

              {/* ══════════ FORMULARIO DE CONTACTO ══════════ */}
              {showContactForm ? (
                <div className="space-y-3 mb-4">
                  <div className="text-xs tracking-widest uppercase mb-2" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#0066FF" }}>
                    Tus datos de contacto
                  </div>

                  <div className="relative">
                    <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#8B94A8" }} />
                    <input
                      type="text"
                      placeholder="Nombre completo *"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:border-[#0066FF]"
                      style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.1)", color: "#FFFFFF" }}
                    />
                  </div>

                  <div className="relative">
                    <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#8B94A8" }} />
                    <input
                      type="email"
                      placeholder="tu@email.com *"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:border-[#0066FF]"
                      style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.1)", color: "#FFFFFF" }}
                    />
                  </div>

                  <div className="relative">
                    <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#8B94A8" }} />
                    <input
                      type="tel"
                      placeholder="Teléfono / WhatsApp *"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:border-[#0066FF]"
                      style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.1)", color: "#FFFFFF" }}
                    />
                  </div>

                  <div className="relative">
                    <Building2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#8B94A8" }} />
                    <input
                      type="text"
                      placeholder="Empresa (opcional)"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:border-[#0066FF]"
                      style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.1)", color: "#FFFFFF" }}
                    />
                  </div>

                  <button
                    onClick={() => setShowContactForm(false)}
                    className="text-xs transition-colors hover:text-white"
                    style={{ color: "#8B94A8" }}
                  >
                    ← Volver a la configuración
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowContactForm(true)}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 mb-4"
                  style={{
                    background: "linear-gradient(135deg, #0066FF 0%, #0052CC 100%)",
                    boxShadow: "0 12px 32px rgba(0,102,255,0.35)",
                  }}
                >
                  Continuar
                  <ArrowRight size={16} />
                </button>
              )}

              {/* ══════════ BOTONES DE ENVÍO ══════════ */}
              {showContactForm && !saved && (
                <>
                  <button
                    onClick={handleWhatsApp}
                    disabled={saving}
                    className="group flex items-center justify-center gap-2 w-full py-4 rounded-xl font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{
                      background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)",
                      boxShadow: "0 12px 32px rgba(37,211,102,0.35)",
                    }}
                  >
                    {saving ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      <>
                        <FaWhatsapp size={18} />
                        Enviar por WhatsApp
                        <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleEmail}
                    disabled={saving}
                    className="mt-3 flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-medium border transition-colors hover:bg-white/5 disabled:opacity-60"
                    style={{ borderColor: "rgba(255,255,255,0.12)", color: "#FFFFFF", background: "transparent", cursor: saving ? "not-allowed" : "pointer" }}
                  >
                    <MessageCircle size={16} />
                    Enviar por email
                  </button>
                </>
              )}

              {/* Feedback guardado */}
              {saved && (
                <div
                  className="flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-semibold animate-slide-up"
                  style={{
                    background: "rgba(34,197,94,0.12)",
                    border: "1px solid rgba(34,197,94,0.3)",
                    color: "#86EFAC",
                  }}
                >
                  <CheckCircle2 size={18} />
                  ¡Cotización guardada!
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}