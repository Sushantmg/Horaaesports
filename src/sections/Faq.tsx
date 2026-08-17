import { useEffect, useState, useRef } from "react";
import SectionHeading from "../components/SectionHeading";
import Reveal from "../components/Reveal";
import { api } from "../api";
import type { Faq } from "../../shared/data";

export default function Faq({ heading = true }: { heading?: boolean }) {
  const [items, setItems] = useState<Faq[]>([]);
  const [open, setOpen] = useState<number | null>(null);
  const [heights, setHeights] = useState<number[]>([]);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.faqs().then(setItems).catch(() => setItems([]));
  }, []);

  useEffect(() => {
    if (!items.length || !listRef.current) return;
    const raf = requestAnimationFrame(() => {
      const inner = listRef.current!.querySelectorAll<HTMLElement>(".faq-a-inner");
      setHeights(Array.from(inner).map((el) => el.scrollHeight));
    });
    return () => cancelAnimationFrame(raf);
  }, [items]);

  const toggle = (i: number) => {
    if (open === i) {
      setOpen(null);
    } else {
      setOpen(i);
    }
  };

  return (
    <section className="section section-alt" id="faq">
      <div className="container">
        {heading && (
          <SectionHeading kicker="// The Intel" title="FAQ" sub="Everything you need to know about the org." />
        )}
        <div className="faq-list" ref={listRef} aria-live="polite">
          {items.map((f, i) => (
            <Reveal key={f.q} className={`faq-item ${open === i ? "open" : ""}`}>
              <button className="faq-q" type="button" onClick={() => toggle(i)}>
                <span>{f.q}</span>
                <span className="faq-icon">+</span>
              </button>
              <div
                className="faq-a"
                style={{ maxHeight: open === i ? `${heights[i] ?? 300}px` : "0px" }}
              >
                <div className="faq-a-inner" dangerouslySetInnerHTML={{ __html: f.a }} />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
