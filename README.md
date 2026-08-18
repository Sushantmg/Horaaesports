# HORAA Esports

Nepal's premier PUBG Mobile esports organization — fan-made website by [Sushant MG](https://github.com/Sushantmg).

**Live:** [horaaesports.vercel.app](https://horaaesports.vercel.app)

## Tech Stack

- **React 18** + **TypeScript** + **Vite**
- **React Router** (SPA with hash routing)
- **Puppeteer-core** (dev testing)
- **Google Translate** (i18n via widget)
- **Vercel** (hosting + SPA rewrite)

## Getting Started

```bash
npm install
npm run dev
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Type-check + production build |
| `npm run preview` | Preview production build locally |

## Project Structure

```
src/
├── components/       # Reusable UI (Navbar, Footer, Countdown, Gallery, etc.)
├── sections/         # Homepage sections (Hero, Roster, Achievements, etc.)
├── pages/            # Route-level pages (Home, RosterPage, NewsPage, etc.)
├── lib/              # Utilities (translate, analytics)
├── styles.css        # Global styles (~5800 lines)
├── App.tsx           # Root layout + routing
└── main.tsx          # Entry point
shared/
└── data.ts           # All site data (players, news, FAQs, schedule, gallery)
public/
├── favicon.svg       # Crimson→blue gradient H mark
├── robots.txt
├── sitemap.xml
└── images/           # Static assets (og-banner, hero emblem, etc.)
```

## Features

- **Animated hero** — aurora nebula, Nepal flag watermark, PUBG zone rings, shooting stars, scroll parallax
- **Flip-clock countdown** — 3D rotateX animation on match timers, "WE'RE LIVE!" state at zero
- **Gallery lightbox** — fullscreen viewer with keyboard navigation + body scroll lock
- **Auto-hide navbar** — hides on scroll down, reveals on scroll up, ticker pauses on hover
- **Language selector** — Google Translate wrapper with English-named dropdown, English defaults
- **Konami code** — ↑↑↓↓←→←→BA triggers a visual Easter egg
- **Kill feed** — random PUBG-style elimination feed on scroll
- **XP progress bar** — page scroll progress as a leveling bar
- **CRT scanline overlay** — toggleable retro monitor effect
- **Gamer cursor** — custom crosshair cursor
- **Smooth page transitions** — fade + slide on route changes
- **Responsive** — mobile hamburger menu, fluid layouts

## SEO

- Open Graph + Twitter Card meta tags
- Branded OG banner (`public/images/og-banner.png`, 1200×630)
- `robots.txt` + `sitemap.xml`
- Semantic HTML with `aria` attributes

## Data

All site content lives in `shared/data.ts` — players, matches, news articles, FAQs, gallery items, achievements. API functions (`api.*`) load from this file. To update content, edit the data arrays directly.

## Deployment

Pushes to `main` auto-deploy via Vercel. The `vercel.json` rewrites all non-asset paths to `index.html` for SPA routing.

## License

Built by [Sushant MG](https://github.com/Sushantmg). All rights reserved.
