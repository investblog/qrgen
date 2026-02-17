type Listener = (canonicalUrl: string) => void;

const listeners: Listener[] = [];
let current = '';

export function getCanonicalUrl(): string {
  return current;
}

export function setCanonicalUrl(url: string): void {
  current = url;
  for (const fn of listeners) fn(url);
}

export function onCanonicalUrlChange(fn: Listener): void {
  listeners.push(fn);
}
