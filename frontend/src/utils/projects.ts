import type { Experience, Project } from '../types/portfolio';

export interface ProjectFilters {
  projectType: string | null;
  domain: string | null;
}

export function filterProjects(projects: Project[], { projectType, domain }: ProjectFilters): Project[] {
  return projects.filter(
    (p) => (!projectType || p.projectType === projectType) && (!domain || p.domain === domain),
  );
}

export function uniqueValues<T, K extends keyof T>(items: T[], key: K): T[K][] {
  return [...new Set(items.map((i) => i[key]))];
}

export interface ClientSummary {
  client: string;
  employer: string;
  domain: string;
  period: string;
  projectCount: number;
}

/** Derives the "Clients served" list from experience + projects. */
export function summarizeClients(experience: Experience[], projects: Project[]): ClientSummary[] {
  return experience.map((e) => ({
    client: e.client,
    employer: e.employer,
    domain: e.domain,
    period: `${e.start.slice(0, 4)} – ${e.end ? e.end.slice(0, 4) : 'Present'}`,
    projectCount: projects.filter((p) => p.experienceId === e.id).length,
  }));
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function formatYearMonth(value: string | null): string {
  if (!value) return 'Present';
  const [year, month] = value.split('-');
  return `${MONTHS[Number(month) - 1] ?? ''} ${year}`.trim();
}
