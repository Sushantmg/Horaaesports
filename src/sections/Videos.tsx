import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import SectionHeading from "../components/SectionHeading";
import Reveal from "../components/Reveal";
import { api } from "../api";
import type { VideoItem } from "../../shared/data";

const YT_THUMB = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
const YT_EMBED = (id: string) => `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`;

export default function Videos({ heading = true, limit, link }: { heading?: boolean; limit?: number; link?: boolean }) {
  const [items, setItems] = useState<VideoItem[]>([]);
  const [active, setActive] = useState<VideoItem | null>(null);

  useEffect(() => {
    api.videos().then(setItems).catch(() => setItems([]));
  }, []);

  const visible = useMemo(() => {
    if (!limit) return items;
    const featured = items.filter((v) => v.featured);
    const rest = items.filter((v) => !v.featured);
    return [...featured, ...rest].slice(0, limit);
  }, [items, limit]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setActive(null);
    window.addEventListener("keydown", onKey);
    document.body.classList.toggle("no-scroll", !!active);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.classList.remove("no-scroll");
    };
  }, [active]);

  return (
    <section className="section" id="videos">
      <div className="container">
        {heading && (
          <SectionHeading
            kicker="// THE REEL"
            title="VIDEOS"
            sub="Watch parties, highlights and interviews — straight from the drop zone."
          />
        )}
        <div className="videos-grid" aria-live="polite">
          {visible.map((v, i) => (
            <Reveal key={v.id} delay={i * 60} as="article" className="video-card">
              <button className="video-thumb" onClick={() => setActive(v)} aria-label={`Play ${v.title}`}>
                <img src={YT_THUMB(v.id)} alt={v.title} loading="lazy" />
                <span className="video-play">▶</span>
                {v.tag && <span className="video-tag-badge">{v.tag}</span>}
              </button>
              <div className="video-body">
                <h3 className="video-title">{v.title}</h3>
                <p className="video-meta">
                  {v.channel} · {v.meta}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
        {link && (
          <Reveal className="section-more">
            <Link className="btn btn-ghost" to="/videos">
              VIEW ALL VIDEOS <span>→</span>
            </Link>
          </Reveal>
        )}
      </div>

      {active && (
        <div className="video-modal" role="dialog" aria-modal="true" aria-label={active.title} onClick={() => setActive(null)}>
          <div className="video-modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="video-modal-close" onClick={() => setActive(null)} aria-label="Close video">
              ✕
            </button>
            <iframe src={YT_EMBED(active.id)} title={active.title} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen />
            <div className="video-modal-info">
              <h3>{active.title}</h3>
              <p>
                {active.channel} · {active.meta}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
