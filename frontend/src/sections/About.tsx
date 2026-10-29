import { SectionHeader } from '../components/SectionHeader';
import type { Profile } from '../types/portfolio';

export function About({ profile }: { profile: Profile }) {
  return (
    <section className="section section--alt" aria-labelledby="about">
      <div className="container">
        <SectionHeader id="about" eyebrow="About" title="Hands-on architect, people-first lead" />
        <p className="about__summary">{profile.summary}</p>
        <ul className="stats" style={{ listStyle: 'none' }}>
          {profile.stats.map((s) => (
            <li key={s.label} className="stat">
              <div className="stat__value">{s.value}</div>
              <div className="stat__label">{s.label}</div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
