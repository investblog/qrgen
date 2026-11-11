import type { EccLevel, PresetId } from '@shared/types';

// ---- Canonical URL state ----

/** `withheld`: a QR code is shown, but its data is too long for a link (the URL is then ''). */
type Listener = (canonicalUrl: string, withheld: boolean) => void;

const listeners: Listener[] = [];
let current = '';

export function getCanonicalUrl(): string {
  return current;
}

export function setCanonicalUrl(url: string, withheld = false): void {
  current = url;
  for (const fn of listeners) fn(url, withheld);
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
