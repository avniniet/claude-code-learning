import { readConfig } from '../config/env';
import { createPortfolioService, HttpError } from '../services';
import { createHttpClient } from '../services/httpClient';
import { createStaticPortfolioService } from '../services/staticPortfolioService';
import { fixtures, mockFetch } from './fixtures';

afterEach(() => vi.unstubAllGlobals());

describe('readConfig', () => {
  it('defaults to static data source', () => {
    expect(readConfig({}).dataSource).toBe('static');
  });
  it('selects api and trims trailing slash', () => {
    const cfg = readConfig({ VITE_DATA_SOURCE: 'api', VITE_API_BASE_URL: 'https://api.example.com/' });
    expect(cfg).toMatchObject({ dataSource: 'api', apiBaseUrl: 'https://api.example.com' });
  });
});

describe('createPortfolioService', () => {
  it('static source reads /data/*.json', async () => {
    const fetchMock = mockFetch();
    vi.stubGlobal('fetch', fetchMock);
    const svc = createPortfolioService(readConfig({}));
    await svc.getProjects();
    expect(fetchMock).toHaveBeenCalledWith('/data/projects.json', expect.anything());
  });

  it('api source calls versioned backend endpoints', async () => {
    const fetchMock = mockFetch({ 'https://api.example.com/api/v1/projects': [] });
    vi.stubGlobal('fetch', fetchMock);
    const svc = createPortfolioService(readConfig({ VITE_DATA_SOURCE: 'api', VITE_API_BASE_URL: 'https://api.example.com' }));
    await expect(svc.getProjects()).resolves.toEqual([]);
  });
});

describe('StaticPortfolioService', () => {
  it('returns parsed data', async () => {
    vi.stubGlobal('fetch', mockFetch());
    const svc = createStaticPortfolioService(createHttpClient());
    await expect(svc.getProfile()).resolves.toEqual(fixtures['/data/profile.json']);
  });

  it('throws HttpError on non-2xx', async () => {
    vi.stubGlobal('fetch', mockFetch({}));
    const svc = createStaticPortfolioService(createHttpClient());
    await expect(svc.getSkills()).rejects.toBeInstanceOf(HttpError);
  });
});
