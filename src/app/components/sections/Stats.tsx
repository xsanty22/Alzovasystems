import { useRef, useEffect, useState } from "react";
import { useCountUp } from "../../hooks/useCountUp";
import { stats } from "../../data/stats";

function StatItem({ value, suffix, label, active, duration }: { value: number; suffix: string; label: string; active: boolean; duration: number }) {
  const val = useCountUp(value, active, duration);
  return (
    <div className="text-center md:text-left">
      <div className="text-5xl md:text-6xl font-extrabold gradient-text" style={{ fontFamily: "'Poppins', sans-serif" }}>
        {val}{suffix}
      </div>
      <div className="mt-3 text-sm" style={{ color: "#8B94A8" }}>{label}</div>
    </div>
  );
}

export function Stats() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => e.isIntersecting && setVisible(true),
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="rounded-3xl border overflow-hidden relative" style={{ background: "linear-gradient(135deg, #0A1A2F 0%, #0B0F1A 100%)", borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-20 blur-3xl" style={{ background: "#0066FF" }} />
          <div className="relative grid md:grid-cols-4 gap-8 p-10 md:p-16">
            {stats.map((s, i) => (
              <StatItem key={s.label} value={s.value} suffix={s.suffix} label={s.label} active={visible} duration={1600 + i * 100} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}