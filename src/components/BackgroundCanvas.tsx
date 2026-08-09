import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  hue: string;
  twinkle: number;
  twinkleSpeed: number;
}

interface Parachute {
  x: number;
  y: number;
  speed: number;
  phase: number;
  sway: number;
  scale: number;
}

const COLORS = ["#c8102e", "#f0b429", "#8f1222", "#ff5c73", "#ffd27a", "#003893", "#f7a600"];

export default function BackgroundCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let raf = 0;
    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let chutes: Parachute[] = [];
    let scrollOffset = 0;
    const mouse = { x: -9999, y: -9999 };
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const spawn = (): Particle => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 2 + 0.6,
      vx: (Math.random() - 0.5) * 0.35,
      vy: -(Math.random() * 0.45 + 0.08),
      hue: COLORS[Math.floor(Math.random() * COLORS.length)],
      twinkle: Math.random() * Math.PI * 2,
      twinkleSpeed: 0.02 + Math.random() * 0.05,
    });

    const spawnChute = (top = true): Parachute => ({
      x: Math.random() * width,
      y: top ? -60 - Math.random() * 200 : Math.random() * height,
      speed: 0.18 + Math.random() * 0.3,
      phase: Math.random() * Math.PI * 2,
      sway: 24 + Math.random() * 46,
      scale: 0.5 + Math.random() * 0.6,
    });

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const target = Math.min(160, Math.floor((width * height) / 9000));
      particles = Array.from({ length: target }, spawn);
      chutes = Array.from({ length: 3 }, () => spawnChute());
    };

    const onScroll = () => {
      scrollOffset = window.scrollY;
    };

    const onMouse = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const onMouseLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const parallax = scrollOffset * 0.25;

      ctx.save();
      ctx.translate(0, -parallax % height);

      for (const p of particles) {
        p.twinkle += p.twinkleSpeed;
        p.x += p.vx;
        p.y += p.vy;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        const alpha = 0.25 + (Math.sin(p.twinkle) + 1) * 0.3;
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 140) {
          const push = (140 - dist) / 140;
          p.x += (dx / (dist || 1)) * push * 2.4;
          p.y += (dy / (dist || 1)) * push * 2.4;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.hue;
        ctx.globalAlpha = Math.max(0.05, alpha);
        ctx.fill();
      }

      ctx.globalAlpha = 0.6;
      ctx.lineWidth = 1;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 120 * 120) {
            const t = 1 - Math.sqrt(d2) / 120;
            ctx.strokeStyle = `rgba(200, 16, 46, ${t * 0.18})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      /* drifting parachutes */
      ctx.globalAlpha = 0.32;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
      ctx.lineWidth = 1.2;
      for (const ch of chutes) {
        ch.y += ch.speed;
        ch.phase += 0.008;
        ch.x += Math.sin(ch.phase) * 0.35;
        if (ch.y > height + 90) {
          ch.y = -70;
          ch.x = Math.random() * width;
        }
        if (ch.x < -60) ch.x = width + 40;
        if (ch.x > width + 60) ch.x = -40;

        const r = 15 * ch.scale;
        const cx = ch.x;
        const cy = ch.y;
        ctx.beginPath();
        ctx.arc(cx, cy - r, r, Math.PI, 0);
        ctx.quadraticCurveTo(cx + r * 0.2, cy - r * 0.2, cx, cy - r * 0.1);
        ctx.quadraticCurveTo(cx - r * 0.2, cy - r * 0.2, cx - r, cy - r);
        ctx.stroke();
        for (let k = -1; k <= 1; k += 1) {
          ctx.beginPath();
          ctx.moveTo(cx + k * r * 0.66, cy - r * 0.35);
          ctx.lineTo(cx, cy + r * 0.9);
          ctx.stroke();
        }
      }

      ctx.restore();
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMouse, { passive: true });
    window.addEventListener("mouseleave", onMouseLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="bg-canvas" aria-hidden="true" />
      <div className="bg-vignette" aria-hidden="true" />
      <div className="bg-grain" aria-hidden="true" />
    </>
  );
}
