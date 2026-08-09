import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Reveal from "../components/Reveal";
import { api } from "../api";
import type { NewsItem } from "../../shared/data";

export default function NewsDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [item, setItem] = useState<NewsItem | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setItem(null);
    setNotFound(false);
    if (!slug) return;
    api
      .newsItem(slug)
      .then((n) => {
        setItem(n);
        window.scrollTo({ top: 0, behavior: "auto" });
      })
      .catch(() => setNotFound(true));
  }, [slug]);

  if (notFound) {
    return (
      <main className="page-mini">
        <Reveal className="page-mini-inner">
          <h1>Article not found</h1>
          <p>The requested story doesn't exist.</p>
          <Link className="btn btn-primary" to="/">
            Back to Home
          </Link>
        </Reveal>
      </main>
    );
  }

  if (!item) {
    return (
      <main className="page-mini">
        <div className="page-loader">
          <div className="preloader-bar"><span></span></div>
          <p>LOADING STORY…</p>
        </div>
      </main>
    );
  }

  return (
    <main className="page-news">
      <div className="container container-narrow">
        <Reveal className="player-detail-back">
          <Link to="/#news">← Back to News</Link>
        </Reveal>

        <Reveal as="article" className="news-article">
          <div className="news-article-hero" style={{ background: item.bg }}>
            <span className="news-cat">{item.cat}</span>
            <span className="thumb-emoji">{item.emoji}</span>
          </div>
          <div className="news-article-body">
            <span className="news-date">{item.date}</span>
            <h1>{item.title}</h1>
            {item.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            <div className="news-article-foot">
              <span className="chip gold">HORAA ESPORTS</span>
              <Link className="btn btn-ghost btn-sm" to="/">
                More Stories
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </main>
  );
}
