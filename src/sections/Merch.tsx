import { useEffect, useState } from "react";
import SectionHeading from "../components/SectionHeading";
import Reveal from "../components/Reveal";
import { api } from "../api";
import type { MerchItem } from "../../shared/data";

export default function Merch() {
  const [items, setItems] = useState<MerchItem[]>([]);

  useEffect(() => {
    api.merch().then(setItems).catch(() => setItems([]));
  }, []);

  return (
    <section className="section section-alt" id="merch">
      <div className="container">
        <SectionHeading kicker="// The Gear" title="MERCH STORE" sub="Rep the crimson & gold wherever you drop." />
        <div className="merch-grid" aria-live="polite">
          {items.map((m, i) => (
            <Reveal key={m.badge} delay={i * 60} as="article" className="merch-card">
              <div className="merch-thumb" style={{ background: m.bg }}>
                <span className="merch-badge">{m.badge}</span>
                <span className="merch-emoji">{m.emoji}</span>
              </div>
              <div className="merch-info">
                <h3 className="merch-title">{m.title}</h3>
                <p className="merch-desc">{m.desc}</p>
                <div className="merch-foot">
                  <span className="merch-price">{m.price}</span>
                  <a className="btn btn-ghost btn-sm" href="https://shop.horaaesports.com.np/" target="_blank" rel="noopener">
                    Buy Now
                  </a>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
