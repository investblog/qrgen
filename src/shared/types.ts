export type EccLevel = 'L' | 'M' | 'Q' | 'H';

export type PresetId = 'sq125' | 'sq200' | 'sq250' | 'sq300';

export interface Preset {
  readonly id: PresetId;
  readonly width: number;
  readonly height: number;
  readonly label: string;
}

export interface QrParams {
  readonly data: string;
  readonly preset: PresetId;
  readonly ecc: EccLevel;
  readonly quiet: number;
}

export type SnippetFormat = 'html-img' | 'html-object' | 'markdown' | 'react' | 'vue';

export interface HistoryItem {
  readonly data: string;
  readonly preset: PresetId;
  readonly ecc: EccLevel;
  readonly quiet: number;
  readonly canonicalUrl: string;
  readonly createdAt: number;
}

export interface Settings {
  defaultPreset: PresetId;
  defaultEcc: EccLevel;
  autoGenerate: boolean;
  historyLimit: number;
  theme: 'dark' | 'light' | 'auto';
}
