import { computeHash } from '@qr/hash';
import { API_BASE, MAX_DATA_LENGTH } from './constants';
import type { QrParams } from './types';

/**
 * Percent-encodes like encodeURIComponent, plus the sub-delimiters it leaves alone (`!'()*`), so the
 * URL survives Markdown `(...)`, quoted HTML attributes and JS strings without further escaping.
 */
function encodeStrict(value: string): string {
  return encodeURIComponent(value).replace(/[!'()*]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);
}

/** Whether the QR worker accepts this data (it trims, then caps the length in UTF-16 units). */
export function isLinkable(data: string): boolean {
  const trimmed = data.trim();
  return trimmed.length > 0 && trimmed.length <= MAX_DATA_LENGTH;
}

/**
 * Self-contained canonical URL: the path names the image, the query carries what the worker needs to
 * re-create and verify it, so the link works from any edge location without a cache entry. Same
 * shape as the worker's `/qr.svg` redirect target.
 */
export async function buildCanonicalUrl(params: QrParams): Promise<string> {
  // The worker trims `data` before hashing; do the same so the hash always matches.
  const p: QrParams = { ...params, data: params.data.trim() };
  const hash = await computeHash(p);
  return `${API_BASE}/qr/${p.preset}/${hash}.svg?data=${encodeStrict(p.data)}&ecc=${p.ecc}&q=${p.quiet}`;
}
