/**
 * Domain models for portfolio content.
 * These are the contract a future backend must return (see decisions/0002).
 */

export interface SocialLink {
  label: string;
  url: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface Profile {
  name: string;
  title: string;
  currentRole: string;
  location: string;
  yearsOfExperience: string;
  tagline: string;
  summary: string;
  stats: Stat[];
  links: SocialLink[];
  /** Optional public contact details; the UI hides them when absent (see decisions/0003). */
  email?: string;
  phone?: string;
  /**
   * Optional recommendations (e.g. copied from LinkedIn, with the recommender's consent).
   * The Recommendations section is hidden when this is absent or has no valid entries.
   */
  recommendations?: Recommendation[];
}

/** A recommendation quote from a colleague or client. */
export interface Recommendation {
  /** The recommendation text, shown verbatim. */
  quote: string;
  /** Name of the person who wrote it. */
  author: string;
  /** Their title and company, e.g. "Director of Engineering, Example Corp". */
  authorTitle?: string;
  /** How they worked together, e.g. "Managed me directly". */
  relationship?: string;
  /** ISO year-month the recommendation was given, e.g. "2025-03". */
  date?: string;
}

export interface SkillCategory {
  category: string;
  items: string[];
}

export interface Skills {
  technical: SkillCategory[];
  functional: SkillCategory[];
}

export interface Experience {
  id: string;
  role: string;
  employer: string;
  client: string;
  domain: string;
  /** ISO year-month, e.g. "2024-06" */
  start: string;
  /** ISO year-month, or null when current */
  end: string | null;
  highlights: string[];
  stack: string[];
}

export interface Impact {
  metric: string;
  description: string;
}

export interface Project {
  id: string;
  name: string;
  summary: string;
  client: string;
  employer: string;
  domain: string;
  projectType: string;
  role: string;
  teamSize?: string;
  /** References Experience.id */
  experienceId: string;
  impact: Impact[];
  stack: string[];
}

export interface PortfolioData {
  profile: Profile;
  skills: Skills;
  experience: Experience[];
  projects: Project[];
}
