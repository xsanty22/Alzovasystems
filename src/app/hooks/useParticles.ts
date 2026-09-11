import { useMemo } from "react";

export function useParticles(count = 28) {
  return useMemo(
    () =>
      Array.from({ length: count }).map(() => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 1 + Math.random() * 2,
        delay: Math.random() * 8,
        duration: 8 + Math.random() * 10,
        opacity: 0.2 + Math.random() * 0.5,
      })),
    [count]
  );
}