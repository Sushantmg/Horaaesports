import { useEffect, useState } from "react";
import Counter from "../components/Counter";
import Reveal from "../components/Reveal";
import { api } from "../api";
import type { Stat } from "../../shared/data";

export default function StatsBand() {
  const [stats, setStats] = useState<Stat[]>([]);

  useEffect(() => {
    api.stats().then(setStats).catch(() => setStats([]));
  }, []);

  return (
    <section className="section section-stats" id="stats">
      <div className="container">
        <div className="stats-band">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={(i % 3) * 80} className="stat">
              <span className="stat-num">
                <Counter value={s.value} suffix={s.suffix} />
              </span>
              <span className="stat-label">{s.label}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
