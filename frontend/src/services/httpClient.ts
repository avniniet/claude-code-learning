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

export interface HttpClientOptions {
  baseUrl?: string;
  timeoutMs?: number;
  /** Hook for future auth headers, tracing, etc. */
  getHeaders?: () => Record<string, string>;
}

export interface HttpClient {
  get<T>(path: string, init?: { signal?: AbortSignal }): Promise<T>;
}

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
