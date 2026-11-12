import type { Profile } from '../types/portfolio';
import { resumeLink } from '../utils/projects';

export function Hero({ profile }: { profile: Profile }) {
  const linkedIn = profile.links.find((l) => l.label === 'LinkedIn');
  const resume = resumeLink(profile.resumeUrl);
  return (
    <section className="hero" aria-labelledby="hero-name">
      <div className="container">
        <span className="hero__eyebrow">{profile.yearsOfExperience} years · {profile.currentRole}</span>
        <h1 id="hero-name" className="hero__name">{profile.name}</h1>
        <p className="hero__title">{profile.title}</p>
        <p className="hero__tagline">{profile.tagline}</p>
        <p className="hero__meta">Based in {profile.location}</p>
        <div className="hero__actions">
          <a className="btn btn--primary" href="#projects">View projects</a>
          {linkedIn && (
            <a className="btn btn--ghost" href={linkedIn.url} target="_blank" rel="noopener noreferrer">
              Connect on LinkedIn
            </a>
          )}
          {resume &&
            (resume.sameOrigin ? (
              <a className="btn btn--ghost" href={resume.href} download>
                Download resume
              </a>
            ) : (
              <a
                className="btn btn--ghost"
                href={resume.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Download resume (opens in a new tab)"
              >
                Download resume
              </a>
            ))}
        </div>
      </div>
    </section>
  );
}
