export function DashboardMockup() {
  return (
    <div className="relative">
      <div className="absolute -inset-8 rounded-3xl blur-3xl opacity-40 pointer-events-none" style={{ background: "radial-gradient(circle at 50% 50%, #0066FF 0%, transparent 70%)" }} />
      <div className="relative rounded-2xl overflow-hidden border shadow-2xl animate-float" style={{ background: "linear-gradient(145deg, #0A1A2F 0%, #0B0F1A 100%)", borderColor: "rgba(255,255,255,0.08)" }}>
        <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
          <span className="ml-4 text-[10px] tracking-widest" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#8B94A8" }}>alzova.dashboard / live</span>
        </div>
        <div className="grid grid-cols-12">
          <div className="col-span-3 border-r p-3 space-y-2" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            {["Inicio", "Ventas", "Stock", "Clientes", "Reportes"].map((it, i) => (
              <div key={it} className="flex items-center gap-2 px-2 py-1.5 rounded-md text-[10px]" style={{ fontFamily: "'JetBrains Mono', monospace", color: i === 1 ? "#FFFFFF" : "#8B94A8", background: i === 1 ? "rgba(0,102,255,0.15)" : "transparent", border: i === 1 ? "1px solid rgba(0,102,255,0.3)" : "1px solid transparent" }}>
                <span className="w-1 h-1 rounded-full bg-current opacity-60" />{it}
              </div>
            ))}
          </div>
          <div className="col-span-9 p-4 space-y-3">
            <div className="grid grid-cols-3 gap-2">
              {[{ l: "Ventas hoy", v: "$4.2K", c: "#00C2FF" }, { l: "Órdenes", v: "182", c: "#0066FF" }, { l: "Ticket avg", v: "$23.1", c: "#7C3AED" }].map((s) => (
                <div key={s.l} className="rounded-lg p-2.5 border" style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.06)" }}>
                  <div className="text-[9px] mb-1" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#8B94A8" }}>{s.l}</div>
                  <div className="text-sm font-semibold" style={{ color: s.c, fontFamily: "'Poppins', sans-serif" }}>{s.v}</div>
                </div>
              ))}
            </div>
            <div className="rounded-lg p-3 border" style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.06)" }}>
              <div className="flex items-end justify-between h-24 gap-1.5">
                {[40, 55, 35, 70, 52, 88, 62, 95, 74, 60, 82, 68].map((h, i) => (
                  <div key={i} className="flex-1 rounded-sm animate-bar" style={{ height: `${h}%`, background: "linear-gradient(to top, #0066FF, #00C2FF)", animationDelay: `${i * 90}ms` }} />
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 text-[10px]" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#8B94A8" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-[#28C840] animate-pulse" />Sincronizado · hace 2s
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}