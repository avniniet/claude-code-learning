import { config as defaultConfig, type AppConfig } from '../config/env';
import { createApiPortfolioService } from './apiPortfolioService';
import { createHttpClient } from './httpClient';
import type { PortfolioService } from './portfolioService';
import { createStaticPortfolioService } from './staticPortfolioService';

/**
 * Builds the {@link PortfolioService} selected by `config.dataSource`:
 * `api` returns the backend implementation using `config.apiBaseUrl`, anything else returns
 * the static JSON implementation. Both use `config.requestTimeoutMs`.
 *
 * @param config App configuration; defaults to the values read from `import.meta.env`.
 */
export function createPortfolioService(config: AppConfig = defaultConfig): PortfolioService {
  if (config.dataSource === 'api') {
    return createApiPortfolioService(
      createHttpClient({ baseUrl: config.apiBaseUrl, timeoutMs: config.requestTimeoutMs }),
    );
  }
  return createStaticPortfolioService(createHttpClient({ timeoutMs: config.requestTimeoutMs }));
}

/** App-wide service instance, created once from the build-time environment. */
export const portfolioService = createPortfolioService();

export type { PortfolioService } from './portfolioService';
export { HttpError } from './httpClient';
