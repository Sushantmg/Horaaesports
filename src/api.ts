const base = "";

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${base}${path}`);
  if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`);
  const json = await res.json();
  if (!json.ok) throw new Error(json.error || "Unknown API error");
  return json.data as T;
}

export const api = {
  get,
  players: () => get<import("../shared/data").Player[]>("/api/players"),
  player: (slug: string) => get<import("../shared/data").Player>(`/api/players/${slug}`),
  staff: () => get<import("../shared/data").Staff[]>("/api/staff"),
  upcoming: () => get<import("../shared/data").Match[]>("/api/schedule/upcoming"),
  results: () => get<import("../shared/data").Match[]>("/api/schedule/results"),
  news: () => get<import("../shared/data").NewsItem[]>("/api/news"),
  newsItem: (slug: string) => get<import("../shared/data").NewsItem>(`/api/news/${slug}`),
  gallery: () => get<import("../shared/data").GalleryItem[]>("/api/gallery"),
  merch: () => get<import("../shared/data").MerchItem[]>("/api/merch"),
  faqs: () => get<import("../shared/data").Faq[]>("/api/faqs"),
  sponsors: () => get<import("../shared/data").Sponsor[]>("/api/sponsors"),
  achievements: () => get<import("../shared/data").Achievement[]>("/api/achievements"),
  stats: () => get<import("../shared/data").Stat[]>("/api/stats"),
  heroStats: () => get<import("../shared/data").Stat[]>("/api/hero-stats"),
};

export async function postContact(payload: { name: string; email: string; subject: string; message: string }) {
  const res = await fetch(`${base}/api/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await res.json().catch(() => ({ ok: false, error: "Server unreachable" }));
  if (!res.ok || !json.ok) throw new Error(json.error || "Submission failed");
  return json;
}
