import { computeHash } from '@qr/hash';
import { API_BASE } from './constants';
import type { QrParams } from './types';

export async function buildCanonicalUrl(params: QrParams): Promise<string> {
  const hash = await computeHash(params);
  return `${API_BASE}/qr/${params.preset}/${hash}.svg`;
}

export function buildApiUrl(params: QrParams): string {
  const url = new URL('/qr.svg', API_BASE);
  url.searchParams.set('data', params.data);
  url.searchParams.set('p', params.preset);
  url.searchParams.set('ecc', params.ecc);
  url.searchParams.set('q', String(params.quiet));
  return url.toString();
}
