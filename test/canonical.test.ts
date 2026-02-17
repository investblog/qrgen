import { buildApiUrl, buildCanonicalUrl } from '@shared/canonical';
import type { QrParams } from '@shared/types';
import { describe, expect, it } from 'vitest';

const base: QrParams = { data: 'https://example.com', preset: 'sq250', ecc: 'M', quiet: 4 };

describe('buildCanonicalUrl', () => {
  it('returns URL with preset and hash', async () => {
    const url = await buildCanonicalUrl(base);
    expect(url).toMatch(/^https:\/\/qr\.qrcgen\.com\/qr\/sq250\/[a-f0-9]{64}\.svg$/);
  });

  it('is deterministic', async () => {
    const a = await buildCanonicalUrl(base);
    const b = await buildCanonicalUrl(base);
    expect(a).toBe(b);
  });

  it('uses the correct preset in path', async () => {
    const url = await buildCanonicalUrl({ ...base, preset: 'sq125' });
    expect(url).toContain('/qr/sq125/');
  });
});

describe('buildApiUrl', () => {
  it('returns URL with query params', () => {
    const url = buildApiUrl(base);
    expect(url).toContain('data=');
    expect(url).toContain('p=sq250');
    expect(url).toContain('ecc=M');
    expect(url).toContain('q=4');
  });

  it('uses API_BASE', () => {
    const url = buildApiUrl(base);
    expect(url.startsWith('https://qr.qrcgen.com/')).toBe(true);
  });
});
