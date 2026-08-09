import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Reveal from "../components/Reveal";
import { api } from "../api";
import { GRADS, type Player } from "../../shared/data";

function PlayerBar({ value }: { value: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const t = setTimeout(() => {
      el.style.width = `${value}%`;
    }, 250);
    return () => clearTimeout(t);
  }, [value]);
  return <div ref={ref} className="bar-fill" style={{ width: 0 }}></div>;
}

export default function PlayerDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [player, setPlayer] = useState<Player | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setPlayer(null);
    setNotFound(false);
    if (!slug) return;
    api
      .player(slug)
      .then((p) => {
        setPlayer(p);
        window.scrollTo({ top: 0, behavior: "auto" });
      })
      .catch(() => setNotFound(true));
  }, [slug]);

  if (notFound) {
    return (
      <main className="page-mini">
        <Reveal className="page-mini-inner">
          <h1>Player not found</h1>
          <p>The requested profile doesn't exist on the current roster.</p>
          <Link className="btn btn-primary" to="/">
            Back to Home
          </Link>
        </Reveal>
      </main>
    );
  }

  if (!player) {
    return (
      <main className="page-mini">
        <div className="page-loader">
          <div className="preloader-bar"><span></span></div>
          <p>LOADING PROFILE…</p>
        </div>
      </main>
    );
  }

  const idx = player.slug.length % GRADS.length;
  const grad = GRADS[idx];

  return (
    <main className="page-player">
      <div className="container">
        <Reveal className="player-detail-back">
          <Link to="/#roster">← Back to Roster</Link>
        </Reveal>

        <div className="player-detail">
          <Reveal className="player-detail-photo" >
            <div className="player-photo" style={{ background: grad }}>
              <img src={player.photo} alt={`${player.ign} — ${player.name}`} />
              <span className={`player-role-tag ${player.tag === "gold" ? "gold" : ""}`}>{player.role}</span>
            </div>
          </Reveal>

          <Reveal delay={100} className="player-detail-info">
            <span className="section-kicker">// Player Profile</span>
            <h1 className="player-detail-ign">{player.ign}</h1>
            <div className="player-detail-name">{player.name}</div>
            <div className="player-detail-meta">
              <span className={`chip ${player.tag === "gold" ? "gold" : ""}`}>{player.role}</span>
              <span className="chip">Joined {player.join}</span>
              <span className="chip">{player.skill}</span>
            </div>
            <p className="player-detail-bio">{player.bio}</p>

            <div className="player-detail-bars">
              {Object.entries(player.stats).map(([key, val]) => (
                <div className="bar-row" key={key}>
                  <span className="bar-label">{key}</span>
                  <div className="bar-track">
                    <PlayerBar value={val} />
                  </div>
                  <span className="bar-value">{val}</span>
                </div>
              ))}
            </div>

            <Link className="btn btn-primary" to="/">
              Meet the Whole Squad
            </Link>
          </Reveal>
        </div>
      </div>
    </main>
  );
}
