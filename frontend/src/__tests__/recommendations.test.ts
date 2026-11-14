import type { Recommendation } from '../types/portfolio';
import { formatYearMonth } from '../utils/projects';
import { recommendationMeta, visibleRecommendations } from '../utils/recommendations';

describe('visibleRecommendations', () => {
  it('returns an empty list when there are none', () => {
    expect(visibleRecommendations(undefined)).toEqual([]);
    expect(visibleRecommendations([])).toEqual([]);
  });

  it('drops entries with a blank quote or author and trims text', () => {
    const items: Recommendation[] = [
      { quote: '  Great lead.  ', author: ' A. Person ' },
      { quote: '   ', author: 'No Quote' },
      { quote: 'No author', author: '' },
    ];
    expect(visibleRecommendations(items)).toEqual([{ quote: 'Great lead.', author: 'A. Person' }]);
  });

  it('keeps the original order', () => {
    const items: Recommendation[] = [
      { quote: 'First', author: 'B', date: '2020-01' },
      { quote: 'Second', author: 'A', date: '2025-01' },
    ];
    expect(visibleRecommendations(items).map((r) => r.quote)).toEqual(['First', 'Second']);
  });
});

describe('recommendationMeta', () => {
  it('joins the optional parts that are present', () => {
    expect(
      recommendationMeta(
        { quote: 'q', author: 'a', authorTitle: 'Director, Example Corp', relationship: 'Managed me directly', date: '2025-03' },
        formatYearMonth,
      ),
    ).toBe('Director, Example Corp · Managed me directly · Mar 2025');
    expect(recommendationMeta({ quote: 'q', author: 'a', relationship: ' Peer ' }, formatYearMonth)).toBe('Peer');
  });

  it('is empty when no optional parts are set', () => {
    expect(recommendationMeta({ quote: 'q', author: 'a', authorTitle: '  ' }, formatYearMonth)).toBe('');
  });
});
