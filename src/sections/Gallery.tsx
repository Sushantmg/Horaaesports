import { useEffect, useMemo, useRef, useState } from "react";
import SectionHeading from "../components/SectionHeading";
import Reveal from "../components/Reveal";
import { DataEmpty, DataError, DataSkeleton } from "../components/DataState";
import { useAsyncData } from "../lib/useAsyncData";
import { api } from "../api";
import type { GalleryItem } from "../../shared/data";

export default function Gallery({ heading = true }: { heading?: boolean }) {
  const { data, status, error, retry } = useAsyncData<GalleryItem[]>(() => api.gallery());
  const items = data ?? [];
  const [active, setActive] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const photos = useMemo(() => items.filter((g) => g.img), [items]);

  useEffect(() => {
    if (active === null) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
      if (e.key === "ArrowRight") setActive((a) => (a === null ? a : (a + 1) % photos.length));
      if (e.key === "ArrowLeft") setActive((a) => (a === null ? a : (a - 1 + photos.length) % photos.length));
    };
    window.addEventListener("keydown", onKey);
    document.body.classList.add("no-scroll");
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.classList.remove("no-scroll");
    };
  }, [active, photos.length]);

  const current = active !== null ? photos[active] : null;

  return (
    <section className="section" id="gallery">
      <div className="container">
        {heading && (
          <SectionHeading kicker="// The Frames" title="GALLERY" sub="Moments from the stage, the scrims, and the grind." />
        )}
        {status === "loading" && <DataSkeleton count={6} className="gallery-grid" label="Loading gallery" />}
        {status === "error" && <DataError label="Gallery" message={error} onRetry={retry} />}
        {status === "success" && items.length === 0 && (
          <DataEmpty title="No frames yet" hint="Stage photos and bootcamp moments land here after the next event." />
        )}
        {status === "success" && items.length > 0 && (
          <div className="gallery-grid" aria-live="polite">
            {items.map((g, i) => (
              <Reveal key={g.title} delay={i * 60} as="figure" className="gallery-item spotlight">
                <div
                  className={`gallery-bg${g.img ? " has-photo" : ""}`}
                  onClick={g.img ? () => setActive(photos.indexOf(g)) : undefined}
                  onKeyDown={
                    g.img
                      ? (e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            setActive(photos.indexOf(g));
                          }
                        }
                      : undefined
                  }
                  role={g.img ? "button" : undefined}
                  tabIndex={g.img ? 0 : undefined}
                  aria-haspopup={g.img ? "dialog" : undefined}
                  aria-label={g.img ? `Open photo: ${g.title}` : undefined}
                >
                  {g.img ? (
                    <img src={g.img} alt={g.title} loading="lazy" className="gallery-photo" />
                  ) : (
                    <span className="thumb-emoji">{g.emoji}</span>
                  )}
                  {g.img && (
                    <span className="gallery-zoom" aria-hidden="true">
                      ⤢
                    </span>
                  )}
                </div>
                <figcaption className="gallery-info">
                  <span className="gallery-tag">{g.tag}</span>
                  <div className="gallery-title">{g.title}</div>
                </figcaption>
              </Reveal>
            ))}
          </div>
        )}
      </div>

      {current && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={current.title} onClick={() => setActive(null)}>
          <div className="lightbox-backdrop" />
          <button ref={closeRef} className="lightbox-close" aria-label="Close" onClick={() => setActive(null)}>
            ✕
          </button>
          <button
            className="lightbox-nav lightbox-prev"
            aria-label="Previous photo"
            onClick={(e) => {
              e.stopPropagation();
              setActive((active! - 1 + photos.length) % photos.length);
            }}
          >
            ‹
          </button>
          <button
            className="lightbox-nav lightbox-next"
            aria-label="Next photo"
            onClick={(e) => {
              e.stopPropagation();
              setActive((active! + 1) % photos.length);
            }}
          >
            ›
          </button>
          <figure className="lightbox-stage" onClick={(e) => e.stopPropagation()}>
            <img key={active} className="lightbox-img" src={current.img} alt={current.title} />
            <figcaption className="lightbox-cap">
              <span className="gallery-tag">{current.tag}</span>
              <span className="lightbox-title">{current.title}</span>
              <span className="lightbox-count">
                {active! + 1} / {photos.length}
              </span>
            </figcaption>
          </figure>
        </div>
      )}
    </section>
  );
}
