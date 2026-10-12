import { Link } from "react-router-dom";
import SectionHeading from "../components/SectionHeading";
import Reveal from "../components/Reveal";
import { DataEmpty, DataError, DataSkeleton } from "../components/DataState";
import { useAsyncData } from "../lib/useAsyncData";
import { api } from "../api";
import type { NewsItem } from "../../shared/data";

export default function News({ heading = true }: { heading?: boolean }) {
  const { data, status, error, retry } = useAsyncData<NewsItem[]>(() => api.news());
  const items = data ?? [];

  return (
    <section className="section section-alt" id="news">
      <div className="container">
        {heading && (
          <SectionHeading
            kicker="// The Wire"
            title="LATEST NEWS"
            sub="Announcements, transfers, and tournament recaps straight from the camp."
          />
        )}
        {status === "loading" && <DataSkeleton count={3} className="news-grid" label="Loading news" />}
        {status === "error" && <DataError label="News" message={error} onRetry={retry} />}
        {status === "success" && items.length === 0 && (
          <DataEmpty title="No stories yet" hint="Match recaps and announcements will drop here soon." />
        )}
        {status === "success" && items.length > 0 && (
          <div className="news-grid" aria-live="polite">
            {items.map((n, i) => (
              <Reveal key={n.slug} delay={i * 60} as="article" className="news-card spotlight">
                <div className="news-thumb" style={{ background: n.bg }}>
                  <span className="news-cat">{n.cat}</span>
                  <span className="thumb-emoji">{n.emoji}</span>
                </div>
                <div className="news-body">
                  <span className="news-date">{n.date}</span>
                  <h3 className="news-title">{n.title}</h3>
                  <p className="news-excerpt">{n.excerpt}</p>
                  <Link className="news-link" to={`/news/${n.slug}`}>
                    Read More <span>→</span>
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
