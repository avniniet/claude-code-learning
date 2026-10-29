import { useMemo, useState } from 'react';
import { SectionHeader } from '../components/SectionHeader';
import { TagList } from '../components/TagList';
import type { Project } from '../types/portfolio';
import { filterProjects, uniqueValues, type ProjectFilters } from '../utils/projects';

interface FilterRowProps {
  label: string;
  options: string[];
  value: string | null;
  onChange: (value: string | null) => void;
}

function FilterRow({ label, options, value, onChange }: FilterRowProps) {
  return (
    <div className="filter-row" role="group" aria-label={`Filter by ${label.toLowerCase()}`}>
      <span className="filter-row__label">{label}</span>
      <button type="button" className="chip" aria-pressed={value === null} onClick={() => onChange(null)}>All</button>
      {options.map((o) => (
        <button key={o} type="button" className="chip" aria-pressed={value === o} onClick={() => onChange(o)}>
          {o}
        </button>
      ))}
    </div>
  );
}

export function Projects({ projects }: { projects: Project[] }) {
  const [filters, setFilters] = useState<ProjectFilters>({ projectType: null, domain: null });
  const types = useMemo(() => uniqueValues(projects, 'projectType'), [projects]);
  const domains = useMemo(() => uniqueValues(projects, 'domain'), [projects]);
  const visible = filterProjects(projects, filters);

  return (
    <section className="section" aria-labelledby="projects">
      <div className="container">
        <SectionHeader
          id="projects"
          eyebrow="Projects"
          title="Selected enterprise projects"
          subtitle="Greenfield builds, modernizations, reactive platforms and production support across telecom, retail and healthcare."
        />
        <div className="filters">
          <FilterRow label="Type" options={types} value={filters.projectType} onChange={(projectType) => setFilters((f) => ({ ...f, projectType }))} />
          <FilterRow label="Domain" options={domains} value={filters.domain} onChange={(domain) => setFilters((f) => ({ ...f, domain }))} />
        </div>
        {visible.length === 0 ? (
          <p className="empty">No projects match these filters.</p>
        ) : (
          <div className="projects-grid" aria-live="polite">
            {visible.map((p) => (
              <article key={p.id} className="card project">
                <div className="project__top">
                  <span className="tag tag--accent">{p.projectType}</span>
                  <span className="tag">{p.domain}</span>
                </div>
                <div>
                  <h3 className="project__name">{p.name}</h3>
                  <p className="project__client">Client: <strong>{p.client}</strong> · via {p.employer}</p>
                </div>
                <p className="project__summary">{p.summary}</p>
                {p.impact.length > 0 && (
                  <ul className="project__impact" aria-label="Impact">
                    {p.impact.map((i) => (
                      <li key={i.description}><strong>{i.metric}</strong><span>{i.description}</span></li>
                    ))}
                  </ul>
                )}
                <p className="project__meta">
                  {p.role}{p.teamSize ? ` · ${p.teamSize}` : ''}
                </p>
                <TagList items={p.stack} label="Tech stack" />
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
