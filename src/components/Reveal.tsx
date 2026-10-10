import { useEffect, useRef, type ReactNode } from "react";
import { usePointerGlow } from "../lib/usePointerGlow";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "span" | "article" | "li" | "figure";
  [key: string]: unknown;
}

export default function Reveal({ children, delay = 0, className = "", as = "div", ...rest }: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const onPointerMove = usePointerGlow<HTMLElement>();
  const Tag = as as any;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add("revealed");
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
      onPointerMove={onPointerMove}
      {...rest}
    >
      {children}
    </Tag>
  );
}
