import { useEffect, useRef, useState } from "react";
import NepalFlag from "./NepalFlag";

const PHASES = [1700, 1800, 5000];
const FADE = 900;

export default function PrideIntro({ onFinish }: { onFinish: () => void }) {
  const [phase, setPhase] = useState(0);
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
    if (reduced) return;
    const timers = PHASES.map((ms, i) => setTimeout(() => setPhase(i + 1), ms));
    timers.push(setTimeout(finish, PHASES.reduce((a, b) => a + b, 0)));
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter") finish();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  const letters = ["H", "O", "R", "A", "A"];

  return (
    <div className={`pride ${leaving ? "leaving" : ""} ${phase >= 2 ? "shook" : ""}`} aria-hidden="true">
      <div className="pride-grid" aria-hidden="true"></div>
      <div className="pride-scan" aria-hidden="true"></div>
      <div className="pride-mount back" aria-hidden="true"></div>
      <div className="pride-mount front" aria-hidden="true"></div>
      <div className="pride-vignette" aria-hidden="true"></div>

      {!reduced && <span className="pride-kicker">HORAA ESPORTS PRESENTS</span>}

      {reduced ? (
        <div className="pride-static">
          <div className="pride-flag">
            <NepalFlag size={170} />
          </div>
          <span className="pride-static-brand">HORAA</span>
          <span className="pride-static-sub">E S P O R T S · #FORNEPAL</span>
        </div>
      ) : (
        <>
          {phase === 1 && (
            <div className="pride-flag-wrap">
              <span className="pride-sun"></span>
              <span className="pride-ring"></span>
              <span className="pride-ring r2"></span>
              <span className="pride-ring r3"></span>
              <div className="pride-flag">
                <NepalFlag size={240} />
              </div>
              <span className="pride-flag-word">नेपाल</span>
              <span className="pride-flag-sub">N E P A L</span>
            </div>
          )}

          {phase >= 2 && (
            <div className="pride-brand">
              <span className="pride-starburst"></span>
              <div className="pride-watermark">
                <NepalFlag size={320} />
              </div>
              <span className="pride-flash"></span>
              <div className="pride-word">
                <span className="pride-sheen"></span>
                {letters.map((l, i) => (
                  <span key={i} className="pride-letter" style={{ animationDelay: `${i * 90}ms` }}>
                    {l}
                  </span>
                ))}
              </div>
              <span className="pride-sub">E S P O R T S</span>
              <span className="pride-deva">नेपालको गर्व</span>
            </div>
          )}

          {phase >= 3 && (
            <>
              <div className="pride-cr7">
                <div className="pride-cr7-frame">
                  <img className="pride-cr7-photo" src="/images/players/cr7.jpg" alt="CR7 Horaa" />
                </div>
                <span className="pride-cr7-name">CR7 HORAA</span>
                <span className="pride-cr7-role">SANJAN GAUTAM · FOUNDER &amp; OWNER</span>
              </div>

              <div className="pride-footer">
                <div className="pride-tagline">
                  <span className="pride-flag-mini">
                    <NepalFlag size={30} />
                  </span>
                  <span className="pride-hash">#FORNEPAL</span>
                </div>
                <div className="pride-chips">
                  <span className="pride-chip">FIRST NEPALI TEAM AT PMWC</span>
                  <span className="pride-chip">PMNS 2025 CHAMPIONS</span>
                  <span className="pride-chip">जय नेपाल · JAI NEPAL</span>
                </div>
                <span className="pride-motto">जननी जन्मभूमिश्च स्वर्गादपि गरीयसी</span>
                <span className="pride-motto-en">Mother &amp; Motherland are greater than heaven</span>
                <span className="pride-quote">From the Himalayas to the world stage — carrying the flag to Riyadh.</span>
              </div>

              <div className="pride-facts">
                <span>सगरमाथा · SAGARMATHA 8,848 M</span>
                <span>WORLD'S ONLY NON-RECTANGULAR FLAG</span>
                <span>KINGDOM OF NEPAL · EST. 1768</span>
              </div>
            </>
          )}
        </>
      )}

      <span className="pride-corner tl"></span>
      <span className="pride-corner tr"></span>
      <span className="pride-corner bl"></span>
      <span className="pride-corner br"></span>

      <button className="pride-skip" onClick={finish}>
        {reduced ? "ENTER SITE →" : "SKIP INTRO"}
      </button>
    </div>
  );
}
