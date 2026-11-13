import type { Certification } from '../types/portfolio';

/** Returns the URL only if it is an absolute http(s) URL, so bad data never becomes a link. */
export function safeCertificationUrl(url: string | undefined): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:' ? parsed.href : null;
  } catch {
    return null;
  }
}

/** Certifications with a non-blank name and issuer, newest first (undated last, original order kept on ties). */
export function sortCertifications(certifications: Certification[] | undefined): Certification[] {
  return (certifications ?? [])
    .filter((c) => c.name?.trim() && c.issuer?.trim())
    .map((c, i) => ({ c, i }))
    .sort((a, b) => {
      const ai = a.c.issued ?? '';
      const bi = b.c.issued ?? '';
      if (ai !== bi) return ai < bi ? 1 : -1;
      return a.i - b.i;
    })
    .map(({ c }) => c);
}
