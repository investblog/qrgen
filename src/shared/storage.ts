import { browser } from 'wxt/browser';
import { DEFAULT_SETTINGS } from './constants';
import type { HistoryItem, Settings } from './types';

const SETTINGS_KEY = 'qrcgen_settings';
const HISTORY_KEY = 'qrcgen_history';

export async function loadSettings(): Promise<Settings> {
  const result = await browser.storage.local.get(SETTINGS_KEY);
  const stored = result[SETTINGS_KEY];
  if (stored && typeof stored === 'object') {
    return { ...DEFAULT_SETTINGS, ...stored };
  }
  return { ...DEFAULT_SETTINGS };
}

export async function saveSettings(settings: Settings): Promise<void> {
  await browser.storage.local.set({ [SETTINGS_KEY]: settings });
}

export async function loadHistory(): Promise<HistoryItem[]> {
  const result = await browser.storage.local.get(HISTORY_KEY);
  const stored = result[HISTORY_KEY];
  if (Array.isArray(stored)) {
    return stored;
  }
  return [];
}

export async function addHistoryItem(item: HistoryItem, limit: number): Promise<HistoryItem[]> {
  const history = await loadHistory();

  // Deduplicate by canonical URL
  const filtered = history.filter((h) => h.canonicalUrl !== item.canonicalUrl);
  filtered.unshift(item);

  // Trim to limit
  const trimmed = filtered.slice(0, limit);
  await browser.storage.local.set({ [HISTORY_KEY]: trimmed });
  return trimmed;
}

export async function clearHistory(): Promise<void> {
  await browser.storage.local.set({ [HISTORY_KEY]: [] });
}
