import { useEffect, useState } from "react";

interface CountdownProps {
  target: string;
  label: string;
}

const pad = (n: number) => String(n).padStart(2, "0");

export default function Countdown({ target, label }: CountdownProps) {
  const [now, setNow] = useState(() => Date.now());
  const [reduced] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const diff = Math.max(0, new Date(target).getTime() - now);
  const live = diff <= 0;
  const d = Math.floor(diff / 86400000);
  const h = Math.floor(diff / 3600000) % 24;
  const m = Math.floor(diff / 60000) % 60;
  const s = Math.floor(diff / 1000) % 60;

  const cells = [
    { v: pad(d), t: "Days" },
    { v: pad(h), t: "Hours" },
    { v: pad(m), t: "Mins" },
    { v: pad(s), t: "Secs" },
  ];

  return (
    <div className={`countdown-box ${live ? "live" : ""}`}>
      <div className="countdown-head">
        <span className="countdown-label">
          {live ? (
            <>
              <span className="cd-live-dot"></span> WE'RE LIVE!
            </>
          ) : (
            label
          )}
        </span>
        <span className="countdown-sub">Riyadh, Saudi Arabia · Follow on official channels</span>
      </div>
      {!live && (
        <div className="countdown-grid">
          {cells.map((c, i) => (
            <div key={c.t} className="cd-group">
              <div className="cd-cell">
                <span key={`${c.t}-${c.v}`} className={`cd-num${reduced ? "" : " flip"}`}>
                  {c.v}
                </span>
                <span className="cd-tag">{c.t}</span>
              </div>
              {i < cells.length - 1 && <span className="cd-sep">:</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
