import { useState } from "react";
import { Star, Send, Loader2, Radio, X, MessageSquare, Sparkles, Lock } from "lucide-react";
import { Reveal } from "../ui/Reveal";
import { Badge } from "../ui/Badge";
import { useAuth } from "../../hooks/useAuth";
import { useReviews, type NewReview } from "../../hooks/useReviews";

interface Props {
  onOpenAuth: () => void;
}

export function ReviewsSection({ onOpenAuth }: Props) {
  const { user, profile } = useAuth();
  const { reviews, loading, addReview, liveCount } = useReviews();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<NewReview>({
    name: profile?.full_name || "",
    role: "",
    company: "",
    content: "",
    rating: 5,
  });
  const [hoverRating, setHoverRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.content.trim() || form.content.trim().length < 10) {
      setError("La reseña debe tener al menos 10 caracteres");
      return;
    }

    setSubmitting(true);
    const { error } = await addReview(form);
    setSubmitting(false);

    if (error) {
      setError(error);
    } else {
      setSuccess(true);
      setForm({ ...form, content: "", rating: 5 });
      setTimeout(() => {
        setSuccess(false);
        setShowForm(false);
      }, 2000);
    }
  };

  return (
    <section id="reviews" className="py-20 md:py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <Badge>Testimonios en vivo</Badge>
              <h2 className="mt-6 text-4xl md:text-5xl font-extrabold tracking-tight max-w-2xl" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Lo que dicen nuestros clientes
              </h2>
              <p className="mt-4 text-base max-w-xl" style={{ color: "#8B94A8" }}>
                Reseñas reales de personas que confiaron en ALZOVA. Los cambios se actualizan en tiempo real.
              </p>
            </div>

            <div className="flex items-center gap-3 self-start md:self-end">
              {/* Indicador en vivo */}
              <div
                className="flex items-center gap-2 px-3 py-2 rounded-full border"
                style={{ background: "rgba(34,197,94,0.08)", borderColor: "rgba(34,197,94,0.3)" }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" style={{ boxShadow: "0 0 8px #22C55E" }} />
                <span className="text-[10px] tracking-widest uppercase" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#22C55E" }}>
                  LIVE
                </span>
                {liveCount > 0 && (
                  <span
                    className="text-[10px] font-bold px-1.5 py-0.5 rounded-full animate-bounce-in"
                    style={{ background: "#22C55E", color: "#000" }}
                  >
                    +{liveCount}
                  </span>
                )}
              </div>

              {/* Botón para escribir */}
              {user ? (
                <button
                  onClick={() => setShowForm(!showForm)}
                  className="neon-btn inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-white text-sm"
                  style={{
                    background: "linear-gradient(135deg, #0066FF 0%, #0052CC 100%)",
                    border: "1px solid rgba(0,194,255,0.5)",
                    fontFamily: "'Poppins', sans-serif",
                    cursor: "pointer",
                  }}
                >
                  <MessageSquare size={14} className="relative z-10" />
                  <span className="relative z-10">{showForm ? "Cancelar" : "Escribir reseña"}</span>
                </button>
              ) : (
                <button
                  onClick={onOpenAuth}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm border transition-colors hover:bg-white/5"
                  style={{ borderColor: "rgba(255,255,255,0.12)", color: "#FFFFFF", cursor: "pointer" }}
                >
                  <Lock size={14} />
                  Inicia sesión para opinar
                </button>
              )}
            </div>
          </div>
        </Reveal>

        {/* Formulario */}
        {showForm && user && (
          <Reveal>
            <div
              className="mt-10 rounded-2xl border p-6 md:p-8 animate-slide-up relative overflow-hidden"
              style={{
                background: "linear-gradient(145deg, rgba(10,26,47,0.7), rgba(11,11,11,0.7))",
                borderColor: "rgba(0,102,255,0.3)",
              }}
            >
              <button
                onClick={() => setShowForm(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-white/60 hover:text-white hover:bg-white/5"
                aria-label="Cerrar"
              >
                <X size={16} />
              </button>

              <div className="flex items-center gap-2 mb-5">
                <Sparkles size={16} style={{ color: "#00C2FF" }} />
                <span className="text-xs tracking-widest uppercase" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#00C2FF" }}>
                  Nueva reseña
                </span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Rating con estrellas */}
                <div>
                  <label className="text-xs tracking-widest uppercase mb-2 block" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#8B94A8" }}>
                    Calificación
                  </label>
                  <div className="flex gap-1.5" onMouseLeave={() => setHoverRating(0)}>
                    {[1, 2, 3, 4, 5].map((n) => {
                      const active = n <= (hoverRating || form.rating);
                      return (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setForm({ ...form, rating: n })}
                          onMouseEnter={() => setHoverRating(n)}
                          className="transition-transform hover:scale-125"
                          style={{ cursor: "pointer", background: "transparent", border: "none", padding: 4 }}
                        >
                          <Star
                            size={28}
                            fill={active ? "#FBBF24" : "transparent"}
                            style={{
                              color: active ? "#FBBF24" : "#4A5568",
                              filter: active ? "drop-shadow(0 0 8px rgba(251,191,36,0.6))" : "none",
                            }}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Nombre */}
                <div>
                  <label className="text-xs tracking-widest uppercase mb-2 block" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#8B94A8" }}>
                    Nombre
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Tu nombre"
                    required
                    className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:border-[#0066FF]"
                    style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.08)", color: "#FFFFFF" }}
                  />
                </div>

                {/* Rol + Empresa (opcional) */}
                <div className="grid sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    placeholder="Cargo (opcional) — ej: Gerente"
                    className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:border-[#0066FF]"
                    style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.08)", color: "#FFFFFF" }}
                  />
                  <input
                    type="text"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    placeholder="Empresa (opcional)"
                    className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:border-[#0066FF]"
                    style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.08)", color: "#FFFFFF" }}
                  />
                </div>

                {/* Contenido */}
                <div>
                  <label className="text-xs tracking-widest uppercase mb-2 block" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#8B94A8" }}>
                    Tu reseña
                  </label>
                  <textarea
                    value={form.content}
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                    placeholder="Cuéntanos tu experiencia con ALZOVA..."
                    required
                    minLength={10}
                    maxLength={500}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:border-[#0066FF] resize-none"
                    style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.08)", color: "#FFFFFF" }}
                  />
                  <div className="text-right text-[10px] mt-1" style={{ color: "#8B94A8", fontFamily: "'JetBrains Mono', monospace" }}>
                    {form.content.length}/500
                  </div>
                </div>

                {error && (
                  <div className="px-4 py-3 rounded-xl text-sm" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", color: "#FCA5A5" }}>
                    {error}
                  </div>
                )}
                {success && (
                  <div className="px-4 py-3 rounded-xl text-sm animate-slide-up" style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.25)", color: "#86EFAC" }}>
                    ✅ ¡Reseña publicada! Ya está visible para todos.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-white transition-all hover:-translate-y-0.5 disabled:opacity-60"
                  style={{ background: "linear-gradient(135deg, #0066FF 0%, #0052CC 100%)", fontFamily: "'Poppins', sans-serif" }}
                >
                  {submitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Publicando...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Publicar reseña
                    </>
                  )}
                </button>
              </form>
            </div>
          </Reveal>
        )}

        {/* Grid de reviews */}
        {loading ? (
          <div className="mt-16 text-center py-12">
            <div className="w-10 h-10 rounded-full border-4 border-[#0066FF] border-t-transparent animate-spin mx-auto mb-3" />
            <div className="text-sm" style={{ color: "#8B94A8", fontFamily: "'JetBrains Mono', monospace" }}>
              Cargando reseñas...
            </div>
          </div>
        ) : reviews.length === 0 ? (
          <div
            className="mt-16 text-center py-16 rounded-2xl border"
            style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.06)" }}
          >
            <MessageSquare size={32} className="mx-auto mb-4" style={{ color: "#8B94A8" }} />
            <div className="text-lg font-semibold mb-1">Sé el primero en opinar</div>
            <div className="text-sm" style={{ color: "#8B94A8" }}>
              {user ? "Comparte tu experiencia con ALZOVA" : "Inicia sesión para dejar tu reseña"}
            </div>
          </div>
        ) : (
          <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review, i) => (
              <div
                key={review.id}
                className="h-full p-8 rounded-2xl border transition-all duration-500 hover:-translate-y-1 animate-slide-up"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  borderColor: "rgba(255,255,255,0.06)",
                  animationDelay: `${Math.min(i, 6) * 60}ms`,
                }}
              >
                {/* Estrellas */}
                <div className="flex gap-1 mb-5">
                  {Array.from({ length: 5 }).map((_, k) => (
                    <Star
                      key={k}
                      size={14}
                      fill={k < review.rating ? "#FBBF24" : "transparent"}
                      style={{ color: k < review.rating ? "#FBBF24" : "#4A5568" }}
                    />
                  ))}
                </div>

                {/* Contenido */}
                <p className="text-base leading-relaxed mb-7" style={{ color: "#C4CCDB" }}>
                  "{review.content}"
                </p>

                {/* Autor */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                    style={{
                      background: "linear-gradient(135deg, #0066FF, #00C2FF)",
                      color: "#FFFFFF",
                    }}
                  >
                    {review.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold truncate">{review.name}</div>
                    <div className="text-xs truncate" style={{ color: "#8B94A8" }}>
                      {[review.role, review.company].filter(Boolean).join(" · ") || "Cliente"}
                    </div>
                  </div>
                </div>

                {/* Timestamp */}
                <div className="mt-4 text-[10px]" style={{ color: "#4A5568", fontFamily: "'JetBrains Mono', monospace" }}>
                  {new Date(review.created_at).toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Contador */}
        {!loading && reviews.length > 0 && (
          <Reveal delay={300}>
            <div className="mt-10 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border" style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}>
                <Radio size={12} style={{ color: "#22C55E" }} />
                <span className="text-xs" style={{ color: "#8B94A8", fontFamily: "'JetBrains Mono', monospace" }}>
                  {reviews.length} {reviews.length === 1 ? "reseña" : "reseñas"} · actualizado en vivo
                </span>
              </div>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}