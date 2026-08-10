import { useEffect, useRef } from "react";

export default function CrtEffect() {
  const glitchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = glitchRef.current;
    if (!el) return;
    let timer = 0;
    let dead = false;

    const tick = () => {
      timer = window.setTimeout(() => {
        if (dead) return;
        el.classList.add("on");
        window.setTimeout(() => el.classList.remove("on"), 300);
        tick();
      }, 6000 + Math.random() * 9000);
    };
    tick();

    return () => {
      dead = true;
      clearTimeout(timer);
    };
  }, []);

  return (
    <>
      <div className="crt" aria-hidden="true"></div>
      <div className="crt-glitch" ref={glitchRef} aria-hidden="true"></div>
    </>
  );
}
