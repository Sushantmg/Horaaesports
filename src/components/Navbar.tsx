import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const LINKS = [
  { to: "/", hash: "achievements", label: "Achievements" },
  { to: "/", hash: "roster", label: "Roster" },
  { to: "/", hash: "schedule", label: "Schedule" },
  { to: "/", hash: "news", label: "News" },
  { to: "/", hash: "gallery", label: "Gallery" },
  { to: "/", hash: "faq", label: "FAQ" },
  { to: "/", hash: "contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    document.body.classList.remove("no-scroll");
  }, [pathname]);

  useEffect(() => {
    document.body.classList.toggle("no-scroll", open);
  }, [open]);

  const goTo = (hash: string) => {
    setOpen(false);
    if (pathname !== "/") {
      window.location.hash = hash;
      return;
    }
    const el = document.getElementById(hash);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.location.hash = hash;
    }
  };

  return (
    <>
      <header className={`nav ${scrolled ? "scrolled" : ""}`}>
        <div className="container nav-inner">
          <Link to="/" className="brand" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <span className="brand-mark">H</span>
            <span className="brand-text">
              HORAA<em>ESPORTS</em>
            </span>
          </Link>

          <nav className="nav-links">
            {LINKS.map((l) => (
              <button key={l.hash} className="nav-link" onClick={() => goTo(l.hash)}>
                {l.label}
              </button>
            ))}
            <a className="btn btn-discord" href="https://discord.gg/BXwybtRTRX" target="_blank" rel="noopener">
              Join Discord
            </a>
          </nav>

          <button
            className={`hamburger ${open ? "open" : ""}`}
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      <div className={`mobile-nav ${open ? "open" : ""}`} aria-hidden={!open}>
        <div className="mobile-nav-bg"></div>
        <nav className="mobile-nav-links">
          {LINKS.map((l, i) => (
            <button key={l.hash} style={{ transitionDelay: `${0.08 + i * 0.06}s` }} onClick={() => goTo(l.hash)}>
              {l.label}
            </button>
          ))}
          <a
            className="btn btn-discord"
            href="https://discord.gg/BXwybtRTRX"
            target="_blank"
            rel="noopener"
            onClick={() => setOpen(false)}
          >
            Join Discord
          </a>
        </nav>
        <div className="mobile-nav-foot">
          <a href="https://www.instagram.com/horaaesports" target="_blank" rel="noopener">Instagram</a>
          <a href="https://www.youtube.com/@HoraaEsportsOfficial" target="_blank" rel="noopener">YouTube</a>
          <a href="https://www.facebook.com/horaaesports/" target="_blank" rel="noopener">Facebook</a>
          <a href="https://www.tiktok.com/@horaa.esports" target="_blank" rel="noopener">TikTok</a>
        </div>
      </div>
    </>
  );
}
