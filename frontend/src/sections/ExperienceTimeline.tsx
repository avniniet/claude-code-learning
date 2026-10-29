import { SectionHeader } from '../components/SectionHeader';
import { TagList } from '../components/TagList';
import type { Experience } from '../types/portfolio';
import { formatYearMonth } from '../utils/projects';

export function ExperienceTimeline({ experience }: { experience: Experience[] }) {
  return (
    <section className="section section--alt" aria-labelledby="experience">
      <div className="container">
        <SectionHeader id="experience" eyebrow="Experience" title="Career timeline" />
        <ol className="timeline">
          {experience.map((e) => (
            <li key={e.id} className="timeline__item">
              <span className="timeline__dot" aria-hidden="true" />
              <article className="card">
                <div className="timeline__head">
                  <div>
                    <h3 className="timeline__role">{e.role}</h3>
                    <p className="timeline__org">{e.employer} · Client: {e.client}</p>
                  </div>
                  <span className="timeline__dates">{formatYearMonth(e.start)} – {formatYearMonth(e.end)}</span>
                </div>
                <p className="timeline__domain">{e.domain}</p>
                <ul className="timeline__highlights">
                  {e.highlights.map((h) => <li key={h}>{h}</li>)}
                </ul>
                <TagList items={e.stack} label="Tech stack" />
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
