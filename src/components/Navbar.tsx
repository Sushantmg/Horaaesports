import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import LanguageSelect from "./LanguageSelect";

interface NavChild {
  label: string;
  to: string;
}

interface NavItem {
  label: string;
  to?: string;
  children?: NavChild[];
}

const NAV: NavItem[] = [
  { label: "Home", to: "/" },
  {
    label: "Team",
    to: "/roster",
    children: [
      { label: "Roster", to: "/roster" },
      { label: "Achievements", to: "/achievements" },
      { label: "Schedule", to: "/schedule" },
    ],
  },
  {
    label: "Media",
    to: "/videos",
    children: [
      { label: "Videos", to: "/videos" },
      { label: "News", to: "/news" },
      { label: "Gallery", to: "/gallery" },
    ],
  },
  { label: "FAQ", to: "/faq" },
  { label: "Contact", to: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const { pathname } = useLocation();

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 30);
      if (y < 160) setHidden(false);
      else if (y > last + 12) setHidden(true);
      else if (y < last - 8) setHidden(false);
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setOpenGroup(null);
    setHidden(false);
    document.body.classList.remove("no-scroll");
  }, [pathname]);

  useEffect(() => {
    document.body.classList.toggle("no-scroll", open);
  }, [open]);

  useEffect(() => {
    setHidden(false);
  }, [open]);

  const isActive = (to: string) => pathname === to || pathname.startsWith(`${to}/`);

  const isChildActive = (children: NavChild[]) => children.some((c) => isActive(c.to));

  return (
    <>
      <header className={`nav ${scrolled ? "scrolled" : ""} ${hidden && !open ? "hidden" : ""}`}>
        <div className="container nav-inner">
          <Link to="/" className="brand" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <span className="brand-mark">H</span>
            <span className="brand-text">
              HORAA<em>ESPORTS</em>
            </span>
          </Link>

          <nav className="nav-links" aria-label="Primary">
            {NAV.map((item) =>
              item.children ? (
                <div key={item.label} className={`nav-group ${isChildActive(item.children) ? "active" : ""}`}>
                  <Link to={item.to!} className={`nav-link nav-group-label ${isActive(item.to!) ? "current" : ""}`}>
                    {item.label} <span className="caret">▾</span>
                  </Link>
                  <div className="dropdown">
                    {item.children.map((c) => (
                      <Link key={c.to} to={c.to} className={`dropdown-link ${isActive(c.to) ? "current" : ""}`}>
                        {c.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={item.label}
                  to={item.to!}
                  className={`nav-link ${isActive(item.to!) ? "current" : ""}`}
                >
                  {item.label}
                </Link>
              )
            )}
            <a className="btn btn-shop" href="https://shop.horaaesports.com.np" target="_blank" rel="noopener">
              Shop Now
            </a>
            <a className="btn btn-discord" href="https://discord.gg/BXwybtRTRX" target="_blank" rel="noopener">
              Join Discord
            </a>
          </nav>

          <div className="nav-actions">
            <LanguageSelect />
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
        </div>
      </header>

      <div className={`mobile-nav ${open ? "open" : ""}`} aria-hidden={!open}>
        <div className="mobile-nav-bg"></div>
        <nav className="mobile-nav-links">
          {NAV.map((item, i) =>
            item.children ? (
              <div key={item.label} className={`mobile-group ${isChildActive(item.children) ? "active" : ""}`}>
                <button
                  style={{ transitionDelay: `${0.08 + i * 0.06}s` }}
                  onClick={() => setOpenGroup(openGroup === item.label ? null : item.label)}
                  aria-expanded={openGroup === item.label}
                >
                  {item.label} <span className="caret">{openGroup === item.label ? "▴" : "▾"}</span>
                </button>
                {openGroup === item.label && (
                  <div className="mobile-sub">
                    {item.children.map((c) => (
                      <Link key={c.to} to={c.to} className={isActive(c.to) ? "current" : ""}>
                        {c.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link key={item.label} to={item.to!} style={{ transitionDelay: `${0.08 + i * 0.06}s` }}>
                {item.label}
              </Link>
            )
          )}
          <div style={{ transitionDelay: "0.44s" }} className="mobile-cta">
            <a className="btn btn-shop" href="https://shop.horaaesports.com.np" target="_blank" rel="noopener">
              Shop Now
            </a>
            <a className="btn btn-discord" href="https://discord.gg/BXwybtRTRX" target="_blank" rel="noopener">
              Join Discord
            </a>
          </div>
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
