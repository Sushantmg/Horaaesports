import { useEffect, useRef, useState } from "react";
import SectionHeading from "../components/SectionHeading";
import { api } from "../api";
import type { GalleryItem, Player } from "../../shared/data";

type Scene = {
  kind: "squad" | "gallery";
  title: string;
  tag: string;
  bg: string;
  img?: string;
  players?: Player[];
};

const DURATION = 4500;

export default function Showreel() {
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced.current) setPaused(true);
  }, []);

  useEffect(() => {
    let alive = true;
    Promise.all([api.gallery(), api.players()])
      .then(([gallery, players]) => {
        if (!alive) return;
        const lineup: Scene = {
          kind: "squad",
          title: "Five Hunters, One Nation",
          tag: "The Squad",
          bg: "linear-gradient(135deg, #0f2f7a, #1d4ed8)",
          players: players.slice(0, 5),
        };
        const shots: Scene[] = gallery
          .filter((g: GalleryItem) => g.img)
          .map((g: GalleryItem) => ({
            kind: "gallery",
            title: g.title,
            tag: g.tag,
            bg: g.bg,
            img: g.img,
          }));
        setScenes([lineup, ...shots]);
      })
      .catch(() => {
        /* leave empty if data can't be loaded */
      });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (paused || scenes.length < 2) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % scenes.length), DURATION);
    return () => clearInterval(id);
  }, [paused, scenes.length]);

  if (scenes.length === 0) return null;
  const scene = scenes[idx];

  return (
    <section className="showreel" id="showreel">
      <div className="container">
        <SectionHeading kicker="// The Montage" title="SQUAD SHOWREEL" sub="A minute with the squad — champions, teammates, and the grind between trophies." />
      </div>

      <div className="showreel-stage">
        {scenes.map((s, i) => (
          <div
            key={s.title}
            className={`showreel-slide ${i === idx ? "active" : ""}`}
            style={{ background: s.bg }}
          >
            {i === idx && s.kind === "gallery" && s.img && (
              <img key={`g${idx}`} src={s.img} alt={s.title} className={`showreel-img kb-${idx % 3}`} />
            )}
            {i === idx && s.kind === "squad" && s.players && (
              <div key={`s${idx}`} className="showreel-lineup">
                {s.players.map((p, pi) => (
                  <figure key={p.slug} className="showreel-player" style={{ animationDelay: `${pi * 110}ms` }}>
                    <div className="showreel-player-photo">
                      <img src={p.photo} alt={`${p.ign} — ${p.name}`} loading="lazy" />
                    </div>
                    <figcaption className="showreel-player-meta">
                      <span className="showreel-player-ign">{p.ign}</span>
                      <span className="showreel-player-role">{p.role}</span>
                    </figcaption>
                  </figure>
                ))}
              </div>
            )}
            <div className="showreel-shade"></div>
          </div>
        ))}

        <div className="showreel-scan" aria-hidden="true"></div>
        <div className="showreel-vignette" aria-hidden="true"></div>

        <div className="showreel-hud">
          <span className="showreel-hud-label">REC ● LIVE</span>
          <span className="showreel-hud-code">SIG-{String(idx + 1).padStart(2, "0")}</span>
        </div>

        <div className="showreel-caption" key={idx}>
          <span className="showreel-tag">{scene.tag}</span>
          <h3 className="showreel-title">{scene.title}</h3>
        </div>

        <div className="showreel-controls">
          <button
            className="showreel-btn"
            onClick={() => setIdx((i) => (i - 1 + scenes.length) % scenes.length)}
            aria-label="Previous scene"
          >
            ←
          </button>
          <div className="showreel-progress">
            {scenes.map((s, i) => (
              <button
                key={s.title}
                className={`showreel-dot ${i === idx ? "active" : ""}`}
                onClick={() => setIdx(i)}
                aria-label={`Go to scene ${i + 1}`}
              >
                <span className={i === idx ? "fill" : ""}></span>
              </button>
            ))}
          </div>
          <button
            className="showreel-btn"
            onClick={() => setPaused((p) => !p)}
            aria-label={paused ? "Play showreel" : "Pause showreel"}
          >
            {paused ? "▶" : "❚❚"}
          </button>
        </div>
      </div>
    </section>
  );
}
