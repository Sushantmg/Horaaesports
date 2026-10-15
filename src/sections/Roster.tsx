import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import SectionHeading from "../components/SectionHeading";
import Reveal from "../components/Reveal";
import TiltCard from "../components/TiltCard";
import { DataEmpty, DataError, DataSkeleton } from "../components/DataState";
import { useAsyncData } from "../lib/useAsyncData";
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

export default function Roster({ heading = true }: { heading?: boolean }) {
  const [tab, setTab] = useState<Tab>("players");
  const playersQuery = useAsyncData<Player[]>(() => api.players());
  const staffQuery = useAsyncData<Staff[]>(() => api.staff());
  const players = playersQuery.data ?? [];
  const staff = staffQuery.data ?? [];
  const loading = playersQuery.loading || staffQuery.loading;
  const failed = playersQuery.status === "error" || staffQuery.status === "error";

  const retryAll = () => {
    if (playersQuery.status === "error") playersQuery.retry();
    if (staffQuery.status === "error") staffQuery.retry();
  };

  return (
    <section className="section section-alt" id="roster">
      <div className="container">
        {heading && (
          <SectionHeading
            kicker="// The Squad"
            title="ROSTER"
            sub="Five hunters on the island. A full unit behind the kill feed."
          />
        )}

        <div className="tabs" role="tablist" aria-label="Roster tabs">
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

        {loading && <DataSkeleton count={4} className="roster-grid" label="Loading roster" />}
        {!loading && failed && (
          <DataError
            label="Roster"
            message={[playersQuery.error, staffQuery.error].filter(Boolean).join(" ")}
            onRetry={retryAll}
          />
        )}
        {!loading && !failed && tab === "players" && players.length === 0 && (
          <DataEmpty title="Squad list updating" hint="Lineup changes drop here before the next qualifier." />
        )}
        {!loading && !failed && tab === "staff" && staff.length === 0 && (
          <DataEmpty title="Staff list updating" hint="Coaches and analysts will be listed here soon." />
        )}

        {!loading && !failed && (
          <div className={`roster-grid ${tab === "staff" ? "roster-staff" : ""}`} aria-live="polite">
            {tab === "players" &&
              players.map((p, i) => (
                <Reveal key={p.slug} delay={i * 60}>
                  <TiltCard className="player-card">
                    <div className="player-photo" style={{ background: GRADS[i % GRADS.length] }}>
                      <img src={p.photo} alt={`${p.ign} — ${p.name}`} loading="lazy" decoding="async" />
                      <span className={`player-role-tag ${p.tag === "gold" ? "gold" : ""}`}>{p.role}</span>
                    </div>
                    <div className="player-info">
                      <div className="player-ign">{p.ign}</div>
                      <div className="player-name">{p.name}</div>
                      <div className="player-meta">
                        <span>Joined {p.join}</span>
                        <span className="skill">{p.skill}</span>
                      </div>
                      {Object.values(p.socials).some(Boolean) && (
                        <div className="player-socials-mini">
                          {p.socials.ig && (
                            <a href={p.socials.ig} target="_blank" rel="noopener noreferrer" aria-label={`${p.ign} on Instagram`}>IG</a>
                          )}
                          {p.socials.yt && (
                            <a href={p.socials.yt} target="_blank" rel="noopener noreferrer" aria-label={`${p.ign} on YouTube`}>YT</a>
                          )}
                          {p.socials.tiktok && (
                            <a href={p.socials.tiktok} target="_blank" rel="noopener noreferrer" aria-label={`${p.ign} on TikTok`}>TT</a>
                          )}
                        </div>
                      )}
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
                      <Link className="player-profile" to={`/roster/${p.slug}`}>
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
                      <img src={s.photo} alt={`${s.ign} — ${s.name}`} loading="lazy" decoding="async" />
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
        )}
      </div>
    </section>
  );
}
