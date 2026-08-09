import { Link } from "react-router-dom";
import Reveal from "./Reveal";

interface PageHeaderProps {
  kicker: string;
  title: string;
  sub: string;
  accent?: string;
}

export default function PageHeader({ kicker, title, sub, accent = "THE CAMPAIGN" }: PageHeaderProps) {
  return (
    <header className="page-header">
      <div className="page-grid"></div>
      <div className="page-glow page-glow-a"></div>
      <div className="page-glow page-glow-b"></div>
      <div className="hero-cross"></div>
      <span className="page-stamp">{accent}</span>
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
      <div className="container page-header-inner">
        <Reveal className="page-back">
          <Link to="/">← BACK TO HOME</Link>
        </Reveal>
        <Reveal delay={80}>
          <span className="section-kicker">{kicker}</span>
          <h1 className="page-title">{title}</h1>
          <p className="page-sub">{sub}</p>
        </Reveal>
      </div>
    </header>
  );
}
