const ITEMS = [
  "HORAA ESPORTS",
  "🇳🇵 NEPAL'S 1ST PMWC TEAM",
  "CHICKEN DINNER",
  "ERANGEL AWAITS",
  "ZONE 5 CLOSING",
  "AIRDROP INCOMING",
  "PUBG MOBILE",
  "#FORNEPAL",
];

export default function Ticker() {
  const Row = () => (
    <>
      {ITEMS.map((t, i) => (
        <span key={i}>
          {t} <span className="tick-sep">✕</span>
        </span>
      ))}
    </>
  );
  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker-track">
        <span>
          <Row /> <Row />
        </span>
      </div>
    </div>
  );
}
