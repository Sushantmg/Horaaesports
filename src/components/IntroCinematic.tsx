import { useEffect, useRef, useState } from "react";
import NepalFlag from "./NepalFlag";
import { useCinematicScenes } from "../hooks/useCinematicScenes";

const DURATION = 3200;
const FADE = 850;

export default function IntroCinematic({ onFinish }: { onFinish: () => void }) {
  const scenes = useCinematicScenes(6);
  const [idx, setIdx] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [reduced, setReduced] = useState(false);
  const finished = useRef(false);
  const doneRef = useRef(onFinish);

  useEffect(() => {
    doneRef.current = onFinish;
  });

  const finish = () => {
    if (finished.current) return;
    finished.current = true;
    document.body.classList.remove("preload-lock");
    setLeaving(true);
    setTimeout(() => doneRef.current(), FADE);
  };

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    document.body.classList.add("preload-lock");
    return () => document.body.classList.remove("preload-lock");
  }, []);

  useEffect(() => {
    if (reduced || scenes.length < 2) return;
    const id = setInterval(() => {
      setIdx((i) => {
        if (i + 1 >= scenes.length) {
          finish();
          return i;
        }
        return i + 1;
      });
    }, DURATION);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, scenes.length]);

  useEffect(() => {
    if (scenes.length > 0) return;
    const t = setTimeout(finish, 6000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenes.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter") finish();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenes.length]);

  const scene = scenes[idx];

  return (
    <div className={`intro ${leaving ? "leaving" : ""}`} aria-hidden="true">
      {scenes.length === 0 ? (
        <div className="intro-boot">
          <div className="preloader-emblem">
            <NepalFlag size={42} />
          </div>
          <span className="intro-boot-brand">HORAA</span>
          <span className="intro-boot-sub">E S P O R T S</span>
          <div className="preloader-track">
            <div className="preloader-bar"></div>
          </div>
        </div>
      ) : (
        <div className="intro-stage">
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
                        <img src={p.photo} alt={`${p.ign} — ${p.name}`} />
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
            <span className="showreel-hud-label">HORAA ESPORTS — INTRO</span>
            <span className="showreel-hud-code">SIG-{String(idx + 1).padStart(2, "0")}</span>
          </div>

          <div className="showreel-caption" key={idx}>
            <span className="showreel-tag">{scene.tag}</span>
            <h3 className="showreel-title">{scene.title}</h3>
          </div>

          {!reduced && (
            <div className="intro-progress">
              {scenes.map((s, i) => (
                <span key={s.title} className={`intro-dot ${i === idx ? "active" : ""}`}>
                  <span></span>
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      <button className="intro-skip" onClick={finish}>
        {reduced ? "ENTER SITE →" : "SKIP INTRO"}
      </button>
    </div>
  );
}
