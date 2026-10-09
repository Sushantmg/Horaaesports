import { useEffect, useRef } from "react";
import NepalFlag from "../components/NepalFlag";

const ITEMS = [
  "HORAA ESPORTS",
  "NEPAL'S 1ST PMWC TEAM",
  "CHICKEN DINNER",
  "ERANGEL AWAITS",
  "ZONE 5 CLOSING",
  "AIRDROP INCOMING",
  "PUBG MOBILE",
  "#FORNEPAL",
];

export default function Ticker() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let anims: Animation[] = [];
    let raf = 0;
    let last = window.scrollY;
    let lastT = performance.now();
    let rate = 1;
    let visible = true;

    const ensure = () => {
      if (anims.length === 0) anims = track.getAnimations();
    };

    const tick = () => {
      const now = performance.now();
      const y = window.scrollY;
      const dt = Math.max(16, now - lastT);
      const velocity = ((y - last) / dt) * 1000;
      const target = 1 + Math.min(3.5, Math.abs(velocity) / 450);
      rate += (target - rate) * 0.12;
      if (anims.length === 0) ensure();
      anims.forEach((a) => {
        a.playbackRate = rate;
      });
      last = y;
      lastT = now;
      raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      (entries) => {
        const next = entries[0]?.isIntersecting ?? true;
        if (next && !visible) {
          visible = true;
          last = window.scrollY;
          lastT = performance.now();
          anims = [];
          raf = requestAnimationFrame(tick);
        } else if (!next && visible) {
          visible = false;
          cancelAnimationFrame(raf);
        }
      },
      { rootMargin: "100px" }
    );
    io.observe(track);

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      anims.forEach((a) => {
        a.playbackRate = 1;
      });
    };
  }, []);

  const Row = () => (
    <>
      <span>
        <NepalFlag size={16} /> <span className="tick-label">NEPAL'S 1ST PMWC TEAM</span> <span className="tick-sep">✕</span>
      </span>
      {ITEMS.map((t, i) => (
        <span key={i}>
          {t} <span className="tick-sep">✕</span>
        </span>
      ))}
    </>
  );
  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker-track" ref={trackRef}>
        <span>
          <Row /> <Row />
        </span>
      </div>
    </div>
  );
}
