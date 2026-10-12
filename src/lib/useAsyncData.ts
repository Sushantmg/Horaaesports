import { useCallback, useEffect, useRef, useState } from "react";

export type AsyncStatus = "loading" | "error" | "success";

interface AsyncState<T> {
  data: T | null;
  status: AsyncStatus;
  error: string;
  loading: boolean;
  retry: () => void;
}

/**
 * Shared data-fetch hook for section-level UX states.
 * - Starts in `loading` so skeletons show on first paint.
 * - Guards against setState after unmount / stale retries.
 * - Exposes `retry` for error banners.
 */
export function useAsyncData<T>(loader: () => Promise<T>): AsyncState<T> {
  const [data, setData] = useState<T | null>(null);
  const [status, setStatus] = useState<AsyncStatus>("loading");
  const [error, setError] = useState("");
  const attempt = useRef(0);
  const loaderRef = useRef(loader);
  loaderRef.current = loader;

  const retry = useCallback(() => {
    const id = ++attempt.current;
    setStatus("loading");
    setError("");
    loaderRef
      .current()
      .then((result) => {
        if (attempt.current !== id) return;
        setData(result);
        setStatus("success");
      })
      .catch((e) => {
        if (attempt.current !== id) return;
        setError(e instanceof Error ? e.message : "Failed to load data.");
        setStatus("error");
      });
  }, []);

  useEffect(() => {
    retry();
    return () => {
      attempt.current += 1;
    };
  }, [retry]);

  return { data, status, error, loading: status === "loading", retry };
}
