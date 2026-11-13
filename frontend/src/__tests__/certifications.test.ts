import type { Certification } from '../types/portfolio';
import { safeCertificationUrl, sortCertifications } from '../utils/certifications';

describe('sortCertifications', () => {
  it('returns an empty list when certifications are missing', () => {
    expect(sortCertifications(undefined)).toEqual([]);
    expect(sortCertifications([])).toEqual([]);
  });

  it('orders newest first, keeps original order on ties and puts undated last', () => {
    const certs: Certification[] = [
      { name: 'Undated', issuer: 'X' },
      { name: 'Old', issuer: 'X', issued: '2019-03' },
      { name: 'New A', issuer: 'X', issued: '2024-06' },
      { name: 'New B', issuer: 'Y', issued: '2024-06' },
    ];
    expect(sortCertifications(certs).map((c) => c.name)).toEqual(['New A', 'New B', 'Old', 'Undated']);
  });

  it('drops entries with a blank name or issuer', () => {
    const certs: Certification[] = [
      { name: ' ', issuer: 'X' },
      { name: 'Valid', issuer: 'X' },
      { name: 'No issuer', issuer: '' },
    ];
    expect(sortCertifications(certs).map((c) => c.name)).toEqual(['Valid']);
  });
});

describe('safeCertificationUrl', () => {
  it('accepts absolute http(s) URLs', () => {
    expect(safeCertificationUrl('https://example.com/verify/1')).toBe('https://example.com/verify/1');
    expect(safeCertificationUrl('http://example.com/')).toBe('http://example.com/');
  });

  it('rejects missing, relative, malformed and non-http URLs', () => {
    for (const url of [undefined, '', '/cert', 'example.com', 'javascript:alert(1)', 'mailto:a@b.c']) {
      expect(safeCertificationUrl(url)).toBeNull();
    }
  });
});
