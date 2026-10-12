import SectionHeading from "../components/SectionHeading";
import Reveal from "../components/Reveal";
import { DataEmpty, DataError, DataSkeleton } from "../components/DataState";
import { useAsyncData } from "../lib/useAsyncData";
import { api } from "../api";
import type { MerchItem } from "../../shared/data";

export default function Merch() {
  const { data, status, error, retry } = useAsyncData<MerchItem[]>(() => api.merch());
  const items = data ?? [];

  return (
    <section className="section section-alt" id="merch">
      <div className="container">
        <SectionHeading kicker="// The Gear" title="MERCH STORE" sub="Rep the crimson & gold wherever you drop." />
        {status === "loading" && <DataSkeleton count={3} className="merch-grid" label="Loading merch" />}
        {status === "error" && <DataError label="Merch" message={error} onRetry={retry} />}
        {status === "success" && items.length === 0 && (
          <DataEmpty title="Store restocking" hint="New drops land soon — follow the socials for restock alerts." />
        )}
        {status === "success" && items.length > 0 && (
          <div className="merch-grid" aria-live="polite">
            {items.map((m, i) => (
              <Reveal key={m.badge} delay={i * 60} as="article" className="merch-card spotlight">
                <div className="merch-thumb" style={{ background: m.bg }}>
                  <span className="merch-badge">{m.badge}</span>
                  <span className="merch-emoji">{m.emoji}</span>
                </div>
                <div className="merch-info">
                  <h3 className="merch-title">{m.title}</h3>
                  <p className="merch-desc">{m.desc}</p>
                  <div className="merch-foot">
                    <span className="merch-price">{m.price}</span>
                    <a className="btn btn-ghost btn-sm" href="https://shop.horaaesports.com.np/" target="_blank" rel="noopener">
                      Buy Now
                    </a>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
