import type { EccLevel, PresetId, Settings } from './types';

export const API_BASE = 'https://qr.qrcgen.com';

export const MAX_DATA_LENGTH = 2048;

export const ECC_LEVELS: readonly EccLevel[] = ['L', 'M', 'Q', 'H'];

export const DEFAULT_SETTINGS: Readonly<Settings> = {
  defaultPreset: 'sq250' as PresetId,
  defaultEcc: 'M' as EccLevel,
  autoGenerate: true,
  historyLimit: 50,
  theme: 'auto',
};

export const HISTORY_LIMITS = [25, 50, 100] as const;
