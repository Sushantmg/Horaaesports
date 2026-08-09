import { useEffect, useRef, useState } from "react";
import NepalFlag from "./NepalFlag";

const PHASES = [1700, 1700, 2600];
const FADE = 900;
const FIRE_COLORS = ["#c8102e", "#f0b429", "#003893", "#ffffff", "#ff5c73", "#ffd27a"];

type Rocket = { x: number; y: number; vx: number; vy: number; target: number; color: string };
type Spark = { x: number; y: number; vx: number; vy: number; life: number; decay: number; color: string; size: number };

export default function PrideIntro({ onFinish }: { onFinish: () => void }) {
  const [phase, setPhase] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [reduced, setReduced] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phaseRef = useRef(0);
  const finished = useRef(false);
  const doneRef = useRef(onFinish);

  useEffect(() => {
    doneRef.current = onFinish;
  });

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  const finish = () => {
    if (finished.current) return;
    finished.current = true;
    document.body.classList.remove("preload-lock");
    setLeaving(true);
    setTimeout(() => doneRef.current(), FADE);
  };

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    document.body.classList.add("preload-lock");
    return () => document.body.classList.remove("preload-lock");
  }, []);

  useEffect(() => {
    if (reduced) return;
    const timers = PHASES.map((ms, i) => setTimeout(() => setPhase(i + 1), ms));
    timers.push(setTimeout(finish, PHASES.reduce((a, b) => a + b, 0)));
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter") finish();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let raf = 0;
    let width = 0;
    let height = 0;
    let last = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rockets: Rocket[] = [];
    const sparks: Spark[] = [];

    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const explode = (x: number, y: number, color: string) => {
      const count = 55 + Math.floor(Math.random() * 35);
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.4 + Math.random() * 4.6;
        sparks.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          decay: 0.008 + Math.random() * 0.018,
          color,
          size: 1 + Math.random() * 1.7,
        });
      }
    };

    const draw = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000 || 0);
      last = now;
      ctx.clearRect(0, 0, width, height);

      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.x += r.vx * 60 * dt;
        r.y += r.vy * 60 * dt;
        r.vy += 0.12 * 60 * dt;
        ctx.beginPath();
        ctx.arc(r.x, r.y, 1.7, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.92)";
        ctx.fill();
        if (r.vy > -0.3 || r.y > r.target) {
          explode(r.x, r.y, r.color);
          rockets.splice(i, 1);
        }
      }

      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.vy += 0.05 * 60 * dt;
        s.vx *= 0.985;
        s.x += s.vx * 60 * dt;
        s.y += s.vy * 60 * dt;
        s.life -= s.decay;
        if (s.life <= 0) {
          sparks.splice(i, 1);
          continue;
        }
        ctx.globalAlpha = Math.max(0, s.life);
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      raf = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    raf = requestAnimationFrame(draw);

    const launch = () => {
      if (finished.current || phaseRef.current < 3) return;
      for (let i = 0; i < 2; i++) {
        rockets.push({
          x: width * (0.12 + Math.random() * 0.76),
          y: height,
          vx: (Math.random() - 0.5) * 0.7,
          vy: -(7 + Math.random() * 3.2),
          target: height * (0.12 + Math.random() * 0.4),
          color: FIRE_COLORS[Math.floor(Math.random() * FIRE_COLORS.length)],
        });
      }
    };
    const launchId = setInterval(launch, 520);

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(launchId);
      window.removeEventListener("resize", resize);
    };
  }, [reduced]);

  const letters = ["H", "O", "R", "A", "A"];

  return (
    <div className={`pride ${leaving ? "leaving" : ""}`} aria-hidden="true">
      <canvas ref={canvasRef} className="pride-fire" aria-hidden="true" />
      <div className="pride-grid" aria-hidden="true"></div>
      <div className="pride-scan" aria-hidden="true"></div>
      <div className="pride-mount back" aria-hidden="true"></div>
      <div className="pride-mount front" aria-hidden="true"></div>

      {reduced ? (
        <div className="pride-static">
          <div className="pride-flag">
            <NepalFlag size={170} />
          </div>
          <span className="pride-static-brand">HORAA</span>
          <span className="pride-static-sub">E S P O R T S · #FORNEPAL</span>
        </div>
      ) : (
        <>
          {phase === 1 && (
            <div className="pride-flag-wrap">
              <span className="pride-ring"></span>
              <span className="pride-ring r2"></span>
              <div className="pride-flag">
                <NepalFlag size={230} />
              </div>
              <span className="pride-flag-word">NEPAL</span>
            </div>
          )}

          {phase >= 2 && (
            <div className="pride-brand">
              <span className="pride-flash"></span>
              <div className="pride-word">
                {letters.map((l, i) => (
                  <span key={i} className="pride-letter" style={{ animationDelay: `${i * 90}ms` }}>
                    {l}
                  </span>
                ))}
              </div>
              <span className="pride-sub">E S P O R T S</span>
            </div>
          )}

          {phase >= 3 && (
            <div className="pride-tagline">
              <span className="pride-flag-mini">
                <NepalFlag size={34} />
              </span>
              <span className="pride-hash">#FORNEPAL</span>
              <span className="pride-quote">Nepal's first PUBG Mobile World Cup side — carrying the flag to Riyadh.</span>
            </div>
          )}
        </>
      )}

      <button className="pride-skip" onClick={finish}>
        {reduced ? "ENTER SITE →" : "SKIP INTRO"}
      </button>
    </div>
  );
}
