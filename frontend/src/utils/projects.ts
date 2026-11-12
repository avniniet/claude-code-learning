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

export interface ResumeLink {
  href: string;
  /** True for same-origin paths, where the browser's `download` attribute applies. */
  sameOrigin: boolean;
}

/**
 * Validates `Profile.resumeUrl`. Accepts a same-origin absolute path ("/resume.pdf") or an
 * absolute http(s) URL; anything else (missing, relative, protocol-relative, `javascript:`)
 * returns null so a bad value in the data never becomes a link.
 */
export function resumeLink(value: string | undefined): ResumeLink | null {
  const href = value?.trim();
  if (!href) return null;
  if (href.startsWith('/') && !href.startsWith('//')) return { href, sameOrigin: true };
  try {
    const url = new URL(href);
    return url.protocol === 'http:' || url.protocol === 'https:' ? { href, sameOrigin: false } : null;
  } catch {
    return null;
  }
}
