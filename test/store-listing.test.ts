import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

// Store texts in docs/store (rules: docs/store/README.md), one per package language.
const store = resolve(__dirname, '../docs/store');
const langs = readdirSync(resolve(__dirname, '../src/public/_locales'));

/** The lines of a `## <name>` section, up to the next `## ` heading or the end of the file. */
function section(file: string, name: string): string[] {
  const lines = readFileSync(file, 'utf8').replace(/\r\n/g, '\n').split('\n');
  const start = lines.indexOf(`## ${name}`);
  if (start < 0) return [];
  const rest = lines.slice(start + 1);
  const end = rest.findIndex((l) => l.startsWith('## '));
  return (end < 0 ? rest : rest.slice(0, end)).map((l) => l.trim()).filter(Boolean);
}

const chromeFile = (lang: string) => resolve(store, `${lang}.md`);
const amoFile = (lang: string) => resolve(store, 'amo', `${lang}.md`);

describe('store listings', () => {
  it.each(langs)('%s has a Chrome/Edge text and an AMO text', (lang) => {
    expect(existsSync(chromeFile(lang)), `${lang}.md`).toBe(true);
    expect(existsSync(amoFile(lang)), `amo/${lang}.md`).toBe(true);
  });

  it.each(langs)('%s descriptions fit the store lengths and name no old domain', (lang) => {
    for (const file of [chromeFile(lang), amoFile(lang)]) {
      const text = section(file, 'Description').join('\n');
      expect(text.length, file).toBeGreaterThanOrEqual(250);
      expect(text.length, file).toBeLessThanOrEqual(10_000);
      expect(readFileSync(file, 'utf8'), file).not.toMatch(/qrcgen\.com/i);
    }
  });

  it.each(langs)('%s Edge search terms fit the Partner Center limits', (lang) => {
    const terms = section(chromeFile(lang), 'Search terms (Edge)').map((l) => l.replace(/^- /, ''));
    expect(terms.length).toBeGreaterThanOrEqual(1);
    expect(terms.length).toBeLessThanOrEqual(7);
    for (const term of terms) expect(term.length, term).toBeLessThanOrEqual(30);
    expect(terms.join(' ').split(/\s+/).length).toBeLessThanOrEqual(21);
  });

  it.each(langs)('%s AMO text is AMO Markdown and its own wording', (lang) => {
    const amo = section(amoFile(lang), 'Description');
    expect(amo.join('\n')).not.toContain('•');
    expect(amo.some((l) => l.startsWith('#'))).toBe(false);
    const chrome = new Set(section(chromeFile(lang), 'Description').map((l) => l.replace(/^• /, '')));
    for (const line of amo.map((l) => l.replace(/^- /, ''))) {
      if (line.length >= 40) expect(chrome.has(line), line).toBe(false);
    }
  });
});
