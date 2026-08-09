import { useEffect, useState } from "react";
import SectionHeading from "../components/SectionHeading";
import Reveal from "../components/Reveal";
import { api } from "../api";
import type { Achievement } from "../../shared/data";

export default function Achievements({ heading = true }: { heading?: boolean }) {
  const [items, setItems] = useState<Achievement[]>([]);

  useEffect(() => {
    api.achievements().then(setItems).catch(() => setItems([]));
  }, []);

  return (
    <section className="section" id="achievements">
      <div className="container">
        {heading && (
          <SectionHeading
            kicker="// The Legacy"
            title="ACHIEVEMENTS"
            sub="A record that shook Nepali esports — and put us on the world map."
          />
        )}
        <div className="bento">
          {items.map((a, i) => (
            <Reveal
              key={a.title}
              delay={i * 60}
              className={`bento-card ${a.hero ? "bento-hero" : ""} ${a.wide ? "bento-wide" : ""}`}
            >
              <div className="bento-icon">{a.icon}</div>
              <span className="bento-tag">{a.tag}</span>
              <h3 dangerouslySetInnerHTML={{ __html: a.title.replace(" at ", "<br/>at ") }} />
              <p>{a.p}</p>
              {a.sub && (
                <div className="bento-meta">
                  <span>{a.sub}</span>
                </div>
              )}
              {a.track && (
                <div className="bento-row">
                  <div className="bento-track">
                    {a.track.map((n) => (
                      <span key={n}>{n}</span>
                    ))}
                  </div>
                </div>
              )}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
