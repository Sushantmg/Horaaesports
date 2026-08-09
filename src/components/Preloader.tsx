import { useEffect, useRef, useState } from "react";
import NepalFlag from "./NepalFlag";

const STAGES: Array<[number, string]> = [
  [0, "CONNECTING TO SERVER"],
  [16, "LOADING ASSETS"],
  [34, "CALIBRATING AIM"],
  [52, "INITIALIZING MAP"],
  [70, "ZONE CLOSING"],
  [88, "ENTERING ERANGEL"],
];

export default function Preloader({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);
  const doneRef = useRef(onDone);

  useEffect(() => {
    doneRef.current = onDone;
  });

  useEffect(() => {
    document.body.classList.add("preload-lock");
    const failsafe = setTimeout(() => {
      document.body.classList.remove("preload-lock");
      setLeaving(true);
      const cb = doneRef.current;
      doneRef.current = () => {};
      if (cb) cb();
      setTimeout(() => setGone(true), 900);
    }, 5000);

    let v = 0;
    let last = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      v += Math.max(3, 78 - v * 0.45) * dt;
      if (v >= 100) {
        v = 100;
        setProgress(100);
        setTimeout(() => {
          document.body.classList.remove("preload-lock");
          setLeaving(true);
          const cb = doneRef.current;
          doneRef.current = () => {};
          if (cb) cb();
        }, 450);
        setTimeout(() => setGone(true), 1450);
        return;
      }
      setProgress(Math.round(v));
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(failsafe);
      document.body.classList.remove("preload-lock");
    };
  }, []);

  if (gone) return null;

  let stage = STAGES[0][1];
  for (const [t, s] of STAGES) if (progress >= t) stage = s;
  if (progress >= 100) stage = "MATCH FOUND — WELCOME, SURVIVOR";

  return (
    <div className={`preloader ${leaving ? "leaving" : ""}`} aria-hidden="true">
      <div className="preloader-grid"></div>
      <div className="preloader-scan"></div>
      <span className="preloader-corner tl"></span>
      <span className="preloader-corner tr"></span>
      <span className="preloader-corner bl"></span>
      <span className="preloader-corner br"></span>

      <div className="preloader-inner">
        <div className="preloader-emblem">
          <NepalFlag size={42} />
        </div>
        <div className="preloader-logo">
          <span className="preloader-brand">HORAA</span>
          <span className="preloader-sub">E S P O R T S</span>
        </div>
        <div className="preloader-tagline">#FORNEPAL</div>
        <div className="preloader-track">
          <div className="preloader-bar" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="preloader-row">
          <span className="preloader-status">
            <span className="pulse-dot"></span> {stage}
          </span>
          <span className="preloader-pct">{progress}%</span>
        </div>
      </div>
    </div>
  );
}
