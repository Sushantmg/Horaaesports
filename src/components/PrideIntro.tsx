import { useEffect, useRef, useState } from "react";
import NepalFlag from "./NepalFlag";

const PHASES = [1700, 1800, 3000];
const FADE = 900;
const FIRE_COLORS = ["#c8102e", "#f0b429", "#003893", "#ffffff", "#ff5c73", "#ffd27a", "#b01830"];
const NEPAL_COLORS = ["#c8102e", "#f0b429", "#003893", "#ffffff"];
const CRIMSONS = ["#e31837", "#b01830", "#ff4d5e", "#8f1222"];
const WILLOW = ["#f0b429", "#ffd977", "#ffe9a8", "#e31837"];
const LETTER_GOLD = ["#f0b429", "#ffd977", "#e31837", "#ffe9a8"];
const rnd = Math.random;

type Shape = "rect" | "petal";

type P = {
  kind: "spark" | "glitter" | "rocket" | "confetti" | "fuse";
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
  shape: Shape;
};

interface FxApi {
  burst(x: number, y: number, colors: string[], count?: number, power?: number, grav?: number): void;
  finale(): void;
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
      const ec = Math.min(46, Math.floor((width * height) / 36000));
      for (let i = 0; i < ec; i++) {
        embers.push({
          x: rnd() * width,
          y: rnd() * height,
          r: 0.6 + rnd() * 1.5,
          ph: rnd() * Math.PI * 2,
          sway: 10 + rnd() * 34,
          spd: 0.25 + rnd() * 0.65,
        });
      }
    };

    const spark = (p: Partial<P>): P => ({
      kind: "spark",
      x: 0, y: 0, vx: 0, vy: 0, r: 1.6,
      color: "#fff", life: 1, decay: 0.014,
      rot: 0, vrot: 0, grav: 0.06, drag: 0.985,
      tw: 0, ts: 0, ph: 0, sway: 0, w: 0, h: 0, targetY: 0,
      shape: "rect",
      ...p,
    });

    const sphereBurst = (x: number, y: number, colors: string[], count = 60, power = 5, grav = 0.06) => {
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
      for (let i = 0; i < count * 0.5; i++) {
        const ang = rnd() * Math.PI * 2;
        const sp = power * (0.12 + rnd() * 0.55);
        parts.push(
          spark({
            kind: "glitter",
            x, y,
            vx: Math.cos(ang) * sp,
            vy: Math.sin(ang) * sp,
            r: 0.5 + rnd() * 1.2,
            color: colors[i % colors.length],
            decay: 0.005 + rnd() * 0.01,
            tw: rnd() * Math.PI * 2,
            ts: 0.08 + rnd() * 0.16,
            grav: 0.012,
          })
        );
      }
    };

    const ringBurst = (x: number, y: number, colors: string[], power = 5) => {
      const n = 52;
      for (let i = 0; i < n; i++) {
        const ang = (i / n) * Math.PI * 2 + rnd() * 0.1;
        const sp = power * (0.9 + rnd() * 0.35);
        parts.push(
          spark({
            kind: "spark",
            x, y,
            vx: Math.cos(ang) * sp,
            vy: Math.sin(ang) * sp,
            r: 1.3 + rnd() * 1.6,
            color: colors[i % colors.length],
            decay: 0.012 + rnd() * 0.016,
            grav: 0.045,
            drag: 0.99,
          })
        );
      }
      for (let i = 0; i < 22; i++) {
        const ang = rnd() * Math.PI * 2;
        const sp = power * 0.9;
        parts.push(
          spark({
            kind: "glitter",
            x, y,
            vx: Math.cos(ang) * sp,
            vy: Math.sin(ang) * sp,
            r: 0.6 + rnd() * 1,
            color: "#fff",
            decay: 0.005 + rnd() * 0.008,
            tw: rnd() * Math.PI * 2,
            ts: 0.1 + rnd() * 0.14,
            grav: 0.01,
          })
        );
      }
    };

    const willowBurst = (x: number, y: number, power = 5) => {
      const n = 64;
      for (let i = 0; i < n; i++) {
        const ang = (i / n) * Math.PI * 2 + rnd() * 0.28;
        const sp = power * (0.5 + rnd() * 0.55);
        parts.push(
          spark({
            kind: "spark",
            x, y,
            vx: Math.cos(ang) * sp * 0.6,
            vy: Math.sin(ang) * sp,
            r: 1 + rnd() * 1.6,
            color: WILLOW[i % WILLOW.length],
            decay: 0.008 + rnd() * 0.012,
            grav: 0.13,
            drag: 0.985,
          })
        );
      }
    };

    const explode = (x: number, y: number, color: string) => {
      const colors = [color, "#fff", "#ffd27a"];
      const roll = rnd();
      if (roll < 0.22) {
        ringBurst(x, y, colors, 4.5 + rnd() * 2);
      } else if (roll < 0.4) {
        willowBurst(x, y, 4.5 + rnd() * 2);
      } else {
        sphereBurst(x, y, colors, 95, 6.5, 0.06);
        if (rnd() < 0.55) sphereBurst(x, y, [color], 32, 3, 0.05);
      }
      if (rnd() < 0.35) {
        parts.push(
          spark({
            kind: "fuse",
            x, y,
            life: 0.28 + rnd() * 0.22,
            decay: 0,
            r: 1,
            color,
          })
        );
      }
    };

    const confetti = (count = 14) => {
      for (let i = 0; i < count; i++) {
        const petal = rnd() < 0.62;
        const colors = petal ? CRIMSONS : NEPAL_COLORS;
        parts.push(
          spark({
            kind: "confetti",
            shape: petal ? "petal" : "rect",
            x: rnd() * width,
            y: -20 - rnd() * 60,
            vx: (rnd() - 0.5) * 0.6,
            vy: 1.4 + rnd() * 2,
            w: petal ? 6 + rnd() * 5 : 4 + rnd() * 5,
            h: petal ? 10 + rnd() * 9 : 7 + rnd() * 7,
            rot: rnd() * Math.PI * 2,
            vrot: (rnd() - 0.5) * 0.26,
            color: colors[Math.floor(rnd() * colors.length)],
            ph: rnd() * Math.PI * 2,
            sway: 0.6 + rnd() * 1.7,
          })
        );
      }
    };

    const launch = () => {
      const c = 2 + (rnd() < 0.5 ? 1 : 0);
      for (let i = 0; i < c; i++) {
        parts.push(
          spark({
            kind: "rocket",
            x: width * (0.1 + rnd() * 0.8),
            y: height + 4,
            vx: (rnd() - 0.5) * 1,
            vy: -(8 + rnd() * 3.8),
            r: 2,
            color: FIRE_COLORS[Math.floor(rnd() * FIRE_COLORS.length)],
            targetY: height * (0.08 + rnd() * 0.46),
          })
        );
      }
    };

    const finale = () => {
      for (let i = 0; i < 9; i++) {
        parts.push(
          spark({
            kind: "rocket",
            x: width * (0.06 + i * 0.11 + rnd() * 0.04),
            y: height + 4,
            vx: (rnd() - 0.5) * 1.4,
            vy: -(9 + rnd() * 4),
            r: 2.2,
            color: FIRE_COLORS[i % FIRE_COLORS.length],
            targetY: height * (0.06 + rnd() * 0.52),
          })
        );
      }
      const cx = width / 2;
      const cy = height * 0.3;
      sphereBurst(cx, cy, NEPAL_COLORS, 140, 8, 0.06);
      ringBurst(cx, cy, ["#f0b429", "#ffffff"], 6);
      confetti(34);
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

        if (p.kind === "fuse") {
          p.life -= dt;
          if (p.life <= 0) {
            explode(p.x, p.y, p.color);
            parts.splice(i, 1);
          }
          continue;
        }

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

          if (rnd() < 0.75) {
            parts.push(
              spark({
                kind: "spark",
                x: p.x + (rnd() - 0.5) * 2,
                y: p.y + (rnd() - 0.5) * 2,
                vx: (rnd() - 0.5) * 0.8,
                vy: (rnd() - 0.5) * 0.8,
                r: 0.7 + rnd() * 1.2,
                color: p.color,
                life: 0.5,
                decay: 0.1 + rnd() * 0.08,
                grav: 0.02,
              })
            );
          }

          if (p.y <= p.targetY || p.vy > -0.4) {
            explode(p.x, p.y, p.color);
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
          ctx.globalAlpha = 0.9;
          ctx.fillStyle = p.color;
          if (p.shape === "petal") {
            ctx.beginPath();
            ctx.moveTo(0, -p.h / 2);
            ctx.quadraticCurveTo(p.w, -p.h / 4, p.w * 0.8, p.h / 4);
            ctx.quadraticCurveTo(0, p.h / 2, -p.w * 0.8, p.h / 4);
            ctx.quadraticCurveTo(-p.w, -p.h / 4, 0, -p.h / 2);
            ctx.fill();
          } else {
            ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
          }
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
      confInterval = window.setInterval(() => confetti(), 200);
      fireInterval = window.setInterval(() => {
        launch();
        if (rnd() < 0.5) launch();
      }, 360);
    };

    const stopFX = () => {
      if (!confInterval) return;
      clearInterval(confInterval);
      clearInterval(fireInterval);
      confInterval = 0;
      fireInterval = 0;
    };

    fxRef.current = {
      burst: (x, y, colors, count = 60, power = 5, grav = 0.06) => sphereBurst(x, y, colors, count, power, grav),
      finale,
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
      fxRef.current?.burst(r.left + r.width / 2, r.top + r.height / 2, NEPAL_COLORS, 130, 7.5, 0.06);
    }, 620);
    const t2 = setTimeout(() => {
      const el = flagWrapRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      fxRef.current?.burst(r.left + r.width / 2, r.top + r.height / 2, ["#ffd27a", "#f0b429"], 50, 4, 0.05);
    }, 1250);
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
              fxRef.current?.burst(r.left + r.width / 2, r.top + r.height / 2, LETTER_GOLD, 18, 2.6, 0.045);
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
        fxRef.current?.burst(r.left + r.width / 2, r.top + r.height / 2, ["#e31837", "#f0b429"], 95, 5.5, 0.06);
      }, 1350)
    );
    return () => timers.forEach(clearTimeout);
  }, [phase, reduced]);

  useEffect(() => {
    if (reduced) return;
    if (phase === 3) {
      fxRef.current?.setActive(true);
      const t = setTimeout(() => {
        fxRef.current?.finale();
        const el = document.querySelector<HTMLElement>(".pride-tagline");
        if (!el) return;
        const r = el.getBoundingClientRect();
        fxRef.current?.burst(r.left + r.width / 2, r.top + r.height / 2, NEPAL_COLORS, 80, 5, 0.06);
      }, 420);
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
              <span className="pride-flag-word">नेपाल</span>
              <span className="pride-flag-sub">N E P A L</span>
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
              <span className="pride-deva">नेपालको गर्व</span>
            </div>
          )}

          {phase >= 3 && (
            <>
              <div className="pride-footer">
                <div className="pride-tagline">
                  <span className="pride-flag-mini">
                    <NepalFlag size={30} />
                  </span>
                  <span className="pride-hash">#FORNEPAL</span>
                </div>
                <div className="pride-chips">
                  <span className="pride-chip">FIRST NEPALI TEAM AT PMWC</span>
                  <span className="pride-chip">PMNS 2025 CHAMPIONS</span>
                  <span className="pride-chip">जय नेपाल · JAI NEPAL</span>
                </div>
                <span className="pride-motto">जननी जन्मभूमिश्च स्वर्गादपि गरीयसी</span>
                <span className="pride-motto-en">Mother &amp; Motherland are greater than heaven</span>
                <span className="pride-quote">From the Himalayas to the world stage — carrying the flag to Riyadh.</span>
              </div>

              <div className="pride-facts">
                <span>सगरमाथा · SAGARMATHA 8,848 M</span>
                <span>WORLD'S ONLY NON-RECTANGULAR FLAG</span>
                <span>KINGDOM OF NEPAL · EST. 1768</span>
              </div>
            </>
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
