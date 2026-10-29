import type { Experience, Profile, Project, Skills } from '../types/portfolio';

/** UI depends only on this interface; swap implementations via VITE_DATA_SOURCE. */
export interface PortfolioService {
  getProfile(signal?: AbortSignal): Promise<Profile>;
  getSkills(signal?: AbortSignal): Promise<Skills>;
  getExperience(signal?: AbortSignal): Promise<Experience[]>;
  getProjects(signal?: AbortSignal): Promise<Project[]>;
}
