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

export default function TacticalMap() {
  const [zones, setZones] = useState<DropZone[]>([]);
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    api
      .dropZones()
      .then((z) => {
        setZones(z);
        if (z.length) setActiveId(z[0].id);
      })
      .catch(() => setZones([]));
  }, []);

  const active = useMemo(
    () => zones.find((z) => z.id === activeId) ?? zones[0],
    [zones, activeId]
  );

  if (!active) return null;

  return (
    <section className="section" id="tactical">
      <div className="container">
        <SectionHeading
          kicker="// Drop Zone Intel"
          title="TACTICAL MAP"
          sub="Where Horaa lands — callouts, loot tiers and the rotations behind every drop."
        />

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
              </svg>

              <span className="tac-grid" aria-hidden="true"></span>
              <span className="tac-zone-ring" aria-hidden="true"></span>

              {zones.map((z) => (
                <button
                  key={z.id}
                  type="button"
                  className={`tac-pin tier-${z.tier} ${z.id === active.id ? "active" : ""}`}
                  style={{ left: `${z.x}%`, top: `${z.y}%` }}
                  onClick={() => setActiveId(z.id)}
                  aria-pressed={z.id === active.id}
                  aria-label={`${z.name} — ${TIER_LABEL[z.tier]}`}
                >
                  <span className="tac-pin-dot" aria-hidden="true">{z.tier}</span>
                  <span className="tac-pin-label">{z.name}</span>
                </button>
              ))}

              <span className="tac-map-code">ERANGEL · 8×8 KM</span>
            </div>

            <div className="tac-legend">
              <span className="tac-legend-item tier-S"><i></i>Elite</span>
              <span className="tac-legend-item tier-A"><i></i>High</span>
              <span className="tac-legend-item tier-B"><i></i>Balanced</span>
              <span className="tac-legend-item tier-C"><i></i>Low</span>
            </div>
          </Reveal>

          <Reveal delay={120} className="tac-panel" aria-live="polite">
            <div className="tac-panel-head">
              <span className={`tac-tier tier-${active.tier}`}>{active.tier}-Tier</span>
              <div className="tac-panel-titles">
                <h3 className="tac-name">{active.name}</h3>
                <span className="tac-nick">{active.nick} · {TIER_LABEL[active.tier]}</span>
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
              {zones.map((z) => (
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
