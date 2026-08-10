import { useEffect, useRef } from "react";

export default function ScrollProgress() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      if (fillRef.current) fillRef.current.style.transform = `scaleX(${p})`;
      if (pctRef.current) pctRef.current.textContent = String(Math.round(p * 100));
      if (wrapRef.current) wrapRef.current.classList.toggle("show", window.scrollY > 60);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div ref={wrapRef} className="xpbar" role="progressbar" aria-label="Page scroll progress" aria-valuemin={0} aria-valuemax={100}>
      <div className="xpbar-track">
        <div ref={fillRef} className="xpbar-fill"></div>
      </div>
      <span className="xpbar-lvl">
        LVL <b ref={pctRef}>0</b>
      </span>
    </div>
  );
}
