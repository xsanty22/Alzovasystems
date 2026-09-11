import { ArrowRight, Check, Sparkles, Wrench } from "lucide-react";
import { Reveal } from "../ui/Reveal";
import { Badge } from "../ui/Badge";
import { solutions } from "../../data/solutions";

interface Props {
  onOpenQuote: () => void;
  onOpenTechServices: () => void;
}

export function Solutions({ onOpenQuote, onOpenTechServices }: Props) {
  return (
    <section id="soluciones" className="py-28 md:py-36 relative">
      <div className="max-w-7xl mx-auto px-6">
        <Reveal>
          <Badge>Soluciones</Badge>
          <h2
            className="mt-6 text-4xl md:text-5xl font-extrabold tracking-tight max-w-3xl"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Dos formas de <span className="gradient-text">impulsar</span> tu negocio
          </h2>
          <p className="mt-5 text-lg max-w-2xl" style={{ color: "#8B94A8" }}>
            Creamos el software que necesitas y mantenemos los equipos que ya tienes funcionando.
          </p>
        </Reveal>

        <div className="mt-16 grid lg:grid-cols-2 gap-6">
          {solutions.map((s, i) => {
            const isSoftware = s.tag === "Software";
            const isTech = s.tag === "Servicio técnico";

            return (
              <Reveal key={s.title} delay={i * 120}>
                <div
                  className="group relative h-full p-8 md:p-10 rounded-3xl border overflow-hidden transition-all duration-500 hover:-translate-y-1 flex flex-col"
                  style={{
                    background: "linear-gradient(145deg, rgba(10,26,47,0.7), rgba(11,11,11,0.7))",
                    borderColor: "rgba(255,255,255,0.07)",
                  }}
                >
                  <div
                    className="absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                    style={{ background: `radial-gradient(700px circle at 50% 0%, ${s.accent}22, transparent 45%)` }}
                  />

                  <div className="relative flex flex-col h-full">
                    <div className="flex items-start justify-between mb-7">
                      <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110"
                        style={{
                          background: `linear-gradient(135deg, ${s.accent} 0%, ${s.accent}AA 100%)`,
                          boxShadow: `0 12px 40px ${s.accent}55`,
                        }}
                      >
                        {(() => {
                          const Icon = s.icons[0];
                          return <Icon size={28} className="text-white" />;
                        })()}
                      </div>
                      <span
                        className="text-[10px] tracking-widest uppercase px-3 py-1.5 rounded-full"
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          color: "#8B94A8",
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(255,255,255,0.06)",
                        }}
                      >
                        {s.tag}
                      </span>
                    </div>

                    <h3
                      className="text-2xl md:text-3xl font-extrabold mb-2 leading-tight"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      {s.title}
                    </h3>
                    <p
                      className="text-xs tracking-widest uppercase mb-5"
                      style={{ fontFamily: "'JetBrains Mono', monospace", color: s.accent }}
                    >
                      {s.subtitle}
                    </p>

                    <p className="text-base leading-relaxed mb-7" style={{ color: "#8B94A8" }}>
                      {s.desc}
                    </p>

                    <ul className="space-y-3 mb-9">
                      {s.bullets.map((b) => (
                        <li key={b} className="flex items-start gap-3">
                          <span
                            className="mt-1 w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
                            style={{ background: `${s.accent}1A`, border: `1px solid ${s.accent}44` }}
                          >
                            <Check size={11} style={{ color: s.accent }} />
                          </span>
                          <span className="text-sm leading-relaxed" style={{ color: "#C4CCDB" }}>{b}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="flex items-center gap-2 mb-9">
                      {s.icons.slice(1).map((Ico, k) => (
                        <div
                          key={k}
                          className="w-9 h-9 rounded-lg flex items-center justify-center"
                          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                        >
                          <Ico size={15} style={{ color: "#8B94A8" }} />
                        </div>
                      ))}
                    </div>

                    {/* CTA — alineado al fondo */}
                    <div className="mt-auto">
                      {isSoftware && (
                        <button
                          onClick={onOpenQuote}
                          className="neon-btn group/cta relative w-full inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl font-bold text-white transition-all duration-300"
                          style={{
                            background: "linear-gradient(135deg, #0066FF 0%, #0052CC 100%)",
                            fontFamily: "'Poppins', sans-serif",
                            fontSize: "15px",
                            letterSpacing: "0.01em",
                            border: "1px solid rgba(0,194,255,0.5)",
                            cursor: "pointer",
                          }}
                        >
                          <Sparkles size={16} className="relative z-10" />
                          <span className="relative z-10">¡Cotiza tu software aquí!</span>
                          <ArrowRight size={16} className="relative z-10 transition-transform group-hover/cta:translate-x-1" />
                        </button>
                      )}

                      {isTech && (
                        <button
                          onClick={onOpenTechServices}
                          className="neon-btn-cyan group/cta relative w-full inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl font-bold text-white transition-all duration-300"
                          style={{
                            background: "linear-gradient(135deg, #00C2FF 0%, #0066FF 100%)",
                            fontFamily: "'Poppins', sans-serif",
                            fontSize: "15px",
                            letterSpacing: "0.01em",
                            border: "1px solid rgba(0,194,255,0.6)",
                            cursor: "pointer",
                          }}
                        >
                          <Wrench size={16} className="relative z-10" />
                          <span className="relative z-10">¡Consulta por nuestros servicios aquí!</span>
                          <ArrowRight size={16} className="relative z-10 transition-transform group-hover/cta:translate-x-1" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}