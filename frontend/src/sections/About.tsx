import { SectionHeader } from '../components/SectionHeader';
import type { Profile } from '../types/portfolio';
import { safeCertificationUrl, sortCertifications } from '../utils/certifications';
import { formatYearMonth } from '../utils/projects';

export function About({ profile }: { profile: Profile }) {
  const certifications = sortCertifications(profile.certifications);
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
        {certifications.length > 0 && (
          <div className="certs">
            <h3 id="certifications" className="certs__title">Certifications</h3>
            <ul className="certs__list" aria-labelledby="certifications">
              {certifications.map((c) => {
                const url = safeCertificationUrl(c.url);
                return (
                  <li key={`${c.issuer}-${c.name}`} className="cert">
                    {url ? (
                      <a
                        className="cert__name"
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${c.name} (opens in a new tab)`}
                      >
                        {c.name}
                      </a>
                    ) : (
                      <span className="cert__name">{c.name}</span>
                    )}
                    <span className="cert__meta">
                      {c.issuer}
                      {c.issued && ` · ${formatYearMonth(c.issued)}`}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
