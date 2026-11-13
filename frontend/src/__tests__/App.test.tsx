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

  it('hides certifications when the profile has none', async () => {
    vi.stubGlobal('fetch', mockFetch());
    render(<App />);
    await screen.findByRole('heading', { level: 1, name: 'Avnish Kumar Mishra' });
    expect(screen.queryByRole('heading', { name: 'Certifications' })).not.toBeInTheDocument();
  });

  it('lists certifications from the profile, linking only safe URLs', async () => {
    const profile = {
      ...fixtures['/data/profile.json'],
      certifications: [
        { name: 'Cert One', issuer: 'Issuer A', issued: '2023-05', url: 'https://example.com/verify' },
        { name: 'Cert Two', issuer: 'Issuer B', url: 'javascript:alert(1)' },
      ],
    };
    vi.stubGlobal('fetch', mockFetch({ ...fixtures, '/data/profile.json': profile }));
    render(<App />);
    expect(await screen.findByRole('heading', { name: 'Certifications' })).toBeInTheDocument();
    const link = screen.getByRole('link', { name: 'Cert One (opens in a new tab)' });
    expect(link).toHaveAttribute('href', 'https://example.com/verify');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    expect(screen.getByText('Issuer A · May 2023')).toBeInTheDocument();
    expect(screen.getByText('Cert Two')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /Cert Two/ })).not.toBeInTheDocument();
  });
});
