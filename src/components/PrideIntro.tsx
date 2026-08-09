import { useEffect, useRef, useState } from "react";
import NepalFlag from "./NepalFlag";

const PHASES = [1700, 1700, 2700];
const FADE = 900;
const FIRE_COLORS = ["#c8102e", "#f0b429", "#003893", "#ffffff", "#ff5c73", "#ffd27a"];
const NEPAL_COLORS = ["#c8102e", "#f0b429", "#003893", "#ffffff"];
const LETTER_GOLD = ["#f0b429", "#ffd977", "#e31837", "#ffe9a8"];
const rnd = Math.random;

type P = {
  kind: "spark" | "glitter" | "rocket" | "confetti";
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  color: string;
  life: number;
  decay: number;
  rot: number;
  vrot: number;
  grav: number;
  drag: number;
  tw: number;
  ts: number;
  ph: number;
  sway: number;
  w: number;
  h: number;
  targetY: number;
};

interface FxApi {
  burst(x: number, y: number, colors: string[], count?: number, power?: number, grav?: number): void;
  setActive(active: boolean): void;
}

export default function PrideIntro({ onFinish }: { onFinish: () => void }) {
  const [phase, setPhase] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [reduced, setReduced] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const flagWrapRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLDivElement>(null);
  const fxRef = useRef<FxApi | null>(null);
  const finished = useRef(false);
  const doneRef = useRef(onFinish);

  useEffect(() => {
    doneRef.current = onFinish;
  });

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

  /* ---------------- canvas FX engine ---------------- */
  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let raf = 0;
    let width = 0;
    let height = 0;
    let last = 0;
    let confInterval = 0;
    let fireInterval = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const parts: P[] = [];
    const stars: Array<{ x: number; y: number; r: number; tw: number; ts: number }> = [];
    const embers: Array<{ x: number; y: number; r: number; ph: number; sway: number; spd: number }> = [];

    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      stars.length = 0;
      embers.length = 0;
      const sc = Math.min(110, Math.floor((width * height) / 16000));
      for (let i = 0; i < sc; i++) {
        stars.push({
          x: rnd() * width,
          y: rnd() * height,
          r: 0.4 + rnd() * 1.2,
          tw: rnd() * Math.PI * 2,
          ts: 0.008 + rnd() * 0.03,
        });
      }
      const ec = Math.min(42, Math.floor((width * height) / 42000));
      for (let i = 0; i < ec; i++) {
        embers.push({
          x: rnd() * width,
          y: rnd() * height,
          r: 0.6 + rnd() * 1.5,
          ph: rnd() * Math.PI * 2,
          sway: 10 + rnd() * 30,
          spd: 0.25 + rnd() * 0.6,
        });
      }
    };

    const spark = (p: Partial<P>): P => ({
      kind: "spark",
      x: 0, y: 0, vx: 0, vy: 0, r: 1.6,
      color: "#fff", life: 1, decay: 0.014,
      rot: 0, vrot: 0, grav: 0.06, drag: 0.985,
      tw: 0, ts: 0, ph: 0, sway: 0, w: 0, h: 0, targetY: 0,
      ...p,
    });

    const burst = (x: number, y: number, colors: string[], count = 60, power = 5, grav = 0.06) => {
      for (let i = 0; i < count; i++) {
        const ang = rnd() * Math.PI * 2;
        const sp = power * (0.3 + rnd());
        parts.push(
          spark({
            kind: "spark",
            x, y,
            vx: Math.cos(ang) * sp,
            vy: Math.sin(ang) * sp - power * 0.25,
            r: 1 + rnd() * 2.3,
            color: colors[i % colors.length],
            decay: 0.012 + rnd() * 0.02,
            grav,
          })
        );
      }
      for (let i = 0; i < count * 0.45; i++) {
        const ang = rnd() * Math.PI * 2;
        const sp = power * (0.12 + rnd() * 0.5);
        parts.push(
          spark({
            kind: "glitter",
            x, y,
            vx: Math.cos(ang) * sp,
            vy: Math.sin(ang) * sp,
            r: 0.5 + rnd() * 1.1,
            color: colors[i % colors.length],
            decay: 0.005 + rnd() * 0.01,
            tw: rnd() * Math.PI * 2,
            ts: 0.08 + rnd() * 0.16,
            grav: 0.012,
          })
        );
      }
    };

    const confetti = () => {
      const c = 10 + Math.floor(rnd() * 6);
      for (let i = 0; i < c; i++) {
        parts.push(
          spark({
            kind: "confetti",
            x: rnd() * width,
            y: -20 - rnd() * 50,
            vx: (rnd() - 0.5) * 0.5,
            vy: 1.2 + rnd() * 1.8,
            w: 4 + rnd() * 5,
            h: 7 + rnd() * 7,
            rot: rnd() * Math.PI * 2,
            vrot: (rnd() - 0.5) * 0.22,
            color: NEPAL_COLORS[Math.floor(rnd() * NEPAL_COLORS.length)],
            ph: rnd() * Math.PI * 2,
            sway: 0.6 + rnd() * 1.5,
          })
        );
      }
    };

    const launch = () => {
      parts.push(
        spark({
          kind: "rocket",
          x: width * (0.12 + rnd() * 0.76),
          y: height + 4,
          vx: (rnd() - 0.5) * 0.9,
          vy: -(8 + rnd() * 3.6),
          r: 2,
          color: FIRE_COLORS[Math.floor(rnd() * FIRE_COLORS.length)],
          targetY: height * (0.1 + rnd() * 0.42),
        })
      );
    };

    const draw = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000 || 0);
      last = now;
      ctx.clearRect(0, 0, width, height);

      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      for (const s of stars) {
        s.tw += s.ts * dt * 60;
        ctx.globalAlpha = 0.18 + (Math.sin(s.tw) + 1) * 0.32;
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      for (const e of embers) {
        e.y -= e.spd * dt * 60;
        e.ph += 0.02 * dt * 60;
        if (e.y < -10) {
          e.y = height + 10;
          e.x = rnd() * width;
        }
        ctx.globalAlpha = 0.35 + 0.3 * Math.sin(e.ph);
        ctx.fillStyle = "rgba(240,180,41,1)";
        ctx.beginPath();
        ctx.arc(e.x + Math.sin(e.ph) * e.sway, e.y, e.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
      ctx.globalAlpha = 1;

      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];

        if (p.kind === "rocket") {
          p.vy += p.grav * 60 * dt;
          p.x += p.vx * 60 * dt;
          p.y += p.vy * 60 * dt;
          ctx.save();
          ctx.globalCompositeOperation = "lighter";
          ctx.strokeStyle = p.color;
          ctx.globalAlpha = 0.55;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - p.vx * 5, p.y - p.vy * 5);
          ctx.stroke();
          ctx.globalAlpha = 1;
          ctx.fillStyle = "#fff";
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
          if (p.y <= p.targetY || p.vy > -0.4) {
            burst(p.x, p.y, [p.color, "#fff", "#ffd27a"], 72, 6.5, 0.07);
            parts.splice(i, 1);
          }
          continue;
        }

        if (p.kind === "confetti") {
          p.ph += 0.04 * dt * 60;
          p.x += (p.vx + Math.sin(p.ph) * p.sway * 0.35) * dt * 60;
          p.y += p.vy * dt * 60;
          p.rot += p.vrot * dt * 60;
          if (p.y > height + 20) {
            p.y = -20;
            p.x = rnd() * width;
          }
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.globalAlpha = 0.85;
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
          ctx.restore();
          continue;
        }

        p.vy += p.grav * 60 * dt;
        p.vx *= p.drag;
        p.x += p.vx * 60 * dt;
        p.y += p.vy * 60 * dt;
        p.life -= p.decay * 60 * dt;
        if (p.life <= 0) {
          parts.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        if (p.kind === "glitter") {
          p.tw += p.ts * dt * 60;
          ctx.globalAlpha = Math.max(0, p.life) * (0.35 + 0.65 * Math.abs(Math.sin(p.tw)));
        } else {
          ctx.globalAlpha = Math.max(0, p.life);
        }
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      raf = requestAnimationFrame(draw);
    };

    const startFX = () => {
      if (confInterval) return;
      confInterval = window.setInterval(confetti, 260);
      fireInterval = window.setInterval(() => {
        launch();
        if (rnd() < 0.45) launch();
      }, 500);
    };

    const stopFX = () => {
      if (!confInterval) return;
      clearInterval(confInterval);
      clearInterval(fireInterval);
      confInterval = 0;
      fireInterval = 0;
    };

    fxRef.current = {
      burst,
      setActive: (a) => (a ? startFX() : stopFX()),
    };

    resize();
    window.addEventListener("resize", resize);
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      stopFX();
      window.removeEventListener("resize", resize);
      fxRef.current = null;
    };
  }, [reduced]);

  /* ---------------- FX triggers ---------------- */
  useEffect(() => {
    if (reduced || phase !== 1) return;
    const t1 = setTimeout(() => {
      const el = flagWrapRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      fxRef.current?.burst(r.left + r.width / 2, r.top + r.height / 2, NEPAL_COLORS, 120, 7.5, 0.06);
    }, 620);
    const t2 = setTimeout(() => {
      const el = flagWrapRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      fxRef.current?.burst(r.left + r.width / 2, r.top + r.height / 2, ["#ffd27a", "#f0b429"], 44, 4, 0.05);
    }, 1220);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [phase, reduced]);

  useEffect(() => {
    if (reduced || phase !== 2) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(
      setTimeout(() => {
        const word = wordRef.current;
        if (!word) return;
        const els = word.querySelectorAll(".pride-letter");
        els.forEach((el, i) => {
          timers.push(
            setTimeout(() => {
              const r = el.getBoundingClientRect();
              fxRef.current?.burst(
                r.left + r.width / 2,
                r.top + r.height / 2,
                LETTER_GOLD,
                18,
                2.6,
                0.045
              );
            }, 90 * i + 560)
          );
        });
      }, 40)
    );
    timers.push(
      setTimeout(() => {
        const word = wordRef.current;
        if (!word) return;
        const r = word.getBoundingClientRect();
        fxRef.current?.burst(r.left + r.width / 2, r.top + r.height / 2, ["#e31837", "#f0b429"], 90, 5.5, 0.06);
      }, 1280)
    );
    return () => timers.forEach(clearTimeout);
  }, [phase, reduced]);

  useEffect(() => {
    if (reduced) return;
    if (phase === 3) {
      fxRef.current?.setActive(true);
      const t = setTimeout(() => {
        const el = document.querySelector<HTMLElement>(".pride-tagline");
        if (!el) return;
        const r = el.getBoundingClientRect();
        fxRef.current?.burst(r.left + r.width / 2, r.top + r.height / 2, NEPAL_COLORS, 70, 5, 0.06);
      }, 480);
      return () => clearTimeout(t);
    }
    fxRef.current?.setActive(false);
    return undefined;
  }, [phase, reduced]);

  const letters = ["H", "O", "R", "A", "A"];

  return (
    <div className={`pride ${leaving ? "leaving" : ""} ${phase >= 2 ? "shook" : ""}`} aria-hidden="true">
      <canvas ref={canvasRef} className="pride-fire" aria-hidden="true" />
      <div className="pride-grid" aria-hidden="true"></div>
      <div className="pride-scan" aria-hidden="true"></div>
      <div className="pride-mount back" aria-hidden="true"></div>
      <div className="pride-mount front" aria-hidden="true"></div>
      <div className="pride-vignette" aria-hidden="true"></div>

      {!reduced && <span className="pride-kicker">HORAA ESPORTS PRESENTS</span>}

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
            <div className="pride-flag-wrap" ref={flagWrapRef}>
              <span className="pride-ring"></span>
              <span className="pride-ring r2"></span>
              <span className="pride-ring r3"></span>
              <div className="pride-flag">
                <NepalFlag size={240} />
              </div>
              <span className="pride-flag-word">NEPAL</span>
            </div>
          )}

          {phase >= 2 && (
            <div className="pride-brand">
              <span className="pride-starburst"></span>
              <div className="pride-watermark">
                <NepalFlag size={320} />
              </div>
              <span className="pride-flash"></span>
              <div className="pride-word" ref={wordRef}>
                <span className="pride-sheen"></span>
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
            <div className="pride-footer">
              <div className="pride-tagline">
                <span className="pride-flag-mini">
                  <NepalFlag size={30} />
                </span>
                <span className="pride-hash">#FORNEPAL</span>
              </div>
              <div className="pride-chips">
                <span className="pride-chip">NEPAL'S FIRST PMWC SIDE</span>
                <span className="pride-chip">PMNS 2025 CHAMPIONS</span>
                <span className="pride-chip">RIYADH · SAUDI ARABIA</span>
              </div>
              <span className="pride-quote">From the Himalayas to the world stage — carrying the flag to Riyadh.</span>
            </div>
          )}
        </>
      )}

      <span className="pride-corner tl"></span>
      <span className="pride-corner tr"></span>
      <span className="pride-corner bl"></span>
      <span className="pride-corner br"></span>

      <button className="pride-skip" onClick={finish}>
        {reduced ? "ENTER SITE →" : "SKIP INTRO"}
      </button>
    </div>
  );
}
