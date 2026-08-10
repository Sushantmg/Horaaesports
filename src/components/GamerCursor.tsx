import { useEffect, useRef, useState } from "react";

const INTERACTIVE = "a, button, [role='button'], input, textarea, select, label, summary, [data-cursor]";
const TRAIL_LEN = 8;

export default function GamerCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;
    setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const cursor = cursorRef.current;
    const ring = ringRef.current;
    const trail = trailRef.current;
    if (!cursor || !ring || !trail) return;

    document.documentElement.classList.add("has-cursor");

    const dots = Array.from(trail.children) as HTMLSpanElement[];
    const history: Array<{ x: number; y: number }> = [];
    let x = -200;
    let y = -200;
    let rx = -200;
    let ry = -200;
    let raf = 0;

    const setHover = (hovering: boolean) => {
      cursor.classList.toggle("hover", hovering);
      ring.classList.toggle("hover", hovering);
    };

    const onMove = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      history.push({ x, y });
      if (history.length > TRAIL_LEN) history.shift();
      const t = e.target as HTMLElement | null;
      setHover(!!t?.closest?.(INTERACTIVE));
    };

    const onDown = () => cursor.classList.add("recoil");
    const onUp = () => cursor.classList.remove("recoil");
    const onLeave = () => {
      x = -200;
      y = -200;
      history.length = 0;
      setHover(false);
    };

    const loop = () => {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      for (let i = 0; i < dots.length; i++) {
        const h = history[Math.min(i, history.length - 1)];
        if (h) dots[i].style.transform = `translate3d(${h.x}px, ${h.y}px, 0)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("mouseleave", onLeave);
      document.documentElement.classList.remove("has-cursor");
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div ref={cursorRef} className="gc-cursor" aria-hidden="true">
        <span className="gc-core">
          <i></i>
          <i></i>
          <i></i>
          <i></i>
          <b></b>
        </span>
      </div>
      <div ref={ringRef} className="gc-ring" aria-hidden="true"></div>
      <div ref={trailRef} className="gc-trail" aria-hidden="true">
        {Array.from({ length: TRAIL_LEN }, (_, i) => (
          <span key={i}></span>
        ))}
      </div>
    </>
  );
}
