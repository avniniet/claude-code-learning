import type { Recommendation } from '../types/portfolio';

/**
 * Returns the recommendations to display: entries with a blank quote or author are dropped,
 * text is trimmed, and the original order is kept (the owner controls ordering in the data).
 */
export function visibleRecommendations(items: Recommendation[] | undefined): Recommendation[] {
  if (!items) return [];
  return items
    .map((r) => ({ ...r, quote: r.quote?.trim() ?? '', author: r.author?.trim() ?? '' }))
    .filter((r) => r.quote !== '' && r.author !== '');
}

/** Builds the secondary line under the author's name, e.g. "Director, Example Corp · Managed me directly · Mar 2025". */
export function recommendationMeta(r: Recommendation, formatDate: (value: string) => string): string {
  return [r.authorTitle?.trim(), r.relationship?.trim(), r.date ? formatDate(r.date) : undefined]
    .filter((part): part is string => Boolean(part))
    .join(' · ');
}
