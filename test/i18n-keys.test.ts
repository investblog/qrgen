import { readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { englishMessage, t } from '@/entrypoints/sidepanel/helpers';
import { describe, expect, it, vi } from 'vitest';

const getMessage = vi.fn((_key: string, _subs?: string[]): string => '');
vi.mock('wxt/browser', () => ({ browser: { i18n: { getMessage: (k: string, s?: string[]) => getMessage(k, s) } } }));

// Every i18n key the code, the HTML and the manifest use exists in the catalogs, and is used the way it is defined.
// (locales.test.ts keeps the seven catalogs on the same keys and placeholders as `en`.)
type Catalog = Record<string, { message: string; placeholders?: Record<string, unknown> }>;

const root = resolve(__dirname, '..');
const en: Catalog = JSON.parse(readFileSync(join(root, 'src/public/_locales/en/messages.json'), 'utf8'));

function files(dir: string, ext: RegExp): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = join(dir, d.name);
    if (d.isDirectory()) return d.name === 'public' ? [] : files(p, ext);
    return ext.test(d.name) ? [p] : [];
  });
}

const ts = files(join(root, 'src'), /\.ts$/).map((f) => ({ f, src: readFileSync(f, 'utf8') }));
const html = files(join(root, 'src'), /\.html$/).map((f) => ({ f, src: readFileSync(f, 'utf8') }));
const manifest = readFileSync(join(root, 'wxt.config.ts'), 'utf8');

const all = (src: string, re: RegExp) => [...src.matchAll(re)].map((m) => m[1]);
// A quoted SCREAMING_SNAKE literal in TypeScript is an i18n key (direct t() calls and key tables such as TAB_DEFS).
// Biome enforces single quotes, and no key is built by concatenation; dynamic t(x) calls take keys from such literals
// or from data-i18n attributes, so these three sources cover every key the extension asks for.
const tsKeys = ts.flatMap(({ f, src }) => all(src, /'([A-Z][A-Z0-9]*(?:_[A-Z0-9]+)+)'/g).map((k) => ({ k, f })));
const htmlKeys = html.flatMap(({ f, src }) => all(src, /data-i18n="([A-Z0-9_]+)"/g).map((k) => ({ k, f })));
const manifestKeys = all(manifest, /__MSG_([A-Za-z0-9_]+)__/g).map((k) => ({ k, f: 'wxt.config.ts' }));
const withPlaceholders = Object.keys(en).filter((k) => en[k].placeholders);

describe('i18n keys in use', () => {
  it('finds the keys it checks', () => {
    expect(tsKeys.length).toBeGreaterThan(40);
    expect(htmlKeys.length).toBeGreaterThan(10);
    expect([...new Set(manifestKeys.map((x) => x.k))].sort()).toEqual(['EXTENSION_DESCRIPTION', 'EXTENSION_NAME']);
  });

  it('every key used in code, HTML or manifest exists in the catalog', () => {
    const missing = [...tsKeys, ...htmlKeys, ...manifestKeys]
      .filter(({ k }) => !en[k])
      .map(({ k, f }) => `${k} (${f})`);
    expect(missing).toEqual([]);
  });

  it('every catalog key is used somewhere', () => {
    const used = new Set([...tsKeys, ...htmlKeys, ...manifestKeys].map(({ k }) => k));
    expect(Object.keys(en).filter((k) => !used.has(k))).toEqual([]);
  });

  it('a key with placeholders is always given its substitutions', () => {
    const bare = ts.flatMap(({ f, src }) =>
      withPlaceholders.filter((k) => new RegExp(`\\bt\\(\\s*'${k}'\\s*\\)`).test(src)).map((k) => `${k} (${f})`),
    );
    expect(bare).toEqual([]);
    expect(htmlKeys.filter(({ k }) => withPlaceholders.includes(k)).map(({ k, f }) => `${k} (${f})`)).toEqual([]);
    // Every mention of a placeholder key is a t('KEY', …) call: not a key table entry or a variable that could reach
    // t() bare through a dynamic call.
    for (const k of withPlaceholders) {
      const mentions = ts.reduce((n, { src }) => n + all(src, new RegExp(`'(${k})'`, 'g')).length, 0);
      const calls = ts.reduce((n, { src }) => n + all(src, new RegExp(`\\bt\\(\\s*'(${k})'\\s*,`, 'g')).length, 0);
      expect(calls, `${k} is called with a substitution`).toBeGreaterThan(0);
      expect(mentions, `${k} appears only inside t('${k}', …)`).toBe(calls);
    }
  });
});

describe('t() never shows a raw key', () => {
  it('uses the browser message when there is one', () => {
    getMessage.mockReturnValueOnce('Was ist neu in 1.1.0');
    expect(t('WHATS_NEW_TITLE', '1.1.0')).toBe('Was ist neu in 1.1.0');
  });

  it('falls back to the bundled English text, placeholders filled, when the browser returns nothing', () => {
    expect(t('WHATS_NEW_TITLE', '1.1.0')).toBe("What's new in 1.1.0");
    expect(t('RATE_ON_STORE', 'Firefox Add-ons')).toBe('Rate on Firefox Add-ons');
    expect(t('TAB_GENERATE')).toBe('Generate');
  });

  it('falls back when the browser throws, and returns an unknown key as is', () => {
    getMessage.mockImplementationOnce(() => {
      throw new Error('no i18n');
    });
    expect(t('WHATS_NEW_TITLE', '2.0.0')).toBe("What's new in 2.0.0");
    expect(englishMessage('NO_SUCH_KEY')).toBe('NO_SUCH_KEY');
  });

  it('a substitution with $ signs is inserted literally', () => {
    expect(englishMessage('RATE_ON_STORE', ['$1 & $$ store'])).toBe('Rate on $1 & $$ store');
  });
});
