import { useEffect, useState } from "react";
import SectionHeading from "../components/SectionHeading";
import Reveal from "../components/Reveal";
import { api } from "../api";
import type { Sponsor } from "../../shared/data";

export default function Sponsors() {
  const [items, setItems] = useState<Sponsor[]>([]);

  useEffect(() => {
    api.sponsors().then(setItems).catch(() => setItems([]));
  }, []);

  return (
    <section className="section" id="sponsors">
      <div className="container">
        <SectionHeading
          kicker="// The Support"
          title="SPONSORS & PARTNERS"
          sub="Champions stand on the shoulders of their partners."
        />
        <Reveal className="sponsors">
          {items.map((s) => (
            <a className="sponsor" key={s.name} href={s.url} target="_blank" rel="noopener">
              {s.logo ? (
                <img className="sponsor-logo" src={s.logo} alt={s.name} loading="lazy" />
              ) : (
                <span className="sponsor-icon">{s.icon}</span>
              )}
              <span>{s.name}</span>
            </a>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
