import SectionHeading from "../components/SectionHeading";
import Reveal from "../components/Reveal";
import { DataEmpty, DataError, DataSkeleton } from "../components/DataState";
import { useAsyncData } from "../lib/useAsyncData";
import { usePointerGlow } from "../lib/usePointerGlow";
import { api } from "../api";
import type { Sponsor } from "../../shared/data";

export default function Sponsors() {
  const { data, status, error, retry } = useAsyncData<Sponsor[]>(() => api.sponsors());
  const items = data ?? [];
  const onPointerMove = usePointerGlow<HTMLAnchorElement>();

  return (
    <section className="section" id="sponsors">
      <div className="container">
        <SectionHeading
          kicker="// The Support"
          title="SPONSORS & PARTNERS"
          sub="Champions stand on the shoulders of their partners."
        />
        {status === "loading" && <DataSkeleton count={4} className="sponsors" label="Loading sponsors" />}
        {status === "error" && <DataError label="Sponsors" message={error} onRetry={retry} />}
        {status === "success" && items.length === 0 && (
          <DataEmpty title="No partners listed" hint="Want your logo here? Head to the contact section." />
        )}
        {status === "success" && items.length > 0 && (
          <Reveal className="sponsors">
            {items.map((s) => (
              <a
                className="sponsor spotlight"
                key={s.name}
                href={s.url}
                target="_blank"
                rel="noopener"
                onPointerMove={onPointerMove}
              >
                {s.logo ? (
                  <img className="sponsor-logo" src={s.logo} alt={s.name} loading="lazy" />
                ) : (
                  <span className="sponsor-icon">{s.icon}</span>
                )}
                <span>{s.name}</span>
              </a>
            ))}
          </Reveal>
        )}
      </div>
    </section>
  );
}
