import { useEffect, useRef, useState } from "react";

const ENEMIES = [
  "PMWC_Wolf",
  "TopSecret_",
  "SniperX",
  "FalconKing",
  "Ghost_99",
  "EagleEye",
  "Venomx",
  "RiyadhStriker",
  "KrakenGG",
  "NeoHunter",
  "Dust2Demon",
  "NepalProud",
];

const WEAPONS = ["M416", "AKM", "M24", "AWM", "DBS", "M249", "Vector", "UZI"];

const SPECIAL = [
  "#FORNEPAL — CARRIED THE NATION 🏆",
  "HORAA → PMWC RIYADH 2025 ✈",
  "CHICKEN DINNER! WINNER WINNER 🍗",
  "HORAA WIPED THE LOBBY 🔥",
  "FIRST NEPALI TEAM AT PMWC 🇳🇵",
];

const IGN = ["JiGGL3", "SkY", "NoFear", "SleepY", "HaitDami", "Blaze", "CR7 Horaa", "Charlie", "MafiaNinja", "Rashmay"];
const HORAA_IGN = IGN.map((n) => (n.includes(" ") ? "HORAA_" + n.replace(/\s/g, "") : "HORAA_" + n));

interface Kill {
  id: number;
  killer?: string;
  weapon?: string;
  victim?: string;
  special?: string;
}

export default function KillFeed() {
  const [kills, setKills] = useState<Kill[]>([]);
  const nextId = useRef(0);
  const scheduled = useRef<Set<number>>(new Set());

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const add = () => {
      const roll = Math.random();
      const entry: Kill = {
        id: nextId.current++,
        ...(roll < 0.72
          ? {
              killer: HORAA_IGN[Math.floor(Math.random() * HORAA_IGN.length)],
              weapon: WEAPONS[Math.floor(Math.random() * WEAPONS.length)],
              victim: ENEMIES[Math.floor(Math.random() * ENEMIES.length)],
            }
          : { special: SPECIAL[Math.floor(Math.random() * SPECIAL.length)] }),
      };
      setKills((prev) => [entry, ...prev].slice(0, 4));
    };

    let timer = 0;
    const schedule = () => {
      const narrow = window.innerWidth < 640;
      const delay = (narrow ? 9000 : 5500) + Math.random() * 5000;
      timer = window.setTimeout(() => {
        add();
        schedule();
      }, delay);
    };
    add();
    schedule();

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    for (const k of kills) {
      if (scheduled.current.has(k.id)) continue;
      scheduled.current.add(k.id);
      window.setTimeout(() => {
        setKills((prev) => prev.filter((x) => x.id !== k.id));
      }, 4200);
    }
  }, [kills]);

  if (kills.length === 0) return null;

  return (
    <div className="killfeed" aria-hidden="true">
      {kills.map((k) =>
        k.special ? (
          <div className="kill-row special" key={k.id}>
            <span className="kill-k">{k.special}</span>
          </div>
        ) : (
          <div className="kill-row" key={k.id}>
            <span className="kill-k">{k.killer}</span>
            <span className="kill-w">{k.weapon}</span>
            <span className="kill-v">{k.victim}</span>
          </div>
        )
      )}
    </div>
  );
}
