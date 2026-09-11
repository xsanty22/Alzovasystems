import { Reveal } from "../ui/Reveal";
import { Badge } from "../ui/Badge";
import { products } from "../../data/products";

export function Products() {
  return (
    <section id="productos" className="py-28 md:py-36" style={{ background: "linear-gradient(180deg, transparent 0%, rgba(10,26,47,0.4) 50%, transparent 100%)" }}>
      <div className="max-w-7xl mx-auto px-6">
        <Reveal>
          <Badge>Nuestros productos</Badge>
          <h2 className="mt-6 text-4xl md:text-5xl font-extrabold tracking-tight max-w-3xl" style={{ fontFamily: "'Poppins', sans-serif" }}>
            La familia <span className="gradient-text">ALZOVA</span>
          </h2>
        </Reveal>
        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((p, i) => {
            const Icon = p.icon;
            return (
              <Reveal key={p.name} delay={i * 60}>
                <div className="p-7 rounded-2xl border" style={{ background: "#0A1A2F", borderColor: "rgba(255,255,255,0.06)" }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6" style={{ background: "linear-gradient(135deg, #0066FF 0%, #00C2FF 100%)" }}>
                    <Icon size={22} className="text-white" />
                  </div>
                  <h3 className="text-lg font-bold mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>{p.name}</h3>
                  <p className="text-sm" style={{ color: "#8B94A8" }}>{p.desc}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}