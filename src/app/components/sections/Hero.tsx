import { ArrowRight, Check, Play } from "lucide-react";
import { Reveal } from "../ui/Reveal";
import { Badge } from "../ui/Badge";
import { DashboardMockup } from "../DashboardMockup";
import { HeroBackground } from "../HeroBackground";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-32 pb-24 overflow-hidden">
      {/* ══════════════════════════════════════════════════
          FONDO TECNOLÓGICO
         ══════════════════════════════════════════════════ */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Canvas interactivo con partículas */}
        <HeroBackground />

        {/* Orbes de gradiente */}
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />

        {/* Viñeta radial */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, transparent 0%, rgba(11,11,11,0.6) 65%, #0B0B0B 100%)",
          }}
        />

        {/* Grid CSS sutil encima del canvas */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,102,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(0,102,255,0.08) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
            maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
            WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          }}
        />
      </div>

      {/* ══════════════════════════════════════════════════
          CONTENIDO
         ══════════════════════════════════════════════════ */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* ──────── COLUMNA IZQUIERDA ──────── */}
          <div>
            <Reveal>
              <Badge>Software · Automatización · Cloud</Badge>
            </Reveal>

            <Reveal delay={100}>
              <h1
                className="mt-8 text-5xl md:text-6xl lg:text-7xl leading-[1.05] font-extrabold tracking-tight"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Tecnología que <span className="gradient-text">impulsa</span> tu negocio al futuro.
              </h1>
            </Reveal>

            <Reveal delay={200}>
              <p
                className="mt-7 text-lg md:text-xl leading-relaxed max-w-xl"
                style={{ color: "#8B94A8" }}
              >
                Desarrollamos software a la medida, POS, inventarios y automatización para retail, gastronomía, supermercados y más.
              </p>
            </Reveal>

            <Reveal delay={300}>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <a
                  href="#soluciones"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white"
                  style={{ background: "linear-gradient(135deg, #0066FF 0%, #0052CC 100%)" }}
                >
                  Explorar soluciones <ArrowRight size={16} />
                </a>
                <a
                  href="#productos"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold border"
                  style={{ borderColor: "rgba(255,255,255,0.12)", color: "#FFFFFF" }}
                >
                  <Play size={14} style={{ color: "#0066FF" }} />
                  Ver demo
                </a>
              </div>
            </Reveal>

            <Reveal delay={400}>
              <div
                className="mt-12 flex flex-wrap items-center gap-6 text-xs"
                style={{ fontFamily: "'JetBrains Mono', monospace", color: "#8B94A8" }}
              >
                <span className="flex items-center gap-2">
                  <Check size={14} style={{ color: "#0066FF" }} />
                  Sin contratos largos
                </span>
                <span className="flex items-center gap-2">
                  <Check size={14} style={{ color: "#0066FF" }} />
                  Implementación en semanas
                </span>
                <span className="flex items-center gap-2">
                  <Check size={14} style={{ color: "#0066FF" }} />
                  Soporte 24/7
                </span>
              </div>
            </Reveal>
          </div>

          {/* ──────── COLUMNA DERECHA ──────── */}
          <Reveal delay={200}>
            <DashboardMockup />
          </Reveal>

        </div>
      </div>
    </section>
  );
}