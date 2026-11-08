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

  it('shows code and demo links only for projects that have them', async () => {
    const [first, ...rest] = fixtures['/data/projects.json'];
    const withLinks = { ...first, repoUrl: 'https://github.com/example/repo', demoUrl: 'https://demo.example.com' };
    vi.stubGlobal('fetch', mockFetch({ ...fixtures, '/data/projects.json': [withLinks, ...rest] }));
    render(<App />);
    const code = await screen.findByRole('link', { name: `Code for ${first.name} (opens in a new tab)` });
    expect(code).toHaveAttribute('href', 'https://github.com/example/repo');
    expect(code).toHaveAttribute('rel', 'noopener noreferrer');
    expect(screen.getByRole('link', { name: `Live demo for ${first.name} (opens in a new tab)` })).toHaveAttribute(
      'href',
      'https://demo.example.com',
    );
    expect(screen.getAllByRole('link', { name: /^Code for / })).toHaveLength(1);
  });

  it('shows an error state with retry when data fails', async () => {
    vi.stubGlobal('fetch', mockFetch({}));
    render(<App />);
    expect(await screen.findByRole('alert')).toHaveTextContent('Couldn’t load the portfolio');
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument();
  });
});
