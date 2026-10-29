import type { HttpClient } from './httpClient';
import type { PortfolioService } from './portfolioService';
import type { Experience, Profile, Project, Skills } from '../types/portfolio';

/**
 * Backend implementation. Endpoints must return the shapes in types/portfolio.ts.
 * Enable with VITE_DATA_SOURCE=api.
 */
export function createApiPortfolioService(http: HttpClient): PortfolioService {
  return {
    getProfile: (signal) => http.get<Profile>('/api/v1/profile', { signal }),
    getSkills: (signal) => http.get<Skills>('/api/v1/skills', { signal }),
    getExperience: (signal) => http.get<Experience[]>('/api/v1/experience', { signal }),
    getProjects: (signal) => http.get<Project[]>('/api/v1/projects', { signal }),
  };
}
