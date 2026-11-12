import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

type Catalog = Record<string, { message: string }>;

const load = (lang: string): Catalog =>
  JSON.parse(readFileSync(resolve(__dirname, `../src/public/_locales/${lang}/messages.json`), 'utf8'));

const en = load('en');
const ru = load('ru');

describe('locale catalogs', () => {
  it('have the same keys', () => {
    expect(Object.keys(ru).sort()).toEqual(Object.keys(en).sort());
  });

  it('send each language to its own pages', () => {
    expect(en.SITE_URL.message).toBe('https://clx.cx');
    expect(ru.SITE_URL.message).toBe('https://ru.clx.cx');
  });

  it('no longer mention the old domain', () => {
    for (const catalog of [en, ru]) {
      for (const { message } of Object.values(catalog)) expect(message).not.toMatch(/qrcgen\.com/i);
    }
  });
});
