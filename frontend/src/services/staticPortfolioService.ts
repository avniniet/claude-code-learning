import type { HttpClient } from './httpClient';
import type { PortfolioService } from './portfolioService';
import type { Experience, Profile, Project, Skills } from '../types/portfolio';

/**
 * {@link PortfolioService} that reads the bundled JSON files served from `/data`
 * (source: `frontend/public/data`). Used when `VITE_DATA_SOURCE` is `static` or unset.
 *
 * @param http Client used for requests; it should have no `baseUrl` so `/data` resolves
 *   against the site's own origin.
 */
export function createStaticPortfolioService(http: HttpClient): PortfolioService {
  return {
    getProfile: (signal) => http.get<Profile>('/data/profile.json', { signal }),
    getSkills: (signal) => http.get<Skills>('/data/skills.json', { signal }),
    getExperience: (signal) => http.get<Experience[]>('/data/experience.json', { signal }),
    getProjects: (signal) => http.get<Project[]>('/data/projects.json', { signal }),
  };
}
