import { generateSnippet, SNIPPET_FORMATS } from '@shared/snippets';
import { describe, expect, it } from 'vitest';

const URL = 'https://qr.qrcgen.com/qr/sq250/abc123.svg';

describe('SNIPPET_FORMATS', () => {
  it('has 5 formats', () => {
    expect(SNIPPET_FORMATS).toHaveLength(5);
  });

  it('has unique ids', () => {
    const ids = SNIPPET_FORMATS.map((f) => f.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('generateSnippet', () => {
  it('html-img returns <img> tag', () => {
    const s = generateSnippet(URL, 'html-img');
    expect(s).toContain('<img');
    expect(s).toContain(`src="${URL}"`);
    expect(s).toContain('alt="QR code"');
  });

  it('html-object returns <object> tag', () => {
    const s = generateSnippet(URL, 'html-object');
    expect(s).toContain('<object');
    expect(s).toContain(`data="${URL}"`);
    expect(s).toContain('type="image/svg+xml"');
  });

  it('markdown returns image syntax', () => {
    const s = generateSnippet(URL, 'markdown');
    expect(s).toBe(`![QR](${URL})`);
  });

  it('react returns component', () => {
    const s = generateSnippet(URL, 'react');
    expect(s).toContain('export function QR');
    expect(s).toContain(`src="${URL}"`);
  });

  it('vue returns SFC', () => {
    const s = generateSnippet(URL, 'vue');
    expect(s).toContain('<template>');
    expect(s).toContain('<script setup>');
    expect(s).toContain(URL);
  });

  it('all formats include the canonical URL', () => {
    for (const fmt of SNIPPET_FORMATS) {
      const s = generateSnippet(URL, fmt.id);
      expect(s).toContain(URL);
    }
  });
});
