import { useRef, type ReactNode, type PointerEvent } from "react";
import { setGlowVars } from "../lib/usePointerGlow";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  max?: number;
}

export default function TiltCard({ children, className = "", max = 8 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(800px) rotateY(${px * max}deg) rotateX(${py * -max}deg) translateY(-8px)`;
    setGlowVars(el, e.clientX, e.clientY);
  };

  const onLeave = () => {
    const el = ref.current;
    if (el) el.style.transform = "perspective(800px) rotateY(0) rotateX(0) translateY(0)";
  };

  return (
    <div ref={ref} className={`tilt spotlight ${className}`} onPointerMove={onMove} onPointerLeave={onLeave}>
      {children}
    </div>
  );
}
