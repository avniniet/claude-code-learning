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
