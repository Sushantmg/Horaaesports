import { useEffect, useRef, useState } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import Counter from "../components/Counter";
import Reveal from "../components/Reveal";
import NepalFlag from "../components/NepalFlag";
import { api } from "../api";
import type { Stat } from "../../shared/data";

function scrollToId(e: ReactMouseEvent, id: string) {
  e.preventDefault();
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const [stats, setStats] = useState<Stat[]>([]);

  useEffect(() => {
    api.heroStats().then(setStats).catch(() => setStats([]));
  }, []);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero || !window.matchMedia("(pointer: fine)").matches) return;
    const onMove = (e: globalThis.MouseEvent) => {
      const x = e.clientX / window.innerWidth - 0.5;
      const y = e.clientY / window.innerHeight - 0.5;
      hero.querySelectorAll<HTMLElement>(".hero-glow").forEach((glow, i) => {
        const depth = i % 2 === 0 ? 26 : -22;
        glow.style.translate = `${x * depth}px ${y * depth}px`;
      });
      const ring = hero.querySelector<HTMLElement>(".hero-ring");
      if (ring) ring.style.transform = `translate(calc(-50% + ${x * 18}px), calc(-50% + ${y * 18}px))`;
    };
    hero.addEventListener("mousemove", onMove);
    return () => hero.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const onScroll = () => {
      const y = window.scrollY;
      const mtn = hero.querySelector<HTMLElement>(".hero-mountains");
      const emb = hero.querySelector<HTMLElement>(".hero-emblem");
      const grid = hero.querySelector<HTMLElement>(".hero-grid");
      if (mtn) mtn.style.translate = `0 ${Math.min(y * 0.4, 140)}px`;
      if (emb) emb.style.translate = `0 ${y * 0.2}px`;
      if (grid) grid.style.opacity = `${Math.max(0, 1 - y / 800)}`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="hero" id="home" ref={heroRef}>
      <div className="hero-grid"></div>
      <div className="hero-scan"></div>

      <div className="hero-aurora" aria-hidden="true">
        <span className="aurora-1"></span>
        <span className="aurora-2"></span>
        <span className="aurora-3"></span>
      </div>

      <span className="hero-shoot shoot-1" aria-hidden="true"></span>
      <span className="hero-shoot shoot-2" aria-hidden="true"></span>

      <div className="hero-zone" aria-hidden="true">
        <span className="zone-ring z1"></span>
        <span className="zone-ring z2"></span>
        <span className="zone-ring z3"></span>
      </div>

      <div className="hero-emblem" aria-hidden="true">
        <NepalFlag size={320} />
      </div>

      <div className="hero-glow hero-glow-1"></div>
      <div className="hero-glow hero-glow-2"></div>
      <span className="hero-orb orb-1"></span>
      <span className="hero-orb orb-2"></span>
      <span className="hero-orb orb-3"></span>
      <span className="hero-orb orb-4"></span>

      <div className="hero-cross"></div>

      <div className="hero-flag" aria-hidden="true">
        <NepalFlag size={46} />
      </div>

      <div className="hero-killfeed">
        HORAA <b>✕</b> YOU — #FORNEPAL
      </div>

      <div className="hero-mountains" aria-hidden="true">
        <svg viewBox="0 0 1440 240" preserveAspectRatio="none">
          <path
            fill="rgba(0, 56, 147, 0.28)"
            d="M0 240 L0 170 L140 120 L240 180 L360 90 L470 170 L580 140 L700 70 L820 160 L940 110 L1060 175 L1180 130 L1320 185 L1440 150 L1440 240 Z"
          />
          <path
            fill="#0b0a13"
            d="M0 240 L0 212 L150 162 L260 206 L420 150 L560 206 L700 170 L840 210 L1000 176 L1140 216 L1290 186 L1440 210 L1440 240 Z"
          />
        </svg>
      </div>

      <div className="hero-stamp">CHICKEN DINNER</div>

      <div className="container hero-inner">
        <div className="hero-ring"></div>
        <Reveal className="hero-badge">
          <span className="pulse-dot"></span> <NepalFlag size={20} /> NEPAL'S PREMIER PUBG MOBILE ORGANIZATION
        </Reveal>

        <Reveal delay={100}>
          <h1 className="hero-title">
            <span className="line">HORAA</span>
            <span className="line gold">ESPORTS</span>
          </h1>
        </Reveal>

        <Reveal delay={200}>
          <p className="hero-sub">
            From the Himalayas to the world stage. The first Nepali team to qualify for the{" "}
            <strong>PUBG Mobile World Cup</strong> — forged in crimson, driven by gold.
          </p>
        </Reveal>

        <Reveal delay={300} className="hero-cta">
          <a href="#roster" className="btn btn-primary" onClick={(e) => scrollToId(e, "roster")}>
            Meet the Squad
          </a>
          <a href="#contact" className="btn btn-ghost" onClick={(e) => scrollToId(e, "contact")}>
            Partner With Us
          </a>
        </Reveal>

        <Reveal delay={400}>
          <div className="hero-stats">
            {stats.map((s) => (
              <div className="stat" key={s.label}>
                <span className="stat-num">
                  <Counter value={s.value} prefix={s.prefix || ""} suffix={s.suffix} />
                </span>
                <span className="stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      <div className="hero-scroll">
        <span>SCROLL</span>
        <div className="scroll-line"></div>
      </div>
    </section>
  );
}
