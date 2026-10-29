import { config as defaultConfig, type AppConfig } from '../config/env';
import { createApiPortfolioService } from './apiPortfolioService';
import { createHttpClient } from './httpClient';
import type { PortfolioService } from './portfolioService';
import { createStaticPortfolioService } from './staticPortfolioService';

export function createPortfolioService(config: AppConfig = defaultConfig): PortfolioService {
  if (config.dataSource === 'api') {
    return createApiPortfolioService(
      createHttpClient({ baseUrl: config.apiBaseUrl, timeoutMs: config.requestTimeoutMs }),
    );
  }
  return createStaticPortfolioService(createHttpClient({ timeoutMs: config.requestTimeoutMs }));
}

export const portfolioService = createPortfolioService();

export type { PortfolioService } from './portfolioService';
export { HttpError } from './httpClient';
