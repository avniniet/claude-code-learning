import { fireEvent, render, screen } from '@testing-library/react';
import App from '../App';
import { fixtures, mockFetch } from './fixtures';

beforeAll(() => {
  window.matchMedia ??= ((query: string) => ({ matches: false, media: query, addEventListener() {}, removeEventListener() {} })) as unknown as typeof window.matchMedia;
});
afterEach(() => vi.unstubAllGlobals());

describe('App', () => {
  it('renders all sections from data', async () => {
    vi.stubGlobal('fetch', mockFetch());
    render(<App />);
    expect(await screen.findByRole('heading', { level: 1, name: 'Avnish Kumar Mishra' })).toBeInTheDocument();
    for (const id of ['About', 'Skills', 'Experience', 'Projects', 'Clients served', 'Contact']) {
      expect(screen.getAllByText(id).length).toBeGreaterThan(0);
    }
    expect(screen.getByText('Milk Supply Logistics Platform')).toBeInTheDocument();
  });

  it('filters projects by domain', async () => {
    vi.stubGlobal('fetch', mockFetch());
    render(<App />);
    await screen.findByText('Milk Supply Logistics Platform');
    const domainGroup = screen.getByRole('group', { name: 'Filter by domain' });
    fireEvent.click(Array.from(domainGroup.querySelectorAll('button')).find((b) => b.textContent === 'Healthcare')!);
    expect(screen.queryByText('Milk Supply Logistics Platform')).not.toBeInTheDocument();
    expect(screen.getByText('Healthcare Monolith → Microservices')).toBeInTheDocument();
  });

  it('shows an error state with retry when data fails', async () => {
    vi.stubGlobal('fetch', mockFetch({}));
    render(<App />);
    expect(await screen.findByRole('alert')).toHaveTextContent('Couldn’t load the portfolio');
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument();
  });

  it('hides the recommendations section when the profile has none', async () => {
    vi.stubGlobal('fetch', mockFetch());
    render(<App />);
    await screen.findByRole('heading', { level: 1, name: 'Avnish Kumar Mishra' });
    expect(screen.queryByRole('heading', { name: 'What colleagues say' })).not.toBeInTheDocument();
  });

  it('shows valid recommendations from the profile', async () => {
    const profile = {
      ...fixtures['/data/profile.json'],
      recommendations: [
        { quote: 'A calm, reliable lead.', author: 'Test Person', authorTitle: 'Test Title', date: '2025-03' },
        { quote: '', author: 'Blank Quote' },
      ],
    };
    vi.stubGlobal('fetch', mockFetch({ ...fixtures, '/data/profile.json': profile }));
    render(<App />);
    const heading = await screen.findByRole('heading', { name: 'What colleagues say' });
    const section = heading.closest('section')!;
    expect(section).toHaveTextContent('A calm, reliable lead.');
    expect(section).toHaveTextContent('Test Person');
    expect(section).toHaveTextContent('Test Title · Mar 2025');
    expect(section).not.toHaveTextContent('Blank Quote');
    expect(section.querySelectorAll('blockquote')).toHaveLength(1);
  });
});
