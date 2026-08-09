import { useEffect, useState } from "react";
import SectionHeading from "../components/SectionHeading";
import Reveal from "../components/Reveal";
import { api } from "../api";
import type { Faq } from "../../shared/data";

export default function Faq({ heading = true }: { heading?: boolean }) {
  const [items, setItems] = useState<Faq[]>([]);
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    api.faqs().then(setItems).catch(() => setItems([]));
  }, []);

  return (
    <section className="section section-alt" id="faq">
      <div className="container">
        {heading && (
          <SectionHeading kicker="// The Intel" title="FAQ" sub="Everything you need to know about the org." />
        )}
        <div className="faq-list" aria-live="polite">
          {items.map((f, i) => (
            <Reveal key={f.q} className={`faq-item ${open === i ? "open" : ""}`}>
              <button className="faq-q" type="button" onClick={() => setOpen(open === i ? null : i)}>
                <span>{f.q}</span>
                <span className="faq-icon">+</span>
              </button>
              <div className="faq-a">
                <div className="faq-a-inner" dangerouslySetInnerHTML={{ __html: f.a }} />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
