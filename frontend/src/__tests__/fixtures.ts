import experience from '../../public/data/experience.json';
import profile from '../../public/data/profile.json';
import projects from '../../public/data/projects.json';
import skills from '../../public/data/skills.json';
import type { Experience, Profile, Project, Skills } from '../types/portfolio';

// Typed against the real data files, so schema drift fails type-checking.
export const fixtures = {
  '/data/profile.json': profile as Profile,
  '/data/skills.json': skills as Skills,
  '/data/experience.json': experience as Experience[],
  '/data/projects.json': projects as Project[],
};

export function mockFetch(routes: Record<string, unknown> = fixtures) {
  return vi.fn(async (input: RequestInfo | URL) => {
    const url = String(input);
    if (url in routes) return new Response(JSON.stringify(routes[url]), { status: 200 });
    return new Response('not found', { status: 404 });
  });
}
