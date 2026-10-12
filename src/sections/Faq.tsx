import { useEffect, useRef, useState } from "react";
import SectionHeading from "../components/SectionHeading";
import Reveal from "../components/Reveal";
import { DataEmpty, DataError, DataSkeleton } from "../components/DataState";
import { useAsyncData } from "../lib/useAsyncData";
import { api } from "../api";
import type { Faq } from "../../shared/data";

export default function Faq({ heading = true }: { heading?: boolean }) {
  const { data, status, error, retry } = useAsyncData<Faq[]>(() => api.faqs());
  const items = data ?? [];
  const [open, setOpen] = useState<number | null>(null);
  const [heights, setHeights] = useState<number[]>([]);
  const listRef = useRef<HTMLDivElement>(null);

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
        {status === "loading" && <DataSkeleton count={4} className="faq-list" label="Loading FAQs" />}
        {status === "error" && <DataError label="FAQs" message={error} onRetry={retry} />}
        {status === "success" && items.length === 0 && (
          <DataEmpty title="No FAQs yet" hint="Ping us on contact — we answer fast on match days." />
        )}
        {status === "success" && items.length > 0 && (
          <div className="faq-list" ref={listRef} aria-live="polite">
            {items.map((f, i) => (
              <Reveal key={f.q} className={`faq-item ${open === i ? "open" : ""}`}>
                <button
                  className="faq-q"
                  type="button"
                  onClick={() => toggle(i)}
                  aria-expanded={open === i}
                  aria-controls={`faq-a-${i}`}
                >
                  <span>{f.q}</span>
                  <span className="faq-icon" aria-hidden="true">+</span>
                </button>
                <div
                  id={`faq-a-${i}`}
                  className="faq-a"
                  style={{ maxHeight: open === i ? `${heights[i] ?? 300}px` : "0px" }}
                >
                  <div className="faq-a-inner" dangerouslySetInnerHTML={{ __html: f.a }} />
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
