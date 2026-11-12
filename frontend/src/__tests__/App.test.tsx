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

  it('hides the resume button when profile.resumeUrl is not set', async () => {
    vi.stubGlobal('fetch', mockFetch());
    render(<App />);
    await screen.findByRole('heading', { level: 1, name: 'Avnish Kumar Mishra' });
    expect(screen.queryByRole('link', { name: /Download resume/ })).not.toBeInTheDocument();
  });

  it('shows a download link when profile.resumeUrl is a same-origin path', async () => {
    const profile = { ...fixtures['/data/profile.json'], resumeUrl: '/resume.pdf' };
    vi.stubGlobal('fetch', mockFetch({ ...fixtures, '/data/profile.json': profile }));
    render(<App />);
    const link = await screen.findByRole('link', { name: 'Download resume' });
    expect(link).toHaveAttribute('href', '/resume.pdf');
    expect(link).toHaveAttribute('download');
  });

  it('opens an external resume URL in a new tab', async () => {
    const profile = { ...fixtures['/data/profile.json'], resumeUrl: 'https://example.com/cv.pdf' };
    vi.stubGlobal('fetch', mockFetch({ ...fixtures, '/data/profile.json': profile }));
    render(<App />);
    const link = await screen.findByRole('link', { name: 'Download resume (opens in a new tab)' });
    expect(link).toHaveAttribute('href', 'https://example.com/cv.pdf');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    expect(link).not.toHaveAttribute('download');
  });

  it('shows an error state with retry when data fails', async () => {
    vi.stubGlobal('fetch', mockFetch({}));
    render(<App />);
    expect(await screen.findByRole('alert')).toHaveTextContent('Couldn’t load the portfolio');
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument();
  });
});
