import type { SnippetFormat } from './types';

export interface SnippetDef {
  readonly id: SnippetFormat;
  readonly label: string;
}

export const SNIPPET_FORMATS: readonly SnippetDef[] = [
  { id: 'html-img', label: 'HTML <img>' },
  { id: 'html-object', label: 'HTML <object>' },
  { id: 'markdown', label: 'Markdown' },
  { id: 'react', label: 'React' },
  { id: 'vue', label: 'Vue' },
];

/**
 * `canonicalUrl` comes from buildCanonicalUrl, which leaves only `[A-Za-z0-9-_.~%/:?=&]` in it, so
 * Markdown, JSX and JS strings take it as is; HTML attributes need `&` escaped.
 */
export function generateSnippet(canonicalUrl: string, format: SnippetFormat): string {
  const htmlAttr = canonicalUrl.replace(/&/g, '&amp;');
  switch (format) {
    case 'html-img':
      return `<img src="${htmlAttr}" alt="QR code" />`;

    case 'html-object':
      return `<object data="${htmlAttr}" type="image/svg+xml" aria-label="QR code"></object>`;

    case 'markdown':
      return `![QR](${canonicalUrl})`;

    case 'react':
      return `export function QR() {\n  return <img src="${canonicalUrl}" alt="QR code" loading="lazy" />;\n}`;

    case 'vue':
      return `<template>\n  <img :src="src" alt="QR code" loading="lazy" />\n</template>\n<script setup>\nconst src = "${canonicalUrl}";\n</script>`;
  }
}
