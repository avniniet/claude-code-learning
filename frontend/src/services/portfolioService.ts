import type { Experience, Profile, Project, Skills } from '../types/portfolio';

/**
 * Read-only source of all portfolio content.
 *
 * The UI depends only on this interface; the concrete implementation is chosen at build time
 * by `VITE_DATA_SOURCE` (see {@link createPortfolioService}):
 * - `static` (default): {@link createStaticPortfolioService} reads `/data/*.json`.
 * - `api`: {@link createApiPortfolioService} calls `/api/v1/*` on `VITE_API_BASE_URL`.
 *
 * Every method resolves to the shapes defined in `types/portfolio.ts` and rejects with an
 * `HttpError` on non-2xx responses, timeouts or network failures. If the caller aborts via
 * `signal`, the promise rejects with the underlying abort error instead.
 */
export interface PortfolioService {
  /**
   * Loads the owner's profile (name, title, summary, stats, links).
   * @param signal Optional abort signal; aborting cancels the request and rejects the promise.
   */
  getProfile(signal?: AbortSignal): Promise<Profile>;
  /**
   * Loads technical and functional skill groups.
   * @param signal Optional abort signal; aborting cancels the request and rejects the promise.
   */
  getSkills(signal?: AbortSignal): Promise<Skills>;
  /**
   * Loads work history, in the order it should be displayed.
   * @param signal Optional abort signal; aborting cancels the request and rejects the promise.
   */
  getExperience(signal?: AbortSignal): Promise<Experience[]>;
  /**
   * Loads all projects. Filtering is done client-side (see `utils/projects.ts`).
   * @param signal Optional abort signal; aborting cancels the request and rejects the promise.
   */
  getProjects(signal?: AbortSignal): Promise<Project[]>;
}
