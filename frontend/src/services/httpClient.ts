/**
 * Error thrown by {@link HttpClient.get} for every failure except a caller-initiated abort.
 *
 * `status` is the HTTP status for non-2xx responses, or `null` for timeouts and network errors.
 */
export class HttpError extends Error {
  constructor(
    message: string,
    public readonly status: number | null,
    public readonly url: string,
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

/** Options for {@link createHttpClient}. */
export interface HttpClientOptions {
  /** Prefix for every request path, without a trailing slash. Defaults to `''` (same origin). */
  baseUrl?: string;
  /** Per-request timeout in milliseconds. Defaults to `10_000`. */
  timeoutMs?: number;
  /** Hook for future auth headers, tracing, etc. */
  getHeaders?: () => Record<string, string>;
}

/** Minimal JSON-over-HTTP client used by the portfolio services. */
export interface HttpClient {
  /**
   * Sends `GET {baseUrl}{path}` with `Accept: application/json` and parses the body as JSON.
   *
   * The body is cast to `T` without runtime validation.
   *
   * @param path Path appended to `baseUrl`, e.g. `/data/profile.json`.
   * @param init.signal Optional abort signal. Aborting rejects with the native abort error,
   *   not an {@link HttpError}.
   * @throws {HttpError} On a non-2xx response, a timeout (`status: null`, message
   *   `Request timed out`) or a network failure (`status: null`).
   */
  get<T>(path: string, init?: { signal?: AbortSignal }): Promise<T>;
}

/**
 * Creates a fetch-based {@link HttpClient}.
 *
 * @example
 * const http = createHttpClient({ baseUrl: 'https://api.example.com', timeoutMs: 5000 });
 * const profile = await http.get<Profile>('/api/v1/profile');
 */
export function createHttpClient({ baseUrl = '', timeoutMs = 10_000, getHeaders }: HttpClientOptions = {}): HttpClient {
  return {
    async get<T>(path: string, init: { signal?: AbortSignal } = {}): Promise<T> {
      const url = `${baseUrl}${path}`;
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      const onAbort = () => controller.abort();
      init.signal?.addEventListener('abort', onAbort);

      try {
        const res = await fetch(url, {
          headers: { Accept: 'application/json', ...getHeaders?.() },
          signal: controller.signal,
        });
        if (!res.ok) throw new HttpError(`Request failed with ${res.status}`, res.status, url);
        return (await res.json()) as T;
      } catch (err) {
        if (err instanceof HttpError) throw err;
        if (controller.signal.aborted && !init.signal?.aborted) {
          throw new HttpError('Request timed out', null, url);
        }
        if (init.signal?.aborted) throw err;
        throw new HttpError(err instanceof Error ? err.message : 'Network error', null, url);
      } finally {
        clearTimeout(timer);
        init.signal?.removeEventListener('abort', onAbort);
      }
    },
  };
}
