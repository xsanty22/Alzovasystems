import { useEffect, useRef } from "react";

/* ══════════════════════════════════════════════════════════
   TIPOS
   ══════════════════════════════════════════════════════════ */
interface Particle {
  x: number; y: number; vx: number; vy: number;
  size: number; baseX: number; baseY: number;
}

interface Signal {
  x: number; y: number; vx: number; vy: number;
  life: number; maxLife: number; color: string; speed: number;
}

interface ShootingStar {
  x: number; y: number; vx: number; vy: number;
  life: number; maxLife: number; length: number;
}

interface RadarPulse {
  x: number; y: number; radius: number; maxRadius: number;
  life: number; maxLife: number; color: string;
}

interface Circuit {
  segments: { x1: number; y1: number; x2: number; y2: number }[];
  life: number; maxLife: number;
}

/* ══════════════════════════════════════════════════════════
   COMPONENTE
   ══════════════════════════════════════════════════════════ */
export function HeroBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const gridRef = useRef({ rx: 0, ry: 0 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let lastTime = 0;

    // Arrays de efectos
    let particles: Particle[] = [];
    let signals: Signal[] = [];
    let shootingStars: ShootingStar[] = [];
    let radarPulses: RadarPulse[] = [];
    let circuits: Circuit[] = [];

    // Timers para spawn
    let lastSignalSpawn = 0;
    let lastStarSpawn = 0;
    let lastRadarSpawn = 0;
    let lastCircuitSpawn = 0;

    // ══════════════════════════════════════════════════════
    // SETUP
    // ══════════════════════════════════════════════════════
    const setup = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Partículas
      const count = Math.min(70, Math.floor((width * height) / 18000));
      particles = Array.from({ length: count }).map(() => {
        const x = Math.random() * width;
        const y = Math.random() * height;
        return {
          x, y, baseX: x, baseY: y,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          size: Math.random() * 1.8 + 0.8,
        };
      });
    };

    setup();

    // ══════════════════════════════════════════════════════
    // MOUSE + RESIZE
    // ══════════════════════════════════════════════════════
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      gridRef.current = {
        rx: ((e.clientY - cy) / rect.height) * -4,
        ry: ((e.clientX - cx) / rect.width) * 4,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
      gridRef.current = { rx: 0, ry: 0 };
    };

    const handleResize = () => setup();

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    // ══════════════════════════════════════════════════════
    // SPAWNERS
    // ══════════════════════════════════════════════════════
    const spawnSignal = () => {
      // Vienen desde los bordes hacia el centro o cruzando
      const side = Math.floor(Math.random() * 4);
      let x = 0, y = 0, vx = 0, vy = 0;
      const speed = 1.8 + Math.random() * 1.2;

      if (side === 0) { // izquierda
        x = -50; y = Math.random() * height;
        vx = speed; vy = (Math.random() - 0.5) * 0.6;
      } else if (side === 1) { // derecha
        x = width + 50; y = Math.random() * height;
        vx = -speed; vy = (Math.random() - 0.5) * 0.6;
      } else if (side === 2) { // arriba
        x = Math.random() * width; y = -50;
        vx = (Math.random() - 0.5) * 0.6; vy = speed;
      } else { // abajo
        x = Math.random() * width; y = height + 50;
        vx = (Math.random() - 0.5) * 0.6; vy = -speed;
      }

      const colors = ["#00C2FF", "#0066FF", "#7C3AED"];
      signals.push({
        x, y, vx, vy,
        life: 0,
        maxLife: 200 + Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        speed,
      });
    };

    const spawnShootingStar = () => {
      const fromLeft = Math.random() > 0.5;
      const angle = (Math.random() * 20 + 25) * (Math.PI / 180); // 25-45 grados
      const speed = 6 + Math.random() * 4;

      shootingStars.push({
        x: fromLeft ? -100 : width + 100,
        y: Math.random() * height * 0.6,
        vx: fromLeft ? Math.cos(angle) * speed : -Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        maxLife: 90 + Math.random() * 40,
        length: 80 + Math.random() * 60,
      });
    };

    const spawnRadarPulse = () => {
      radarPulses.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 0,
        maxRadius: 180 + Math.random() * 120,
        life: 0,
        maxLife: 120,
        color: Math.random() > 0.5 ? "#00C2FF" : "#0066FF",
      });
    };

    const spawnCircuit = () => {
      // Generar un pequeño circuito PCB con líneas ortogonales
      const startX = Math.random() * width;
      const startY = Math.random() * height;
      const segments: { x1: number; y1: number; x2: number; y2: number }[] = [];
      let cx = startX;
      let cy = startY;
      const stepCount = 3 + Math.floor(Math.random() * 3);

      for (let i = 0; i < stepCount; i++) {
        const isHorizontal = i % 2 === 0;
        const len = 40 + Math.random() * 60;
        const dir = Math.random() > 0.5 ? 1 : -1;

        const nx = isHorizontal ? cx + len * dir : cx;
        const ny = isHorizontal ? cy : cy + len * dir;

        segments.push({ x1: cx, y1: cy, x2: nx, y2: ny });
        cx = nx;
        cy = ny;
      }

      circuits.push({ segments, life: 0, maxLife: 150 });
    };

    // ══════════════════════════════════════════════════════
    // DIBUJAR GRID 3D
    // ══════════════════════════════════════════════════════
    const drawGrid = () => {
      const { rx, ry } = gridRef.current;
      const centerX = width / 2;
      const centerY = height / 2;
      const spacing = 60;

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate((ry * Math.PI) / 180);
      ctx.rotate((rx * Math.PI) / 180);
      ctx.translate(-centerX, -centerY);

      const cols = Math.ceil(width / spacing) + 2;
      const rows = Math.ceil(height / spacing) + 2;

      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(0, 194, 255, 0.05)";

      for (let i = -1; i < cols; i++) {
        const x = i * spacing;
        ctx.beginPath();
        ctx.moveTo(x, -height);
        ctx.lineTo(x, height * 2);
        ctx.stroke();
      }
      for (let j = -1; j < rows; j++) {
        const y = j * spacing;
        ctx.beginPath();
        ctx.moveTo(-width, y);
        ctx.lineTo(width * 2, y);
        ctx.stroke();
      }

      ctx.restore();
    };

    // ══════════════════════════════════════════════════════
    // ANIMACIÓN PRINCIPAL
    // ══════════════════════════════════════════════════════
    const animate = (now: number) => {
      const dt = Math.min(now - lastTime, 50);
      lastTime = now;
      ctx.clearRect(0, 0, width, height);

      // 1. GRID DE FONDO
      drawGrid();

      // 2. SPAWN DE EFECTOS (con timing)
      if (now - lastSignalSpawn > 2800 + Math.random() * 2000) {
        spawnSignal();
        lastSignalSpawn = now;
      }
      if (now - lastStarSpawn > 5500 + Math.random() * 3500) {
        spawnShootingStar();
        lastStarSpawn = now;
      }
      if (now - lastRadarSpawn > 7000 + Math.random() * 4000) {
        spawnRadarPulse();
        lastRadarSpawn = now;
      }
      if (now - lastCircuitSpawn > 6000 + Math.random() * 3000) {
        spawnCircuit();
        lastCircuitSpawn = now;
      }

      // 3. ACTUALIZAR Y DIBUJAR PARTÍCULAS
      const mouse = mouseRef.current;

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 180;

        if (dist < maxDist && dist > 0) {
          const force = (1 - dist / maxDist) * 0.8;
          p.x += (dx / dist) * force;
          p.y += (dy / dist) * force;
        }

        p.x += (p.baseX - p.x) * 0.005;
        p.y += (p.baseY - p.y) * 0.005;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
        p.x = Math.max(0, Math.min(width, p.x));
        p.y = Math.max(0, Math.min(height, p.y));
      });

      // Conexiones entre partículas
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 140) {
            const opacity = (1 - dist / 140) * 0.35;
            const grad = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
            grad.addColorStop(0, `rgba(0, 102, 255, ${opacity})`);
            grad.addColorStop(1, `rgba(0, 194, 255, ${opacity})`);
            ctx.strokeStyle = grad;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // Dibujar partículas
      particles.forEach((p) => {
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 6);
        grad.addColorStop(0, "rgba(0, 194, 255, 0.8)");
        grad.addColorStop(0.5, "rgba(0, 102, 255, 0.3)");
        grad.addColorStop(1, "rgba(0, 102, 255, 0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // 4. SEÑALES SATÉLITE — líneas rápidas con estela
      signals = signals.filter((s) => {
        s.x += s.vx * (dt / 16);
        s.y += s.vy * (dt / 16);
        s.life += 1;

        if (s.life >= s.maxLife) return false;
        if (s.x < -100 || s.x > width + 100 || s.y < -100 || s.y > height + 100) return false;

        const lifeRatio = s.life / s.maxLife;
        const fadeIn = Math.min(1, lifeRatio * 4);
        const fadeOut = Math.min(1, (1 - lifeRatio) * 4);
        const opacity = Math.min(fadeIn, fadeOut) * 0.85;

        // Cola de la señal (línea con degradado)
        const tailLength = 120 + s.speed * 20;
        const norm = Math.sqrt(s.vx * s.vx + s.vy * s.vy);
        const tailX = s.x - (s.vx / norm) * tailLength;
        const tailY = s.y - (s.vy / norm) * tailLength;

        const grad = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
        grad.addColorStop(0, `${s.color}00`);
        grad.addColorStop(0.6, `${s.color}40`);
        grad.addColorStop(1, `${s.color}${Math.floor(opacity * 255).toString(16).padStart(2, "0")}`);

        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(s.x, s.y);
        ctx.stroke();

        // Glow del punto luminoso
        const glowGrad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, 10);
        glowGrad.addColorStop(0, `${s.color}${Math.floor(opacity * 255).toString(16).padStart(2, "0")}`);
        glowGrad.addColorStop(1, `${s.color}00`);
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(s.x, s.y, 10, 0, Math.PI * 2);
        ctx.fill();

        // Núcleo blanco brillante
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, 2, 0, Math.PI * 2);
        ctx.fill();

        return true;
      });

      // 5. ESTRELLAS FUGACES — destellos largos
      shootingStars = shootingStars.filter((star) => {
        star.x += star.vx * (dt / 16);
        star.y += star.vy * (dt / 16);
        star.life += 1;

        if (star.life >= star.maxLife) return false;
        if (star.x < -200 || star.x > width + 200 || star.y < -200 || star.y > height + 200) return false;

        const lifeRatio = star.life / star.maxLife;
        const fadeIn = Math.min(1, lifeRatio * 3);
        const fadeOut = Math.max(0, 1 - lifeRatio);
        const opacity = fadeIn * fadeOut;

        const norm = Math.sqrt(star.vx * star.vx + star.vy * star.vy);
        const tailX = star.x - (star.vx / norm) * star.length;
        const tailY = star.y - (star.vy / norm) * star.length;

        // Cola con degradado
        const grad = ctx.createLinearGradient(tailX, tailY, star.x, star.y);
        grad.addColorStop(0, "rgba(0, 194, 255, 0)");
        grad.addColorStop(0.5, `rgba(0, 194, 255, ${opacity * 0.4})`);
        grad.addColorStop(0.85, `rgba(255, 255, 255, ${opacity * 0.7})`);
        grad.addColorStop(1, `rgba(255, 255, 255, ${opacity})`);

        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(star.x, star.y);
        ctx.stroke();

        // Halo en la cabeza
        const haloGrad = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, 15);
        haloGrad.addColorStop(0, `rgba(0, 194, 255, ${opacity})`);
        haloGrad.addColorStop(1, "rgba(0, 194, 255, 0)");
        ctx.fillStyle = haloGrad;
        ctx.beginPath();
        ctx.arc(star.x, star.y, 15, 0, Math.PI * 2);
        ctx.fill();

        return true;
      });

      // 6. PULSOS RADAR — ondas expansivas
      radarPulses = radarPulses.filter((pulse) => {
        pulse.life += 1;
        if (pulse.life >= pulse.maxLife) return false;

        const progress = pulse.life / pulse.maxLife;
        pulse.radius = pulse.maxRadius * progress;

        const opacity = (1 - progress) * 0.6;

        // Anillo principal
        ctx.strokeStyle = `${pulse.color}${Math.floor(opacity * 255).toString(16).padStart(2, "0")}`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(pulse.x, pulse.y, pulse.radius, 0, Math.PI * 2);
        ctx.stroke();

        // Anillo secundario más tenue
        if (progress < 0.5) {
          ctx.strokeStyle = `${pulse.color}${Math.floor(opacity * 0.4 * 255).toString(16).padStart(2, "0")}`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(pulse.x, pulse.y, pulse.radius * 0.6, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Punto central
        if (progress < 0.3) {
          const dotOpacity = 1 - progress / 0.3;
          ctx.fillStyle = `${pulse.color}${Math.floor(dotOpacity * 255).toString(16).padStart(2, "0")}`;
          ctx.beginPath();
          ctx.arc(pulse.x, pulse.y, 3, 0, Math.PI * 2);
          ctx.fill();
        }

        return true;
      });

      // 7. CIRCUITOS PCB — líneas ortogonales
      circuits = circuits.filter((circuit) => {
        circuit.life += 1;
        if (circuit.life >= circuit.maxLife) return false;

        const lifeRatio = circuit.life / circuit.maxLife;
        const fadeIn = Math.min(1, lifeRatio * 4);
        const fadeOut = Math.max(0, 1 - (lifeRatio - 0.6) / 0.4);
        const opacity = Math.min(fadeIn, fadeOut) * 0.5;

        ctx.strokeStyle = `rgba(0, 194, 255, ${opacity})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        circuit.segments.forEach((seg) => {
          ctx.moveTo(seg.x1, seg.y1);
          ctx.lineTo(seg.x2, seg.y2);
        });
        ctx.stroke();

        // Nodos en las uniones
        if (opacity > 0.15) {
          ctx.fillStyle = `rgba(0, 194, 255, ${opacity * 1.5})`;
          circuit.segments.forEach((seg) => {
            ctx.beginPath();
            ctx.arc(seg.x1, seg.y1, 1.5, 0, Math.PI * 2);
            ctx.fill();
          });
          // Nodo final
          const lastSeg = circuit.segments[circuit.segments.length - 1];
          ctx.beginPath();
          ctx.arc(lastSeg.x2, lastSeg.y2, 2, 0, Math.PI * 2);
          ctx.fill();
        }

        return true;
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 0.85 }}
    />
  );
}