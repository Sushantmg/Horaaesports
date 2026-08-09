import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
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
  type Player,
} from "../shared/data.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 5001;
const IS_PROD = process.env.NODE_ENV === "production";

app.use(express.json());

const ok = (res: express.Response, data: unknown) => res.json({ ok: true, data });
const err = (res: express.Response, status: number, msg: string) =>
  res.status(status).json({ ok: false, error: msg });

/* ---------------- API ROUTES ---------------- */

app.get("/api/health", (_req, res) => ok(res, { status: "up", time: new Date().toISOString() }));

app.get("/api/players", (_req, res) => ok(res, PLAYERS));

app.get("/api/players/:slug", (req, res) => {
  const player = PLAYERS.find((p: Player) => p.slug === req.params.slug);
  if (!player) return err(res, 404, "Player not found");
  ok(res, player);
});

app.get("/api/staff", (_req, res) => ok(res, STAFF));
app.get("/api/schedule/upcoming", (_req, res) => ok(res, UPCOMING));
app.get("/api/schedule/results", (_req, res) => ok(res, RESULTS));
app.get("/api/news", (_req, res) => ok(res, NEWS));

app.get("/api/news/:slug", (req, res) => {
  const item = NEWS.find((n) => n.slug === req.params.slug);
  if (!item) return err(res, 404, "Article not found");
  ok(res, item);
});

app.get("/api/gallery", (_req, res) => ok(res, GALLERY));
app.get("/api/merch", (_req, res) => ok(res, MERCH));
app.get("/api/faqs", (_req, res) => ok(res, FAQS));
app.get("/api/sponsors", (_req, res) => ok(res, SPONSORS));
app.get("/api/achievements", (_req, res) => ok(res, ACHIEVEMENTS));
app.get("/api/stats", (_req, res) => ok(res, STATS));
app.get("/api/hero-stats", (_req, res) => ok(res, HERO_STATS));

app.post("/api/contact", (req, res) => {
  const { name, email, subject, message } = req.body || {};
  if (!name || !email || !message) return err(res, 400, "Name, email and message are required.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return err(res, 400, "Invalid email address.");
  console.log(`[contact] ${name} <${email}> — ${subject}: ${message}`);
  ok(res, { received: true, note: "Thanks — the camp will get back to you." });
});

/* ---------------- CLIENT (production) ---------------- */

if (IS_PROD) {
  const dist = path.join(__dirname, "..", "dist");
  if (fs.existsSync(dist)) {
    app.use(express.static(dist));
    app.get("*", (_req, res) => res.sendFile(path.join(dist, "index.html")));
  }
}

app.listen(PORT, () => {
  console.log(`[horaa] API server listening on http://localhost:${PORT}${IS_PROD ? " (production)" : " (dev)"}`);
});
