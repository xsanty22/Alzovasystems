import { ArrowRight, Menu, X } from "lucide-react";
import { navItems } from "../../data/nav";

interface Props {
  scrolled: boolean;
  menuOpen: boolean;
  onToggleMenu: () => void;
}

export function Navbar({ scrolled, menuOpen, onToggleMenu }: Props) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-500" style={{ paddingTop: scrolled ? "12px" : "20px", paddingBottom: scrolled ? "12px" : "20px", background: scrolled ? "rgba(11,11,11,0.85)" : "transparent", backdropFilter: scrolled ? "blur(20px)" : "none", borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent" }}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #0066FF 0%, #00C2FF 100%)" }}>
            <span className="text-white font-black text-lg" style={{ fontFamily: "'Poppins', sans-serif" }}>A</span>
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-[15px] font-bold tracking-wide" style={{ fontFamily: "'Poppins', sans-serif" }}>ALZOVA</span>
            <span className="text-[9px] tracking-[0.35em]" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#8B94A8" }}>SYSTEMS</span>
          </div>
        </a>
        <div className="hidden lg:flex items-center gap-1">
          {navItems.map(([label, id]) => (
            <a key={id} href={`#${id}`} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ color: "#B8C0D0" }}>{label}</a>
          ))}
        </div>
        <div className="hidden lg:flex items-center gap-3">
          <a href="#contacto" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white" style={{ background: "linear-gradient(135deg, #0066FF 0%, #0052CC 100%)" }}>
            Cotiza tu proyecto <ArrowRight size={15} />
          </a>
        </div>
        <button className="lg:hidden w-10 h-10 rounded-lg flex items-center justify-center border" style={{ borderColor: "rgba(255,255,255,0.1)" }} onClick={onToggleMenu} aria-label="Menú">
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>
    </nav>
  );
}