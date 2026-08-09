import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import SectionHeading from "../components/SectionHeading";
import Reveal from "../components/Reveal";
import TiltCard from "../components/TiltCard";
import { api } from "../api";
import { GRADS, type Player, type Staff } from "../../shared/data";

function BarFill({ value }: { value: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.style.width = `${value}%`;
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value]);
  return <div ref={ref} className="bar-fill" style={{ width: 0 }}></div>;
}

type Tab = "players" | "staff";

export default function Roster() {
  const [tab, setTab] = useState<Tab>("players");
  const [players, setPlayers] = useState<Player[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);

  useEffect(() => {
    api.players().then(setPlayers).catch(() => setPlayers([]));
    api.staff().then(setStaff).catch(() => setStaff([]));
  }, []);

  return (
    <section className="section section-alt" id="roster">
      <div className="container">
        <SectionHeading
          kicker="// The Squad"
          title="ROSTER"
          sub="Five hunters on the island. A full unit behind the kill feed."
        />

        <div className="tabs" role="tablist">
          <button
            className={`tab-btn ${tab === "players" ? "active" : ""}`}
            role="tab"
            aria-selected={tab === "players"}
            onClick={() => setTab("players")}
          >
            Players <span>{players.length}</span>
          </button>
          <button
            className={`tab-btn ${tab === "staff" ? "active" : ""}`}
            role="tab"
            aria-selected={tab === "staff"}
            onClick={() => setTab("staff")}
          >
            Staff <span>{staff.length}</span>
          </button>
        </div>

        <div className={`roster-grid ${tab === "staff" ? "roster-staff" : ""}`} aria-live="polite">
          {tab === "players" &&
            players.map((p, i) => (
              <Reveal key={p.slug} delay={i * 60}>
                <TiltCard className="player-card">
                  <div className="player-photo" style={{ background: GRADS[i % GRADS.length] }}>
                    <img src={p.photo} alt={`${p.ign} — ${p.name}`} loading="lazy" />
                    <span className={`player-role-tag ${p.tag === "gold" ? "gold" : ""}`}>{p.role}</span>
                  </div>
                  <div className="player-info">
                    <div className="player-ign">{p.ign}</div>
                    <div className="player-name">{p.name}</div>
                    <div className="player-meta">
                      <span>Joined {p.join}</span>
                      <span className="skill">{p.skill}</span>
                    </div>
                    <div className="player-bars">
                      {Object.entries(p.stats).map(([key, val]) => (
                        <div className="bar-row" key={key}>
                          <span className="bar-label">{key}</span>
                          <div className="bar-track">
                            <BarFill value={val} />
                          </div>
                        </div>
                      ))}
                    </div>
                    <Link className="player-profile" to={`/players/${p.slug}`}>
                      View Profile <span>→</span>
                    </Link>
                  </div>
                </TiltCard>
              </Reveal>
            ))}

          {tab === "staff" &&
            staff.map((s, i) => (
              <Reveal key={s.slug} delay={i * 60}>
                <TiltCard className={`staff-card ${s.gold ? "gold" : ""}`}>
                  <div className="staff-photo">
                    <img src={s.photo} alt={`${s.ign} — ${s.name}`} loading="lazy" />
                    {s.gold && <span className="staff-crown">👑</span>}
                  </div>
                  <div className="staff-info">
                    <div className="staff-ign">{s.ign}</div>
                    <div className="staff-role">{s.role}</div>
                    <div className="staff-name">{s.name}</div>
                  </div>
                </TiltCard>
              </Reveal>
            ))}
        </div>
      </div>
    </section>
  );
}
