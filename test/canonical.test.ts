import { computeHash } from '@qr/hash';
import { buildCanonicalUrl, isLinkable } from '@shared/canonical';
import { MAX_DATA_LENGTH } from '@shared/constants';
import type { QrParams } from '@shared/types';
import { describe, expect, it } from 'vitest';

const base: QrParams = { data: 'https://example.com', preset: 'sq250', ecc: 'M', quiet: 2 };

/** What the worker does with the link: URLSearchParams decoding. */
function parse(url: string) {
  const u = new URL(url);
  return {
    path: u.pathname,
    data: u.searchParams.get('data'),
    ecc: u.searchParams.get('ecc'),
    q: u.searchParams.get('q'),
  };
}

describe('buildCanonicalUrl', () => {
  it('names the image by preset and hash and carries data, ecc and q', async () => {
    const url = await buildCanonicalUrl(base);
    expect(url).toMatch(/^https:\/\/qr\.clx\.cx\/qr\/sq250\/[a-f0-9]{64}\.svg\?data=[^&]+&ecc=M&q=2$/);
    expect(parse(url).path).toBe(`/qr/sq250/${await computeHash(base)}.svg`);
  });

  it('is deterministic', async () => {
    expect(await buildCanonicalUrl(base)).toBe(await buildCanonicalUrl(base));
  });

  it('uses the preset and quiet zone it is given', async () => {
    const url = await buildCanonicalUrl({ ...base, preset: 'sq125', quiet: 4, ecc: 'H' });
    expect(url).toContain('/qr/sq125/');
    expect(parse(url)).toMatchObject({ ecc: 'H', q: '4' });
  });

  it.each([
    ['query and fragment', 'https://example.com/a?b=1&c=2#d'],
    ['sub-delimiters', "it's (a) test! *x*"],
    ['unicode and emoji', 'Привет — 中文 😀'],
    ['inner spaces and literal %20', 'a  b %20 c+d'],
  ])('round-trips %s through URL decoding', async (_name, data) => {
    const url = await buildCanonicalUrl({ ...base, data });
    expect(parse(url).data).toBe(data);
  });

  it('trims data like the worker, so the hash matches what the worker computes', async () => {
    const url = await buildCanonicalUrl({ ...base, data: '  https://example.com \n' });
    expect(url).toBe(await buildCanonicalUrl(base));
  });

  it('leaves only characters that need no escaping in Markdown or JS strings', async () => {
    const url = await buildCanonicalUrl({ ...base, data: `"quotes" 'single' (parens) <tag> \\ !*` });
    expect(url).toMatch(/^[A-Za-z0-9\-_.~%/:?=&]+$/);
  });
});

describe('isLinkable', () => {
  it('accepts data up to the worker limit, measured after trimming', () => {
    expect(isLinkable('a'.repeat(MAX_DATA_LENGTH))).toBe(true);
    expect(isLinkable(`  ${'a'.repeat(MAX_DATA_LENGTH)}  `)).toBe(true);
    expect(isLinkable('a'.repeat(MAX_DATA_LENGTH + 1))).toBe(false);
  });

  it('rejects empty data', () => {
    expect(isLinkable('   ')).toBe(false);
  });
});
