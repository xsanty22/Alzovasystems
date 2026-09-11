import { ArrowRight, Check, Play } from "lucide-react";
import { Reveal } from "../ui/Reveal";
import { Badge } from "../ui/Badge";
import { DashboardMockup } from "../DashboardMockup";
import { IMAGES } from "../../data/images";
import { useParticles } from "../../hooks/useParticles";

export function Hero() {
  const particles = useParticles();

  return (
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
  );
}