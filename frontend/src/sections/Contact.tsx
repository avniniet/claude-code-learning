import { SectionHeader } from '../components/SectionHeader';
import type { Profile } from '../types/portfolio';

export function Contact({ profile }: { profile: Profile }) {
  return (
    <section className="section contact" aria-labelledby="contact">
      <div className="container">
        <SectionHeader
          id="contact"
          eyebrow="Contact"
          title="Let’s build something reliable"
          subtitle="Open to conversations about architecture, technical leadership and enterprise delivery."
        />
        <div className="hero__actions" style={{ justifyContent: 'center' }}>
          {profile.email && (
            <a className="btn btn--primary" href={`mailto:${profile.email}`}>
              Email {profile.email}
            </a>
          )}
          {profile.phone && (
            <a className="btn btn--primary" href={`tel:${profile.phone.replace(/[^\d+]/g, '')}`}>
              Call {profile.phone}
            </a>
          )}
          {profile.links.map((l) => (
            <a key={l.url} className="btn btn--primary" href={l.url} target="_blank" rel="noopener noreferrer">
              Message me on {l.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
