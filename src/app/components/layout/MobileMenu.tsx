import { ChevronRight } from "lucide-react";
import { navItems } from "../../data/nav";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function MobileMenu({ open, onClose }: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 lg:hidden pt-24 px-6" style={{ background: "rgba(11,11,11,0.98)" }}>
      <div className="flex flex-col gap-2">
        {navItems.map(([label, id]) => (
          <a key={id} href={`#${id}`} onClick={onClose} className="py-4 text-2xl font-semibold border-b flex items-center justify-between" style={{ borderColor: "rgba(255,255,255,0.06)", fontFamily: "'Poppins', sans-serif" }}>
            {label}<ChevronRight size={20} style={{ color: "#0066FF" }} />
          </a>
        ))}
      </div>
    </div>
  );
}