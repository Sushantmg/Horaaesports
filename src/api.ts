import {
  ACHIEVEMENTS,
  DROP_ZONES,
  FAQS,
  GALLERY,
  HERO_STATS,
  MERCH,
  NEWS,
  PLAYERS,
  RESULTS,
  SPONSORS,
  STAFF,
  STATS,
  UPCOMING,
  VIDEOS,
  type Achievement,
  type DropZone,
  type Faq,
  type GalleryItem,
  type Match,
  type MerchItem,
  type NewsItem,
  type Player,
  type Sponsor,
  type Staff,
  type Stat,
  type VideoItem,
} from "../shared/data";

const base = "";
const FETCH_TIMEOUT_MS = 8000;
const SLUG_RE = /^[a-z0-9-]{1,80}$/;

function assertSlug(slug: string, what: string): void {
  if (!SLUG_RE.test(slug)) throw new Error(`Invalid ${what} slug`);
}

async function get<T>(path: string, timeoutMs = FETCH_TIMEOUT_MS): Promise<T> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(`${base}${path}`, { signal: ctrl.signal });
    if (!res.ok) throw new Error(`Request failed (${res.status})`);
    const json = await res.json();
    if (!json.ok) throw new Error(json.error || "Unknown API error");
    return json.data as T;
  } finally {
    clearTimeout(timer);
  }
}

// On static hosts (Vercel, Netlify, etc.) there is no API server, so fall back
// to the data bundled into the client build. Local dev still uses the Express API.
async function withFallback<T>(path: string, fallback: () => T): Promise<T> {
  try {
    return await get<T>(path);
  } catch (e) {
    if (import.meta.env.DEV) console.warn(`[horaa] API fallback for ${path}:`, e);
    return fallback();
  }
}

const notFound = (what: string): never => {
  throw new Error(`${what} not found`);
};

export const api = {
  get,
  players: () => withFallback<Player[]>("/api/players", () => PLAYERS),
  player: (slug: string) => {
    assertSlug(slug, "player");
    return withFallback<Player>(
      `/api/players/${encodeURIComponent(slug)}`,
      () => PLAYERS.find((p) => p.slug === slug) ?? notFound("Player")
    );
  },
  staff: () => withFallback<Staff[]>("/api/staff", () => STAFF),
  upcoming: () => withFallback<Match[]>("/api/schedule/upcoming", () => UPCOMING),
  results: () => withFallback<Match[]>("/api/schedule/results", () => RESULTS),
  news: () => withFallback<NewsItem[]>("/api/news", () => NEWS),
  newsItem: (slug: string) => {
    assertSlug(slug, "article");
    return withFallback<NewsItem>(
      `/api/news/${encodeURIComponent(slug)}`,
      () => NEWS.find((n) => n.slug === slug) ?? notFound("News")
    );
  },
  gallery: () => withFallback<GalleryItem[]>("/api/gallery", () => GALLERY),
  videos: () => withFallback<VideoItem[]>("/api/videos", () => VIDEOS),
  merch: () => withFallback<MerchItem[]>("/api/merch", () => MERCH),
  faqs: () => withFallback<Faq[]>("/api/faqs", () => FAQS),
  sponsors: () => withFallback<Sponsor[]>("/api/sponsors", () => SPONSORS),
  dropZones: () => withFallback<DropZone[]>("/api/drop-zones", () => DROP_ZONES),
  achievements: () => withFallback<Achievement[]>("/api/achievements", () => ACHIEVEMENTS),
  stats: () => withFallback<Stat[]>("/api/stats", () => STATS),
  heroStats: () => withFallback<Stat[]>("/api/hero-stats", () => HERO_STATS),
};

export async function postContact(payload: { name: string; email: string; subject: string; message: string }) {
  const name = payload.name.trim();
  const email = payload.email.trim();
  const subject = payload.subject.trim();
  const message = payload.message.trim();
  if (name.length < 2 || name.length > 120) throw new Error("Invalid name");
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Invalid email");
  if (subject.length > 200) throw new Error("Subject too long");
  if (message.length < 10 || message.length > 5000) throw new Error("Invalid message length");

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 10000);
  try {
    const res = await fetch(`${base}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, subject, message }),
      signal: ctrl.signal,
    });
    const json = await res.json().catch(() => ({ ok: false, error: "Server unreachable" }));
    if (!res.ok || !json.ok) throw new Error(json.error || "Submission failed");
    return json;
  } catch {
    const qs = new URLSearchParams({
      subject: subject || "Contact via horaaesports site",
      body: `${name} (${email})\n\n${message}`,
    });
    window.location.href = `mailto:info@horaaesports.com.np?${qs.toString()}`;
    return { ok: true, fallback: "mailto" };
  } finally {
    clearTimeout(timer);
  }
}
