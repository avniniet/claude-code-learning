import { useCallback, useEffect, useState } from 'react';

/**
 * State of an async load. Discriminate on `status`: `data` is only set on `success`
 * and `error` only on `error`.
 */
export type AsyncState<T> =
  | { status: 'loading'; data?: undefined; error?: undefined }
  | { status: 'success'; data: T; error?: undefined }
  | { status: 'error'; data?: undefined; error: Error };

/**
 * Runs an abortable async loader and tracks its state.
 *
 * The loader runs on mount, again whenever `deps` change, and when `retry` is called. Each run
 * gets a fresh `AbortSignal`; the previous run is aborted (and its result ignored) on re-run
 * and on unmount, so stale responses never overwrite newer state.
 *
 * @param loader Function that performs the load; it should pass `signal` to its requests.
 * @param deps Values that trigger a reload when they change (like `useEffect` deps). The
 *   loader itself is not a dependency.
 * @returns The current {@link AsyncState} plus `retry()`, which re-runs the loader and
 *   resets the state to `loading`.
 */
export function useAsync<T>(loader: (signal: AbortSignal) => Promise<T>, deps: unknown[] = []) {
  const [state, setState] = useState<AsyncState<T>>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setState({ status: 'loading' });
    loader(controller.signal)
      .then((data) => !controller.signal.aborted && setState({ status: 'success', data }))
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        setState({ status: 'error', error: error instanceof Error ? error : new Error(String(error)) });
      });
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);
  return { ...state, retry };
}
