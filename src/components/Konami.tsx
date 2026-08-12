import { useEffect, useRef, useState } from "react";

const SEQUENCE = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
const COLORS = ["#c8102e", "#f0b429", "#003893", "#ffffff", "#ff5c73", "#ffd27a"];

interface Piece {
  id: number;
  left: number;
  top: number;
  size: number;
  color: string;
  delay: number;
  dur: number;
  petal: boolean;
  drift: number;
  rot: number;
}

export default function Konami() {
  const idx = useRef(0);
  const active = useRef(false);
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [show, setShow] = useState(false);
  const [reduced] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const key = e.key.toLowerCase();
      if (key === SEQUENCE[idx.current]) {
        idx.current += 1;
        if (idx.current === SEQUENCE.length) {
          idx.current = 0;
          trigger();
        }
      } else {
        idx.current = key === SEQUENCE[0] ? 1 : 0;
      }
    };

    const trigger = () => {
      if (active.current) return;
      active.current = true;
      const site = document.querySelector<HTMLElement>("#root");
      if (!reduced && site) {
        site.classList.add("cheat-shake");
        window.setTimeout(() => site.classList.remove("cheat-shake"), 900);
      }
      setShow(true);
      setPieces(
        Array.from({ length: reduced ? 0 : 96 }, (_, i) => ({
          id: i,
          left: Math.random() * 100,
          top: Math.random() * 55,
          size: 6 + Math.random() * 9,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          delay: Math.random() * 0.7,
          dur: 1.7 + Math.random() * 1.3,
          petal: Math.random() < 0.55,
          drift: (Math.random() - 0.5) * 220,
          rot: Math.random() * 180,
        }))
      );
      window.setTimeout(() => {
        setShow(false);
        setPieces([]);
        active.current = false;
      }, 3600);
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [reduced]);

  return (
    <>
      {show && (
        <div className="cheat-banner" role="status">
          <span className="cheat-title">CHEAT ACTIVATED</span>
          <span className="cheat-sub">INFINITE CHICKEN DINNERS ENABLED 🍗 #FORNEPAL</span>
        </div>
      )}
      {pieces.map((p) => (
        <span
          key={p.id}
          className={`cheat-particle ${p.petal ? "petal" : ""}`}
          style={{
            left: `${p.left}%`,
            top: `${p.top}vh`,
            width: p.size,
            height: p.petal ? p.size * 1.4 : p.size,
            background: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.dur}s`,
            transform: `rotate(${p.rot}deg)`,
            ["--drift" as string]: `${p.drift}px`,
          }}
        />
      ))}
    </>
  );
}
