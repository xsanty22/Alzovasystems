import { Reveal } from "../ui/Reveal";
import { Badge } from "../ui/Badge";
import { process } from "../../data/process";

export function Process() {
  return (
    <section id="proceso" className="py-20 md:py-24" style={{ background: "linear-gradient(180deg, transparent 0%, rgba(10,26,47,0.5) 50%, transparent 100%)" }}>
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
  );
}