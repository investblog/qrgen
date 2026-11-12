import { generateSnippet, SNIPPET_FORMATS } from '@shared/snippets';
import { describe, expect, it } from 'vitest';

const URL = 'https://qr.clx.cx/qr/sq250/abc123.svg?data=https%3A%2F%2Fexample.com%2F%28x%29&ecc=M&q=2';
const URL_HTML = URL.replace(/&/g, '&amp;');

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
  it('html-img escapes & in the attribute', () => {
    expect(generateSnippet(URL, 'html-img')).toBe(`<img src="${URL_HTML}" alt="QR code" />`);
  });

  it('html-object escapes & in the attribute', () => {
    const s = generateSnippet(URL, 'html-object');
    expect(s).toContain(`data="${URL_HTML}"`);
    expect(s).toContain('type="image/svg+xml"');
  });

  it('html attributes decode back to the URL', () => {
    const doc = `<img src="${URL_HTML}">`;
    const decoded = doc.match(/src="([^"]*)"/)![1].replace(/&amp;/g, '&');
    expect(decoded).toBe(URL);
  });

  it('markdown keeps the URL intact (no raw parentheses)', () => {
    const s = generateSnippet(URL, 'markdown');
    expect(s).toBe(`![QR](${URL})`);
    expect(s.slice('![QR]('.length, -1)).not.toMatch(/[()]/);
  });

  it('react returns component', () => {
    const s = generateSnippet(URL, 'react');
    expect(s).toContain('export function QR');
    expect(s).toContain(`src="${URL}"`);
  });

  it('vue returns SFC with the URL in a JS string', () => {
    const s = generateSnippet(URL, 'vue');
    expect(s).toContain('<template>');
    expect(s).toContain('<script setup>');
    expect(s).toContain(`const src = "${URL}";`);
  });
});
