import { socialLinks } from "../../data/social";

const columns = [
  { t: "Soluciones", l: ["Creación de software", "Soporte técnico", "Reparación de equipos", "Mantenimiento", "Redes y WiFi"] },
  { t: "Servicios",  l: ["Consultoría", "Desarrollo web y móvil", "UX/UI", "Mantenimiento", "Ciberseguridad"] },
  { t: "Empresa",    l: ["Nosotros", "Casos de éxito", "Blog", "Trabaja con nosotros", "Contacto"] },
];

export function Footer() {
  return (
    <footer className="border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #0066FF 0%, #00C2FF 100%)" }}>
                <span className="text-white font-black text-lg" style={{ fontFamily: "'Poppins', sans-serif" }}>A</span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-[15px] font-bold tracking-wide" style={{ fontFamily: "'Poppins', sans-serif" }}>ALZOVA</span>
                <span className="text-[9px] tracking-[0.35em]" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#8B94A8" }}>SYSTEMS</span>
              </div>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "#8B94A8" }}>
              Software a la medida y soluciones tecnológicas para empresas que quieren crecer.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.t}>
              <h4 className="text-xs tracking-widest uppercase mb-4" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#FFFFFF" }}>{col.t}</h4>
              <ul className="space-y-2.5">
                {col.l.map((it) => (
                  <li key={it}>
                    <a href="#" className="text-sm transition-colors hover:text-white" style={{ color: "#8B94A8" }}>{it}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-6" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <p className="text-xs" style={{ color: "#8B94A8" }}>
            © {new Date().getFullYear()} ALZOVA SYSTEMS · Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-3">
            {socialLinks.map(({ icon: Icon, href }, i) => (
              <a
                key={i}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg flex items-center justify-center border transition-all duration-300 hover:border-[#0066FF] hover:text-[#0066FF]"
                style={{ borderColor: "rgba(255,255,255,0.08)", color: "#8B94A8" }}
              >
                <Icon size={14} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}