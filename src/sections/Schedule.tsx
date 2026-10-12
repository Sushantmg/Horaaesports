import { useState } from "react";
import SectionHeading from "../components/SectionHeading";
import Reveal from "../components/Reveal";
import Countdown from "../components/Countdown";
import { DataEmpty, DataError, DataSkeleton } from "../components/DataState";
import { useAsyncData } from "../lib/useAsyncData";
import { api } from "../api";
import type { Match } from "../../shared/data";

type Tab = "upcoming" | "results";

function MatchCard({ m, i }: { m: Match; i: number }) {
  const [datePart, ...rest] = m.date.split("·");
  return (
    <Reveal delay={i * 60} className="match-card">
      <div className="match-date">
        <b>{datePart}</b>
        {rest.length > 0 && <>· {rest.join("·")}</>}
      </div>
      <div className="match-main">
        <div className="match-event">{m.event}</div>
        <div className="match-detail">{m.detail}</div>
      </div>
      <span className={`match-badge ${m.cls}`}>{m.badge}</span>
    </Reveal>
  );
}

export default function Schedule({ heading = true }: { heading?: boolean }) {
  const [tab, setTab] = useState<Tab>("upcoming");
  const upcomingQuery = useAsyncData<Match[]>(() => api.upcoming());
  const resultsQuery = useAsyncData<Match[]>(() => api.results());
  const upcoming = upcomingQuery.data ?? [];
  const results = resultsQuery.data ?? [];
  const loading = upcomingQuery.loading || resultsQuery.loading;
  const failed = upcomingQuery.status === "error" || resultsQuery.status === "error";

  const retryAll = () => {
    if (upcomingQuery.status === "error") upcomingQuery.retry();
    if (resultsQuery.status === "error") resultsQuery.retry();
  };

  const visible = tab === "upcoming" ? upcoming : results;

  return (
    <section className="section" id="schedule">
      <div className="container">
        {heading && (
          <SectionHeading
            kicker="// The Campaign"
            title="SCHEDULE & RESULTS"
            sub="Every drop, every rotation, every win — tracked."
          />
        )}

        <div className="tabs" role="tablist" aria-label="Schedule tabs">
          <button
            className={`tab-btn ${tab === "upcoming" ? "active" : ""}`}
            role="tab"
            aria-selected={tab === "upcoming"}
            onClick={() => setTab("upcoming")}
          >
            Upcoming
          </button>
          <button
            className={`tab-btn ${tab === "results" ? "active" : ""}`}
            role="tab"
            aria-selected={tab === "results"}
            onClick={() => setTab("results")}
          >
            Results
          </button>
        </div>

        {loading && <DataSkeleton count={3} className="schedule-list" label="Loading schedule" />}
        {!loading && failed && (
          <DataError
            label="Schedule"
            message={[upcomingQuery.error, resultsQuery.error].filter(Boolean).join(" ")}
            onRetry={retryAll}
          />
        )}
        {!loading && !failed && visible.length === 0 && (
          <DataEmpty
            title={tab === "upcoming" ? "No upcoming matches" : "No results yet"}
            hint={
              tab === "upcoming"
                ? "The next qualifier will be announced here soon."
                : "Finished matches and placements will appear here."
            }
          />
        )}
        {!loading && !failed && visible.length > 0 && (
          <div className="schedule-list schedule-list--anim" key={tab} aria-live="polite">
            {tab === "upcoming" &&
              upcoming.map((m, i) =>
                m.countdown ? (
                  <div key={m.event} className="schedule-block">
                    <Countdown target={m.countdown} label={m.countdownLabel || "COUNTDOWN"} />
                    <MatchCard m={m} i={i} />
                  </div>
                ) : (
                  <MatchCard key={m.event} m={m} i={i} />
                )
              )}
            {tab === "results" && results.map((m, i) => <MatchCard key={m.event} m={m} i={i} />)}
          </div>
        )}
      </div>
    </section>
  );
}
