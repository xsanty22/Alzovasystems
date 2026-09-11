import type { ReactNode, CSSProperties } from "react";
import { useIntersection } from "../../hooks/useIntersection";

interface Props {
  children: ReactNode;
  delay?: number;
  className?: string;
  style?: CSSProperties;
}

export function Reveal({ children, delay = 0, className = "", style }: Props) {
  const { ref, visible } = useIntersection();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.9s cubic-bezier(.2,.7,.2,1) ${delay}ms, transform 0.9s cubic-bezier(.2,.7,.2,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}