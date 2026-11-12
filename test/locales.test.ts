import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

type Catalog = Record<string, { message: string; placeholders?: Record<string, unknown> }>;

const dir = resolve(__dirname, '../src/public/_locales');
const langs = readdirSync(dir);
const load = (lang: string): Catalog => JSON.parse(readFileSync(resolve(dir, lang, 'messages.json'), 'utf8'));
const en = load('en');

describe('locale catalogs', () => {
  it('ship the seven languages', () => {
    expect(langs.sort()).toEqual(['de', 'en', 'es', 'fr', 'pt_BR', 'ru', 'tr']);
  });

  it.each(langs)('%s has the same keys and placeholders as en', (lang) => {
    const catalog = load(lang);
    expect(Object.keys(catalog).sort()).toEqual(Object.keys(en).sort());
    for (const [key, entry] of Object.entries(en)) {
      if (entry.placeholders) expect(catalog[key].placeholders, key).toEqual(entry.placeholders);
    }
  });

  it.each(langs)('%s keeps the brand name and fits the store limits', (lang) => {
    const catalog = load(lang);
    expect(catalog.EXTENSION_NAME.message).toBe('SVG QR Code Generator');
    expect(catalog.EXTENSION_DESCRIPTION.message.length).toBeLessThanOrEqual(132);
  });

  it.each(langs)('%s sends the user to its own pages', (lang) => {
    expect(load(lang).SITE_URL.message).toBe(lang === 'ru' ? 'https://ru.clx.cx' : 'https://clx.cx');
  });

  it.each(langs)('%s no longer mentions the old domain', (lang) => {
    for (const { message } of Object.values(load(lang))) expect(message).not.toMatch(/qrcgen\.com/i);
  });
});
