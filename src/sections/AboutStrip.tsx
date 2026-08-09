import { Link } from "react-router-dom";
import Reveal from "../components/Reveal";

const LINKS = [
  { label: "Meet the Squad", to: "/roster" },
  { label: "Our Legacy", to: "/achievements" },
  { label: "Watch Highlights", to: "/videos" },
  { label: "Get Merch", to: "https://shop.horaaesports.com.np", external: true },
];

export default function AboutStrip() {
  return (
    <section className="about-strip">
      <div className="container">
        <div className="about-grid">
          <Reveal className="about-copy">
            <span className="section-kicker">// FOR NEPAL</span>
            <h2 className="about-title">From the Himalayas to the world stage.</h2>
            <p>
              Horaa Esports is Nepal's premier PUBG Mobile organization — the first Nepali squad to ever
              qualify for the PUBG Mobile World Cup. Five hunters, one flag, and a nation watching from the
              stands. Together we grow, stronger every day.
            </p>
          </Reveal>
          <Reveal delay={120} className="about-actions">
            {LINKS.map((l) =>
              l.external ? (
                <a key={l.label} className="btn btn-ghost" href={l.to} target="_blank" rel="noopener">
                  {l.label} <span>→</span>
                </a>
              ) : (
                <Link key={l.label} className="btn btn-ghost" to={l.to}>
                  {l.label} <span>→</span>
                </Link>
              )
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
