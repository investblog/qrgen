import type { EccLevel, PresetId } from '@shared/types';

// ---- Canonical URL state ----

type Listener = (canonicalUrl: string) => void;

const listeners: Listener[] = [];
let current = '';

export function getCanonicalUrl(): string {
  return current;
}

export function setCanonicalUrl(url: string): void {
  current = url;
  for (const fn of listeners) fn(url);
}

export function onCanonicalUrlChange(fn: Listener): void {
  listeners.push(fn);
}

// ---- Settings defaults change ----

type SettingsListener = (preset: PresetId, ecc: EccLevel) => void;

const settingsListeners: SettingsListener[] = [];

export function notifyDefaultsChanged(preset: PresetId, ecc: EccLevel): void {
  for (const fn of settingsListeners) fn(preset, ecc);
}

export function onDefaultsChange(fn: SettingsListener): void {
  settingsListeners.push(fn);
}
