import { Link, useLocation } from "react-router-dom";

const SOCIALS = [
  { label: "IG", href: "https://www.instagram.com/horaaesports" },
  { label: "YT", href: "https://www.youtube.com/@HoraaEsportsOfficial" },
  { label: "FB", href: "https://www.facebook.com/horaaesports/" },
  { label: "TT", href: "https://www.tiktok.com/@horaa.esports" },
  { label: "DC", href: "https://discord.gg/BXwybtRTRX" },
];

const COMPANY = [
  { label: "Achievements", hash: "achievements" },
  { label: "Roster", hash: "roster" },
  { label: "Schedule", hash: "schedule" },
  { label: "News", hash: "news" },
  { label: "Gallery", hash: "gallery" },
  { label: "FAQ", hash: "faq" },
];

const OFFICIAL = [
  { label: "Official Website", href: "https://horaaesports.com.np" },
  { label: "Merch Store", href: "https://shop.horaaesports.com.np/" },
  { label: "Discord", href: "https://discord.gg/BXwybtRTRX" },
  { label: "Email Us", href: "mailto:info@horaaesports.com.np" },
];

export default function Footer() {
  const { pathname } = useLocation();

  const goTo = (hash: string) => {
    if (pathname !== "/") {
      window.location.hash = hash;
      return;
    }
    const el = document.getElementById(hash);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    else window.location.hash = hash;
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="brand">
              <span className="brand-mark">H</span>
              <span className="brand-text">
                HORAA<em>ESPORTS</em>
              </span>
            </Link>
            <p>Showcasing excellence — Nepal's premier PUBG Mobile organization. Together we grow, stronger every day.</p>
            <div className="socials">
              {SOCIALS.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener" aria-label={s.label}>
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          <div className="footer-col">
            <h4>Company</h4>
            {COMPANY.map((c) => (
              <button key={c.hash} onClick={() => goTo(c.hash)}>
                {c.label}
              </button>
            ))}
          </div>

          <div className="footer-col">
            <h4>Official</h4>
            {OFFICIAL.map((o) => (
              <a key={o.label} href={o.href} target="_blank" rel="noopener">
                {o.label}
              </a>
            ))}
          </div>

          <div className="footer-col footer-cta">
            <h4>Join the Squad</h4>
            <p>Get merch drops, match alerts &amp; behind-the-scenes.</p>
            <form
              className="mini-form"
              onSubmit={(e) => {
                e.preventDefault();
                e.currentTarget.reset();
              }}
            >
              <input type="email" placeholder="your@email.com" required />
              <button type="submit" aria-label="Subscribe">→</button>
            </form>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Horaa Esports. All rights reserved.</span>
          <span className="footer-made">
            Made with <span className="heart">♥</span> in Nepal · #FORNEPAL
          </span>
        </div>
      </div>
    </footer>
  );
}
