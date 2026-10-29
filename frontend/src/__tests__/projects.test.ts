import { filterProjects, formatYearMonth, summarizeClients, uniqueValues } from '../utils/projects';
import { fixtures } from './fixtures';

const projects = fixtures['/data/projects.json'];
const experience = fixtures['/data/experience.json'];

describe('filterProjects', () => {
  it('returns all with no filters', () => {
    expect(filterProjects(projects, { projectType: null, domain: null })).toHaveLength(projects.length);
  });
  it('filters by domain', () => {
    const result = filterProjects(projects, { projectType: null, domain: 'Healthcare' });
    expect(result.map((p) => p.client)).toEqual(['CVS – Omnicare']);
  });
  it('combines type and domain', () => {
    expect(filterProjects(projects, { projectType: 'Mobile App', domain: 'Healthcare' })).toEqual([]);
  });
});

describe('helpers', () => {
  it('uniqueValues dedupes', () => {
    expect(uniqueValues(projects, 'domain')).toEqual(['Telecom & Supply Chain', 'Retail', 'Healthcare']);
  });
  it('summarizeClients links each client to its projects', () => {
    const clients = summarizeClients(experience, projects);
    expect(clients).toHaveLength(6);
    expect(clients[0]).toMatchObject({ client: 'Verizon', period: '2024 – Present', projectCount: 1 });
  });
  it('every project references an existing experience', () => {
    const ids = new Set(experience.map((e) => e.id));
    projects.forEach((p) => expect(ids.has(p.experienceId)).toBe(true));
  });
  it('formatYearMonth', () => {
    expect(formatYearMonth('2021-03')).toBe('Mar 2021');
    expect(formatYearMonth(null)).toBe('Present');
  });
});
