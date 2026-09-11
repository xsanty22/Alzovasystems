import type { ReactNode } from "react";

export function Badge({ children }: { children: ReactNode }) {
  return (
    <span
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] tracking-[0.2em] uppercase"
      style={{
        fontFamily: "'JetBrains Mono', monospace",
        color: "#8B94A8",
        background: "rgba(0,102,255,0.06)",
        border: "1px solid rgba(0,102,255,0.18)",
      }}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-[#0066FF] animate-pulse" />
      {children}
    </span>
  );
}