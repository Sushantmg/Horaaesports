import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
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
  type Player,
} from "../shared/data.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.disable("x-powered-by");
// Behind Vercel / proxies the real client IP comes from X-Forwarded-For.
app.set("trust proxy", 1);
const PORT = process.env.PORT || 5001;
const IS_PROD = process.env.NODE_ENV === "production";

app.use(express.json({ limit: "32kb" }));

// Lightweight security headers (avoids adding helmet dependency).
// Note: no strict CSP here — Vite injects inline module scripts and the
// Google Translate widget loads cross-origin. A strict CSP would break prod.
app.use((_req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=()");
  if (process.env.NODE_ENV === "production") {
    res.setHeader("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  }
  next();
});

// Slugs are lookup keys only — reject anything outside the expected shape
// before it reaches the data finders.
const SLUG_RE = /^[a-z0-9-]{1,80}$/;
const isValidSlug = (s: string): boolean => SLUG_RE.test(s);

const ok = (res: express.Response, data: unknown) => res.json({ ok: true, data });
const err = (res: express.Response, status: number, msg: string) =>
  res.status(status).json({ ok: false, error: msg });

// Generic API rate limit (DoS backstop). Registered before routes so it
// actually covers them. In-memory per-process — fine for single-instance.
const apiHits = new Map<string, number[]>();
const WINDOW_MS = 60_000;

function prune(map: Map<string, number[]>, now: number): void {
  // Opportunistic cleanup so the map can't grow unbounded.
  if (map.size < 5000 || Math.random() >= 0.02) return;
  for (const [k, v] of map) {
    if (v.length === 0 || now - v[v.length - 1] > WINDOW_MS) map.delete(k);
  }
}

function hitRateLimited(map: Map<string, number[]>, ip: string, max: number): boolean {
  const now = Date.now();
  const hits = (map.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  hits.push(now);
  map.set(ip, hits);
  prune(map, now);
  return hits.length > max;
}

app.use("/api", (req, res, next) => {
  const ip = req.ip ?? "unknown";
  if (hitRateLimited(apiHits, ip, 180)) return err(res, 429, "Too many requests — slow down.");
  next();
});

/* ---------------- API ROUTES ---------------- */

app.get("/api/health", (_req, res) => ok(res, { status: "up", time: new Date().toISOString() }));

app.get("/api/players", (_req, res) => ok(res, PLAYERS));

app.get("/api/players/:slug", (req, res) => {
  if (!isValidSlug(req.params.slug)) return err(res, 400, "Invalid player slug");
  const player = PLAYERS.find((p: Player) => p.slug === req.params.slug);
  if (!player) return err(res, 404, "Player not found");
  ok(res, player);
});

app.get("/api/staff", (_req, res) => ok(res, STAFF));
app.get("/api/schedule/upcoming", (_req, res) => ok(res, UPCOMING));
app.get("/api/schedule/results", (_req, res) => ok(res, RESULTS));
app.get("/api/news", (_req, res) => ok(res, NEWS));

app.get("/api/news/:slug", (req, res) => {
  if (!isValidSlug(req.params.slug)) return err(res, 400, "Invalid article slug");
  const item = NEWS.find((n) => n.slug === req.params.slug);
  if (!item) return err(res, 404, "Article not found");
  ok(res, item);
});

app.get("/api/gallery", (_req, res) => ok(res, GALLERY));
app.get("/api/videos", (_req, res) => ok(res, VIDEOS));
app.get("/api/merch", (_req, res) => ok(res, MERCH));
app.get("/api/faqs", (_req, res) => ok(res, FAQS));
app.get("/api/sponsors", (_req, res) => ok(res, SPONSORS));
app.get("/api/drop-zones", (_req, res) => ok(res, DROP_ZONES));
app.get("/api/achievements", (_req, res) => ok(res, ACHIEVEMENTS));
app.get("/api/stats", (_req, res) => ok(res, STATS));
app.get("/api/hero-stats", (_req, res) => ok(res, HERO_STATS));

// Strict contact limit (per-process, in-memory).
const contactHits = new Map<string, number[]>();

app.post("/api/contact", (req, res) => {
  const ip = req.ip ?? "unknown";
  if (hitRateLimited(contactHits, ip, 10)) return err(res, 429, "Too many messages — try again in a minute.");
  const raw = req.body || {};
  const name = String(raw.name ?? "").trim();
  const email = String(raw.email ?? "").trim();
  const subject = String(raw.subject ?? "").trim();
  const message = String(raw.message ?? "").trim();
  if (!name || !email || !message) return err(res, 400, "Name, email and message are required.");
  if (name.length < 2 || name.length > 120) return err(res, 400, "Name must be 2–120 characters.");
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return err(res, 400, "Invalid email address.");
  if (subject.length > 200) return err(res, 400, "Subject is too long.");
  if (message.length < 10 || message.length > 5000)
    return err(res, 400, "Message must be 10–5000 characters.");
  console.log(`[contact] ${name} <${email}> — ${subject}: ${message.slice(0, 500)}`);
  ok(res, { received: true, note: "Thanks — the camp will get back to you." });
});

// Unknown API routes should return JSON, not the SPA shell.
app.use("/api", (_req, res) => err(res, 404, "API route not found"));

// Malformed JSON should be a 400, not a crash.
app.use(
  (e: unknown, _req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (e && typeof e === "object" && (e as { type?: string }).type === "entity.parse.failed") {
      return err(res, 400, "Invalid JSON body.");
    }
    next(e);
  }
);

// Global fallback — never leak stack traces to clients.
app.use(
  (e: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error("[horaa] unhandled error:", e);
    if (res.headersSent) return;
    err(res, 500, "Internal server error.");
  }
);

/* ---------------- CLIENT (production) ---------------- */

if (IS_PROD) {
  const dist = path.join(__dirname, "..", "dist");
  if (fs.existsSync(dist)) {
    // Hashed Vite assets (`/assets/*`) are content-addressed and safe to cache
    // for a year (matches vercel.json); everything else stays short-lived.
    app.use(
      express.static(dist, {
        maxAge: "1h",
        index: false,
        dotfiles: "ignore",
        setHeaders: (res, filePath) => {
          if (filePath.includes(`${path.sep}assets${path.sep}`)) {
            res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
          }
        },
      })
    );
    // SPA fallback via middleware (works on Express 4 and 5).
    // GET/HEAD-only: other methods on unknown routes (e.g. stray POSTs) get a 404, not index.html.
    app.use((req, res) => {
      if (req.method !== "GET" && req.method !== "HEAD") return err(res, 404, "Not found");
      res.setHeader("Cache-Control", "no-cache");
      res.sendFile(path.join(dist, "index.html"));
    });
  }
}

app.listen(PORT, () => {
  console.log(`[horaa] API server listening on http://localhost:${PORT}${IS_PROD ? " (production)" : " (dev)"}`);
});
