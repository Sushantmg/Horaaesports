import { useEffect, useMemo, useState } from "react";
import SectionHeading from "../components/SectionHeading";
import Reveal from "../components/Reveal";
import { api } from "../api";
import type { DropZone } from "../../shared/data";

const TIER_LABEL: Record<DropZone["tier"], string> = {
  S: "Elite Loot",
  A: "High Value",
  B: "Balanced",
  C: "Low Contest",
};

const TIERS: Array<DropZone["tier"]> = ["S", "A", "B", "C"];

type SortKey = "loot" | "hot" | "name";
type TierFilter = DropZone["tier"] | "all";

const SORTS: Array<{ key: SortKey; label: string }> = [
  { key: "loot", label: "Loot" },
  { key: "hot", label: "Contest" },
  { key: "name", label: "A–Z" },
];

export default function TacticalMap() {
  const [zones, setZones] = useState<DropZone[]>([]);
  const [activeId, setActiveId] = useState("");
  const [tier, setTier] = useState<TierFilter>("all");
  const [sort, setSort] = useState<SortKey>("loot");
  const [hoverId, setHoverId] = useState("");

  useEffect(() => {
    api
      .dropZones()
      .then((z) => {
        setZones(z);
        if (z.length) setActiveId(z[0].id);
      })
      .catch(() => setZones([]));
  }, []);

  const visible = useMemo(() => {
    const list = tier === "all" ? zones : zones.filter((z) => z.tier === tier);
    return [...list].sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      return b[sort] - a[sort];
    });
  }, [zones, tier, sort]);

  useEffect(() => {
    if (!visible.length) return;
    if (!visible.some((z) => z.id === activeId)) setActiveId(visible[0].id);
  }, [visible, activeId]);

  const active = visible.find((z) => z.id === activeId) ?? visible[0] ?? zones[0];
  const hover = visible.find((z) => z.id === hoverId);
  const idx = active ? visible.findIndex((z) => z.id === active.id) : 0;

  const step = (dir: 1 | -1) => {
    if (!visible.length) return;
    const next = (idx + dir + visible.length) % visible.length;
    setActiveId(visible[next].id);
  };

  if (!active) return null;

  return (
    <section className="section" id="tactical">
      <div className="container">
        <SectionHeading
          kicker="// Drop Zone Intel"
          title="TACTICAL MAP"
          sub="Where Horaa lands — callouts, loot tiers and the rotations behind every drop."
        />

        <Reveal className="tac-toolbar">
          <div className="tac-filters" role="group" aria-label="Filter drop zones by tier">
            <button
              type="button"
              className={`tac-filter ${tier === "all" ? "active" : ""}`}
              aria-pressed={tier === "all"}
              onClick={() => setTier("all")}
            >
              All <span>{zones.length}</span>
            </button>
            {TIERS.map((t) => {
              const count = zones.filter((z) => z.tier === t).length;
              return (
                <button
                  key={t}
                  type="button"
                  className={`tac-filter tier-${t} ${tier === t ? "active" : ""}`}
                  aria-pressed={tier === t}
                  onClick={() => setTier(t)}
                >
                  {t}-Tier <span>{count}</span>
                </button>
              );
            })}
          </div>

          <div className="tac-sort" role="group" aria-label="Sort drop zones">
            <span className="tac-sort-label">Sort</span>
            {SORTS.map((s) => (
              <button
                key={s.key}
                type="button"
                className={`tac-sort-btn ${sort === s.key ? "active" : ""}`}
                aria-pressed={sort === s.key}
                onClick={() => setSort(s.key)}
              >
                {s.label}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="tac">
          <Reveal className="tac-map-wrap">
            <div className="tac-map" role="group" aria-label="Erangel drop zones">
              <span className="tac-water tac-water-a" aria-hidden="true"></span>
              <span className="tac-water tac-water-b" aria-hidden="true"></span>
              <span className="tac-island" aria-hidden="true"></span>

              <svg className="tac-roads" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                <path d="M15 20 L31 43 L47 55 L70 73 L78 38" />
                <path d="M47 55 L52 82" />
                <path d="M31 43 L45 40 L47 55" />
                <path d="M78 38 L88 12" />
                <path d="M45 40 L78 38" />
                <path d="M15 20 L52 82" />
                <path d="M22 79 L40 67 L52 82" />
                <path d="M78 38 L83 58" />
              </svg>

              <svg className="tac-drop" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                <path className="tac-corridor" d="M4 8 L96 92" />
                <path
                  className="tac-drop-path"
                  d={`M ${active.x} -2 Q ${active.x - 8} ${active.y / 2} ${active.x} ${active.y}`}
                />
                <circle className="tac-drop-end" cx={active.x} cy={active.y} r="1.7" />
              </svg>

              <span className="tac-grid" aria-hidden="true"></span>
              <span className="tac-zone-ring" aria-hidden="true"></span>

              {visible.map((z) => (
                <button
                  key={z.id}
                  type="button"
                  className={`tac-pin tier-${z.tier} ${z.id === active.id ? "active" : ""}`}
                  style={{ left: `${z.x}%`, top: `${z.y}%` }}
                  onClick={() => setActiveId(z.id)}
                  onMouseEnter={() => setHoverId(z.id)}
                  onFocus={() => setHoverId(z.id)}
                  onMouseLeave={() => setHoverId("")}
                  onBlur={() => setHoverId("")}
                  aria-pressed={z.id === active.id}
                  aria-label={`${z.name} — ${TIER_LABEL[z.tier]} · loot ${z.loot}% · contest ${z.hot}%`}
                >
                  <span className="tac-pin-dot" aria-hidden="true">
                    {z.tier}
                  </span>
                  <span className="tac-pin-label">{z.name}</span>
                </button>
              ))}

              {hover && (
                <div
                  className={`tac-tip ${hover.y < 30 ? "below" : "above"}`}
                  style={{ left: `${hover.x}%`, top: `${hover.y}%` }}
                  aria-hidden="true"
                >
                  <span className={`tac-tip-tier tier-${hover.tier}`}>{hover.tier}</span>
                  <div className="tac-tip-body">
                    <b>{hover.name}</b>
                    <span>
                      Loot {hover.loot}% · Contest {hover.hot}%
                    </span>
                  </div>
                </div>
              )}

              <span className="tac-map-code">
                ERANGEL · {visible.length}/{zones.length} ZONES
              </span>
            </div>

            <div className="tac-legend">
              <span className="tac-legend-item tier-S">
                <i></i>Elite
              </span>
              <span className="tac-legend-item tier-A">
                <i></i>High
              </span>
              <span className="tac-legend-item tier-B">
                <i></i>Balanced
              </span>
              <span className="tac-legend-item tier-C">
                <i></i>Low
              </span>
            </div>
          </Reveal>

          <Reveal delay={120} className="tac-panel" aria-live="polite">
            <div className="tac-panel-head">
              <span className={`tac-tier tier-${active.tier}`}>{active.tier}-Tier</span>
              <div className="tac-panel-titles">
                <h3 className="tac-name">{active.name}</h3>
                <span className="tac-nick">
                  {active.nick} · {TIER_LABEL[active.tier]}
                </span>
              </div>
              <div className="tac-nav">
                <button type="button" onClick={() => step(-1)} aria-label="Previous drop zone">
                  ‹
                </button>
                <span className="tac-nav-count">
                  {idx + 1}/{visible.length}
                </span>
                <button type="button" onClick={() => step(1)} aria-label="Next drop zone">
                  ›
                </button>
              </div>
            </div>

            <div className="tac-meters">
              <div className="tac-meter">
                <div className="tac-meter-top">
                  <span>Loot Density</span>
                  <b>{active.loot}%</b>
                </div>
                <div className="tac-meter-track">
                  <span className="tac-meter-fill loot" style={{ width: `${active.loot}%` }}></span>
                </div>
              </div>
              <div className="tac-meter">
                <div className="tac-meter-top">
                  <span>Contest Level</span>
                  <b>{active.hot}%</b>
                </div>
                <div className="tac-meter-track">
                  <span className="tac-meter-fill hot" style={{ width: `${active.hot}%` }}></span>
                </div>
              </div>
            </div>

            <dl className="tac-rows">
              <div className="tac-row">
                <dt>Lead Hunter</dt>
                <dd>{active.player}</dd>
              </div>
              <div className="tac-row">
                <dt>Rotation</dt>
                <dd>{active.rotation}</dd>
              </div>
            </dl>

            <p className="tac-note">{active.note}</p>

            <div className="tac-chips" role="group" aria-label="Select a drop zone">
              {visible.map((z) => (
                <button
                  key={z.id}
                  type="button"
                  className={`tac-chip ${z.id === active.id ? "active" : ""}`}
                  onClick={() => setActiveId(z.id)}
                  aria-pressed={z.id === active.id}
                >
                  {z.name}
                </button>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
