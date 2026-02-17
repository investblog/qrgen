import type { Preset, PresetId } from './types';

export const PRESETS: ReadonlyMap<string, Preset> = new Map([
  ['sq125', { id: 'sq125' as PresetId, width: 125, height: 125, label: '125 px' }],
  ['sq200', { id: 'sq200' as PresetId, width: 200, height: 200, label: '200 px' }],
  ['sq250', { id: 'sq250' as PresetId, width: 250, height: 250, label: '250 px' }],
  ['sq300', { id: 'sq300' as PresetId, width: 300, height: 300, label: '300 px' }],
]);

export const PRESET_IDS: readonly PresetId[] = ['sq125', 'sq200', 'sq250', 'sq300'];

export function isValidPreset(value: string): value is PresetId {
  return PRESETS.has(value);
}

export function getPreset(id: PresetId): Preset {
  return PRESETS.get(id)!;
}
