import { techs } from "../../data/techs";

export function TechMarquee() {
  return (
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
  );
}