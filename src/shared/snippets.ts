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

export function generateSnippet(canonicalUrl: string, format: SnippetFormat): string {
  switch (format) {
    case 'html-img':
      return `<img src="${canonicalUrl}" alt="QR code" />`;

    case 'html-object':
      return `<object data="${canonicalUrl}" type="image/svg+xml" aria-label="QR code"></object>`;

    case 'markdown':
      return `![QR](${canonicalUrl})`;

    case 'react':
      return `export function QR() {\n  return <img src="${canonicalUrl}" alt="QR code" loading="lazy" />;\n}`;

    case 'vue':
      return `<template>\n  <img :src="src" alt="QR code" loading="lazy" />\n</template>\n<script setup>\nconst src = "${canonicalUrl}";\n</script>`;
  }
}
