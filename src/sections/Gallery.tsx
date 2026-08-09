import { useEffect, useState } from "react";
import SectionHeading from "../components/SectionHeading";
import Reveal from "../components/Reveal";
import { api } from "../api";
import type { GalleryItem } from "../../shared/data";

export default function Gallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);

  useEffect(() => {
    api.gallery().then(setItems).catch(() => setItems([]));
  }, []);

  return (
    <section className="section" id="gallery">
      <div className="container">
        <SectionHeading kicker="// The Frames" title="GALLERY" sub="Moments from the stage, the scrims, and the grind." />
        <div className="gallery-grid" aria-live="polite">
          {items.map((g, i) => (
            <Reveal key={g.title} delay={i * 60} as="figure" className="gallery-item" >
              <div className="gallery-bg" style={{ background: g.bg }}>
                <span className="gallery-zoom" aria-hidden="true">⤢</span>
                <span className="thumb-emoji">{g.emoji}</span>
              </div>
              <figcaption className="gallery-info">
                <span className="gallery-tag">{g.tag}</span>
                <div className="gallery-title">{g.title}</div>
              </figcaption>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
