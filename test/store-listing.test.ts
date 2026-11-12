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

/** Width and height from a JPEG's start-of-frame segment (baseline or progressive). */
function jpegSize(buf: Buffer): { width: number; height: number } | null {
  if (buf[0] !== 0xff || buf[1] !== 0xd8) return null;
  for (let i = 2; i + 9 < buf.length; ) {
    if (buf[i] !== 0xff) return null;
    const marker = buf[i + 1];
    if (marker >= 0xc0 && marker <= 0xc2) return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
    i += 2 + buf.readUInt16BE(i + 2);
  }
  return null;
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

  it.each([
    ['small-440x280', 440, 280],
    ['marquee-1400x560', 1400, 560],
    ['hero-1280x800', 1280, 800],
  ])('store image %s has the exact store size (en, ru)', (name, width, height) => {
    for (const lang of ['en', 'ru']) {
      const jpg = resolve(__dirname, `../store-assets/out/${name}-${lang}.jpg`);
      expect(jpegSize(readFileSync(jpg)), jpg).toEqual({ width, height });
      if (name === 'hero-1280x800') continue; // README banner: its PNG is assets/banner-1280x800.png
      // Edge takes the tiles as PNG (the large tile must be PNG): 24-bit RGB, no alpha.
      const png = readFileSync(resolve(__dirname, `../store-assets/out/${name}-${lang}.png`));
      const header = {
        signature: png.subarray(0, 8).toString('hex'),
        chunk: png.subarray(12, 16).toString('latin1'),
        width: png.readUInt32BE(16),
        height: png.readUInt32BE(20),
        bitDepth: png[24],
        colorType: png[25],
      };
      expect(header, name).toEqual({
        signature: '89504e470d0a1a0a',
        chunk: 'IHDR',
        width,
        height,
        bitDepth: 8,
        colorType: 2,
      });
    }
  });

  it.each(['chrome', 'edge', 'firefox'])('%s screenshots: six 1280×800 24-bit PNGs per language', (store) => {
    for (const lang of ['en', 'ru']) {
      const dir = resolve(__dirname, `../store-assets/out/screenshots/${store}/${lang}`);
      const files = readdirSync(dir)
        .filter((f) => f.endsWith('.png'))
        .sort();
      expect(files.map((f) => f.slice(0, 3)), dir).toEqual(['01-', '02-', '03-', '04-', '05-', '06-']);
      for (const f of files) {
        const png = readFileSync(resolve(dir, f));
        const header = [
          png.subarray(0, 8).toString('hex'),
          png.subarray(12, 16).toString('latin1'),
          png.readUInt32BE(16),
          png.readUInt32BE(20),
          png[24],
          png[25],
        ];
        expect(header, f).toEqual(['89504e470d0a1a0a', 'IHDR', 1280, 800, 8, 2]);
      }
    }
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
