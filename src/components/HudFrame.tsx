const COMPASS = [
  { label: "N", tick: true },
  { label: "", tick: false },
  { label: "", tick: true },
  { label: "E", tick: true },
  { label: "", tick: false },
  { label: "", tick: true },
  { label: "S", tick: true },
  { label: "", tick: false },
  { label: "", tick: true },
  { label: "W", tick: true },
  { label: "", tick: false },
  { label: "", tick: true },
];

export default function HudFrame() {
  return (
    <div className="hud" aria-hidden="true">
      <span className="hud-corner tl"></span>
      <span className="hud-corner tr"></span>
      <span className="hud-corner bl"></span>
      <span className="hud-corner br"></span>

      <div className="hud-compass">
        {COMPASS.map((c, i) => (
          <span key={i} className={`hud-tick ${c.label ? "n" : ""}`}>
            <i></i>
            {c.label}
          </span>
        ))}
      </div>

      <div className="hud-cross">
        <span className="cx-line cx-h"></span>
        <span className="cx-line cx-v"></span>
        <span className="cx-dot"></span>
      </div>

      <div className="hud-map">
        <span className="map-zone" style={{ inset: "22px", width: "54px", height: "54px" }}></span>
        <span className="map-blip self" style={{ top: "38px", left: "48px" }}></span>
        <span className="map-blip" style={{ top: "66px", left: "30px" }}></span>
        <span className="map-blip" style={{ top: "22px", left: "88px" }}></span>
        <span className="map-blip" style={{ top: "96px", left: "96px" }}></span>
        <span className="map-label">ERANGEL · 9.5</span>
      </div>

      <div className="hud-zone">
        <span className="z-main">ZONE 5 CLOSING</span>
        <span className="z-sub">01:32 · SAFE · #FORNEPAL</span>
      </div>
    </div>
  );
}
