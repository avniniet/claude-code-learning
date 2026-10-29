import { portfolioService } from '../services';
import type { PortfolioData } from '../types/portfolio';
import { useAsync } from './useAsync';

/** Loads all portfolio content in parallel. Sections receive plain data, not services. */
export function usePortfolio() {
  return useAsync<PortfolioData>(async (signal) => {
    const [profile, skills, experience, projects] = await Promise.all([
      portfolioService.getProfile(signal),
      portfolioService.getSkills(signal),
      portfolioService.getExperience(signal),
      portfolioService.getProjects(signal),
    ]);
    return { profile, skills, experience, projects };
  });
}
