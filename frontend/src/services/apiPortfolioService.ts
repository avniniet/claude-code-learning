import type { HttpClient } from './httpClient';
import type { PortfolioService } from './portfolioService';
import type { Experience, Profile, Project, Skills } from '../types/portfolio';

/**
 * {@link PortfolioService} backed by the REST API: `GET /api/v1/{profile,skills,experience,projects}`.
 * Endpoints must return the shapes in `types/portfolio.ts` (see decisions/0002).
 * Enable with `VITE_DATA_SOURCE=api`.
 *
 * @param http Client whose `baseUrl` points at the backend (`VITE_API_BASE_URL`; empty means
 *   same origin, proxied by nginx).
 */
export function createApiPortfolioService(http: HttpClient): PortfolioService {
  return {
    getProfile: (signal) => http.get<Profile>('/api/v1/profile', { signal }),
    getSkills: (signal) => http.get<Skills>('/api/v1/skills', { signal }),
    getExperience: (signal) => http.get<Experience[]>('/api/v1/experience', { signal }),
    getProjects: (signal) => http.get<Project[]>('/api/v1/projects', { signal }),
  };
}
