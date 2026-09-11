import { Sparkles } from "lucide-react";
import { Reveal } from "../ui/Reveal";
import { Badge } from "../ui/Badge";
import { testimonials } from "../../data/testimonials";

export function Testimonials() {
  return (
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
  );
}