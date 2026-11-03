import { portfolioService } from '../services';
import type { PortfolioData } from '../types/portfolio';
import { useAsync } from './useAsync';

/**
 * Loads all portfolio content (profile, skills, experience, projects) in parallel from
 * `portfolioService`. Sections receive plain data, not services.
 *
 * Fails as a whole if any request fails; call `retry()` to reload everything.
 *
 * @returns {@link AsyncState} of {@link PortfolioData}, plus `retry()`.
 */
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
