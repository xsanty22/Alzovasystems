import { ArrowRight, Menu, X, User as UserIcon, LogOut } from "lucide-react";
import { navItems } from "../../data/nav";
import { useAuth } from "../../hooks/useAuth";
import logoUrl from "../../../assets/logo.svg";

interface Props {
  scrolled: boolean;
  menuOpen: boolean;
  onToggleMenu: () => void;
  onOpenRegister: () => void;
  onOpenAccount: () => void;
}

export function Navbar({
  scrolled,
  menuOpen,
  onToggleMenu,
  onOpenRegister,
  onOpenAccount,
}: Props) {
  const { user, profile, signOut } = useAuth();
  const fullName = profile?.full_name || (user?.user_metadata?.full_name as string | undefined);
  const displayName = fullName?.split(" ")[0] || user?.email?.split("@")[0] || "Mi cuenta";

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        paddingTop: scrolled ? "12px" : "20px",
        paddingBottom: scrolled ? "12px" : "20px",
        background: scrolled ? "rgba(11,11,11,0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* LOGO */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="relative">
            {/* Glow detrás del logo */}
            <div
              className="absolute inset-0 rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ background: "radial-gradient(circle, rgba(0,102,255,0.6), transparent 70%)" }}
            />
            <img
              src={logoUrl}
              alt="ALZOVA SYSTEMS"
              className="relative h-9 w-9 object-contain transition-transform duration-500 group-hover:scale-110"
              style={{ filter: "drop-shadow(0 0 8px rgba(0,102,255,0.4))" }}
            />
          </div>
          <div className="flex flex-col leading-none">
            <span
              className="text-[15px] font-bold tracking-wide"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              ALZOVA
            </span>
            <span
              className="text-[9px] tracking-[0.35em]"
              style={{ fontFamily: "'JetBrains Mono', monospace", color: "#8B94A8" }}
            >
              SYSTEMS
            </span>
          </div>
        </a>

        {/* NAV ITEMS */}
        <div className="hidden lg:flex items-center gap-1">
          {navItems.map(([label, id]) => (
            <a
              key={id}
              href={`#${id}`}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:text-white"
              style={{ color: "#B8C0D0" }}
            >
              {label}
            </a>
          ))}
        </div>

        {/* ZONA DERECHA */}
        <div className="hidden lg:flex items-center gap-3">
          {user ? (
            <>
              <a
                href="#contacto"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  background: "linear-gradient(135deg, #0066FF 0%, #0052CC 100%)",
                  boxShadow: "0 8px 24px rgba(0,102,255,0.3)",
                }}
              >
                Cotiza tu proyecto <ArrowRight size={15} />
              </a>

              <button
                onClick={onOpenAccount}
                className="group flex items-center gap-2.5 pl-1.5 pr-4 py-1.5 rounded-xl border transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  borderColor: "rgba(0,102,255,0.35)",
                  background: "rgba(0,102,255,0.08)",
                }}
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
                  style={{
                    background: "linear-gradient(135deg, #0066FF, #00C2FF)",
                    color: "#FFFFFF",
                  }}
                >
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-semibold">{displayName}</span>
              </button>

              <button
                onClick={signOut}
                className="w-10 h-10 rounded-lg flex items-center justify-center border transition-colors hover:bg-white/5"
                style={{ borderColor: "rgba(255,255,255,0.1)", color: "#8B94A8" }}
                title="Cerrar sesión"
              >
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onOpenRegister}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border transition-all duration-300 hover:bg-white/5 hover:-translate-y-0.5"
                style={{ borderColor: "rgba(255,255,255,0.12)", color: "#FFFFFF" }}
              >
                <UserIcon size={15} />
                Regístrate
              </button>
              <a
                href="#contacto"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  background: "linear-gradient(135deg, #0066FF 0%, #0052CC 100%)",
                  boxShadow: "0 8px 24px rgba(0,102,255,0.3)",
                }}
              >
                Cotiza tu proyecto <ArrowRight size={15} />
              </a>
            </>
          )}
        </div>

        <button
          className="lg:hidden w-10 h-10 rounded-lg flex items-center justify-center border"
          style={{ borderColor: "rgba(255,255,255,0.1)" }}
          onClick={onToggleMenu}
          aria-label="Menú"
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>
    </nav>
  );
}