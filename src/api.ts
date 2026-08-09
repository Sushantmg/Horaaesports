import {
  ACHIEVEMENTS,
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

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${base}${path}`);
  if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`);
  const json = await res.json();
  if (!json.ok) throw new Error(json.error || "Unknown API error");
  return json.data as T;
}

// On static hosts (Vercel, Netlify, etc.) there is no API server, so fall back
// to the data bundled into the client build. Local dev still uses the Express API.
async function withFallback<T>(path: string, fallback: () => T): Promise<T> {
  try {
    return await get<T>(path);
  } catch {
    return fallback();
  }
}

const notFound = (what: string): never => {
  throw new Error(`${what} not found`);
};

export const api = {
  get,
  players: () => withFallback<Player[]>("/api/players", () => PLAYERS),
  player: (slug: string) =>
    withFallback<Player>(`/api/players/${slug}`, () => PLAYERS.find((p) => p.slug === slug) ?? notFound("Player")),
  staff: () => withFallback<Staff[]>("/api/staff", () => STAFF),
  upcoming: () => withFallback<Match[]>("/api/schedule/upcoming", () => UPCOMING),
  results: () => withFallback<Match[]>("/api/schedule/results", () => RESULTS),
  news: () => withFallback<NewsItem[]>("/api/news", () => NEWS),
  newsItem: (slug: string) =>
    withFallback<NewsItem>(`/api/news/${slug}`, () => NEWS.find((n) => n.slug === slug) ?? notFound("News")),
  gallery: () => withFallback<GalleryItem[]>("/api/gallery", () => GALLERY),
  videos: () => withFallback<VideoItem[]>("/api/videos", () => VIDEOS),
  merch: () => withFallback<MerchItem[]>("/api/merch", () => MERCH),
  faqs: () => withFallback<Faq[]>("/api/faqs", () => FAQS),
  sponsors: () => withFallback<Sponsor[]>("/api/sponsors", () => SPONSORS),
  achievements: () => withFallback<Achievement[]>("/api/achievements", () => ACHIEVEMENTS),
  stats: () => withFallback<Stat[]>("/api/stats", () => STATS),
  heroStats: () => withFallback<Stat[]>("/api/hero-stats", () => HERO_STATS),
};

export async function postContact(payload: { name: string; email: string; subject: string; message: string }) {
  try {
    const res = await fetch(`${base}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json().catch(() => ({ ok: false, error: "Server unreachable" }));
    if (!res.ok || !json.ok) throw new Error(json.error || "Submission failed");
    return json;
  } catch {
    const qs = new URLSearchParams({
      subject: payload.subject || "Contact via horaaesports site",
      body: `${payload.name} (${payload.email})\n\n${payload.message}`,
    });
    window.location.href = `mailto:info@horaaesports.com.np?${qs.toString()}`;
    return { ok: true, fallback: "mailto" };
  }
}
