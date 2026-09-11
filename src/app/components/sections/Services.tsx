import { Reveal } from "../ui/Reveal";
import { Badge } from "../ui/Badge";
import { services } from "../../data/services";

export function Services() {
  return (
    <section id="servicios" className="py-28 md:py-36">
      <div className="max-w-7xl mx-auto px-6">
        <Reveal>
          <Badge>Servicios</Badge>
          <h2 className="mt-6 text-4xl md:text-5xl font-extrabold tracking-tight max-w-2xl" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Todo lo que necesitas para digitalizar tu empresa
          </h2>
        </Reveal>
        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.map((s, i) => {
            const Icon = s.icon;
            return (
              <Reveal key={s.title} delay={i * 50}>
                <div className="p-6 rounded-2xl border" style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.06)" }}>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-5" style={{ background: "rgba(0,102,255,0.1)" }}>
                    <Icon size={18} style={{ color: "#0066FF" }} />
                  </div>
                  <h3 className="text-base font-bold mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>{s.title}</h3>
                  <p className="text-sm" style={{ color: "#8B94A8" }}>{s.desc}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}