export type DataSource = 'static' | 'api';

export interface AppConfig {
  dataSource: DataSource;
  /** Base URL for the backend; empty string means same origin (nginx proxies /api). */
  apiBaseUrl: string;
  requestTimeoutMs: number;
}

export function readConfig(env: Record<string, string | undefined> = import.meta.env): AppConfig {
  const dataSource: DataSource = env.VITE_DATA_SOURCE === 'api' ? 'api' : 'static';
  return {
    dataSource,
    apiBaseUrl: (env.VITE_API_BASE_URL ?? '').replace(/\/+$/, ''),
    requestTimeoutMs: Number(env.VITE_REQUEST_TIMEOUT_MS) || 10_000,
  };
}

export const config = readConfig();
