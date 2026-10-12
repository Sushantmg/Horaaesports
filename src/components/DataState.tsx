interface SkeletonProps {
  count?: number;
  className?: string;
  label?: string;
}

/** Shimmer placeholder grid shown while section data loads. */
export function DataSkeleton({ count = 6, className = "news-grid", label = "Loading content" }: SkeletonProps) {
  return (
    <div className={className} aria-hidden="false">
      <div className="data-loading" role="status" aria-live="polite" aria-label={label}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="skeleton-card" aria-hidden="true">
            <div className="skeleton-block skeleton-media" />
            <div className="skeleton-block skeleton-line" />
            <div className="skeleton-block skeleton-line short" />
          </div>
        ))}
        <span className="sr-only">{label}…</span>
      </div>
    </div>
  );
}

interface ErrorProps {
  message?: string;
  onRetry: () => void;
  label?: string;
}

/** Retryable error banner — `role="alert"` so screen readers announce it. */
export function DataError({ message, onRetry, label = "Content" }: ErrorProps) {
  return (
    <div className="data-state data-error" role="alert">
      <span className="data-state-icon" aria-hidden="true">
        ⚠
      </span>
      <div className="data-state-body">
        <p className="data-state-title">{label} failed to load</p>
        <p className="data-state-hint">{message || "Check your connection and try again."}</p>
      </div>
      <button type="button" className="btn btn-ghost btn-sm" onClick={onRetry}>
        Retry <span aria-hidden="true">↻</span>
      </button>
    </div>
  );
}

interface EmptyProps {
  title: string;
  hint?: string;
}

/** Friendly empty state when an API returns zero items. */
export function DataEmpty({ title, hint }: EmptyProps) {
  return (
    <div className="data-state data-empty" role="status" aria-live="polite">
      <span className="data-state-icon" aria-hidden="true">
        ○
      </span>
      <div className="data-state-body">
        <p className="data-state-title">{title}</p>
        {hint && <p className="data-state-hint">{hint}</p>}
      </div>
    </div>
  );
}
