import type { EccLevel } from '@shared/types';
import { encode } from 'uqr';

export interface QrMatrix {
  readonly data: boolean[][];
  readonly size: number;
}

export function generateMatrix(text: string, ecc: EccLevel): QrMatrix {
  const result = encode(text, { ecc, border: 0 });
  return { data: result.data, size: result.size };
}
