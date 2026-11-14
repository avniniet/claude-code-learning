import { SectionHeader } from '../components/SectionHeader';
import type { Recommendation } from '../types/portfolio';
import { formatYearMonth } from '../utils/projects';
import { recommendationMeta, visibleRecommendations } from '../utils/recommendations';

export function Recommendations({ recommendations }: { recommendations?: Recommendation[] }) {
  const items = visibleRecommendations(recommendations);
  if (items.length === 0) return null;
  return (
    <section className="section" aria-labelledby="recommendations">
      <div className="container">
        <SectionHeader id="recommendations" eyebrow="Recommendations" title="What colleagues say" />
        <ul className="recommendations-grid">
          {items.map((r, i) => {
            const meta = recommendationMeta(r, formatYearMonth);
            return (
              <li key={`${r.author}-${i}`} className="card">
                <figure className="recommendation">
                  <blockquote className="recommendation__quote">
                    <p>{r.quote}</p>
                  </blockquote>
                  <figcaption>
                    <span className="recommendation__author">{r.author}</span>
                    {meta && <span className="recommendation__meta">{meta}</span>}
                  </figcaption>
                </figure>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
