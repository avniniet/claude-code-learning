import { SectionHeader } from '../components/SectionHeader';
import type { Experience, Project } from '../types/portfolio';
import { summarizeClients } from '../utils/projects';

export function Clients({ experience, projects }: { experience: Experience[]; projects: Project[] }) {
  const clients = summarizeClients(experience, projects);
  return (
    <section className="section section--alt" aria-labelledby="clients">
      <div className="container">
        <SectionHeader
          id="clients"
          eyebrow="Clients served"
          title="Trusted by global enterprises"
          subtitle="Enterprises I've delivered for through Cognizant, Accenture and TCS."
        />
        <ul className="clients-grid">
          {clients.map((c) => (
            <li key={c.client} className="card">
              <h3 className="client__name">{c.client}</h3>
              <p className="client__domain">{c.domain}</p>
              <div className="client__meta">
                <span>via {c.employer}</span>
                <span>{c.period}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
