import type { HttpClient } from './httpClient';
import type { PortfolioService } from './portfolioService';
import type { Experience, Profile, Project, Skills } from '../types/portfolio';

/** Reads bundled JSON from /data (frontend/public/data). */
export function createStaticPortfolioService(http: HttpClient): PortfolioService {
  return {
    getProfile: (signal) => http.get<Profile>('/data/profile.json', { signal }),
    getSkills: (signal) => http.get<Skills>('/data/skills.json', { signal }),
    getExperience: (signal) => http.get<Experience[]>('/data/experience.json', { signal }),
    getProjects: (signal) => http.get<Project[]>('/data/projects.json', { signal }),
  };
}
