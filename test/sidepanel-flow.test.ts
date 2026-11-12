// @vitest-environment happy-dom
import type { HistoryItem, Settings } from '@shared/types';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

/**
 * Privacy invariant of the side panel: everything is local. The extension never makes a network
 * request or asks the background to make one; the only way data leaves is a link the user copies
 * or opens.
 */

const env = vi.hoisted(() => ({
  tabUrl: 'https://example.com/page',
  settings: { defaultPreset: 'sq250', defaultEcc: 'M', autoGenerate: true, historyLimit: 50, theme: 'auto' },
  history: [] as unknown[],
  clipboardOk: true,
}));

const addHistoryItem = vi.hoisted(() => vi.fn(async () => {}));
const tabsCreate = vi.hoisted(() => vi.fn(async () => ({})));
const writeText = vi.hoisted(() => vi.fn(async () => {}));
const sendMessage = vi.hoisted(() => vi.fn(async () => ({})));
const fetchSpy = vi.fn(async () => new Response(''));

vi.mock('wxt/browser', () => ({
  browser: {
    tabs: {
      query: vi.fn(async () => [{ url: env.tabUrl, title: 'Page' }]),
      create: tabsCreate,
    },
    runtime: { sendMessage },
    i18n: { getMessage: (key: string) => key },
  },
}));
vi.mock('@shared/storage', () => ({
  loadSettings: vi.fn(async () => ({ ...env.settings }) as Settings),
  addHistoryItem,
  loadHistory: vi.fn(async () => env.history),
  clearHistory: vi.fn(async () => {}),
}));

const flush = async () => {
  for (let i = 0; i < 10; i++) await new Promise((r) => setTimeout(r, 0));
};

async function openPanel() {
  const { createGenerateTab } = await import('@/entrypoints/sidepanel/components/generate');
  const { createEmbedTab } = await import('@/entrypoints/sidepanel/components/embed');
  const embed = createEmbedTab();
  const generate = createGenerateTab();
  document.body.append(generate, embed);
  await flush();
  return {
    generate,
    embed,
    preview: () => generate.querySelector('.qr-preview svg'),
    copyLink: () => (generate.querySelector('.btn--primary') as HTMLButtonElement).click(),
    refresh: () => (generate.querySelector('button[title="Reload URL"]') as HTMLButtonElement).click(),
    copySnippet: () => (embed.querySelector('.btn--primary') as HTMLButtonElement).click(),
    copyEmbedUrl: () => (embed.querySelector('.btn--secondary') as HTMLButtonElement).click(),
    snippetText: () => embed.querySelector('pre')?.textContent ?? '',
    toast: () => document.querySelector('.toast')?.textContent ?? '',
  };
}

beforeEach(() => {
  vi.resetModules();
  env.tabUrl = 'https://example.com/page';
  env.settings.autoGenerate = true;
  env.history = [];
  env.clipboardOk = true;
  addHistoryItem.mockClear();
  tabsCreate.mockClear();
  sendMessage.mockClear();
  fetchSpy.mockClear();
  vi.stubGlobal('fetch', fetchSpy);
  writeText.mockReset();
  writeText.mockImplementation(async () => {
    if (!env.clipboardOk) throw new Error('denied');
  });
  Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
  document.execCommand = () => false;
  document.body.textContent = '';
});

afterEach(() => {
  // Every scenario: no network request, no request through the background.
  expect(fetchSpy).not.toHaveBeenCalled();
  expect(sendMessage).not.toHaveBeenCalled();
  vi.unstubAllGlobals();
  document.body.textContent = '';
});

describe('opening the panel', () => {
  it('draws the current page locally', async () => {
    const p = await openPanel();
    expect(p.preview()).not.toBeNull();
    expect(p.snippetText()).toContain('https://qr.clx.cx/qr/sq250/');
  });

  it('with auto-generate off, draws nothing', async () => {
    env.settings.autoGenerate = false;
    const p = await openPanel();
    expect(p.preview()).toBeNull();
  });

  it('the refresh button regenerates', async () => {
    env.settings.autoGenerate = false;
    const p = await openPanel();
    p.refresh();
    await flush();
    expect(p.preview()).not.toBeNull();
  });
});

describe('copying a share link', () => {
  it('copies the self-contained link and saves history', async () => {
    const p = await openPanel();
    p.copyLink();
    await flush();
    const url = writeText.mock.calls[0][0] as string;
    expect(url).toMatch(/^https:\/\/qr\.clx\.cx\/qr\/sq250\/[a-f0-9]{64}\.svg\?data=.+&ecc=M&q=2$/);
    expect(new URL(url).searchParams.get('data')).toBe(env.tabUrl);
    expect(addHistoryItem).toHaveBeenCalledTimes(1);
  });

  it('saves the link that was copied, even if the input changes meanwhile', async () => {
    let release: () => void = () => {};
    writeText.mockImplementationOnce(() => new Promise<void>((r) => (release = r)));
    const p = await openPanel();
    p.copyLink();
    await flush();
    const copied = writeText.mock.calls[0][0] as string;

    env.tabUrl = 'https://other.example/';
    p.refresh();
    await flush();
    expect(p.snippetText()).toContain(encodeURIComponent('https://other.example/'));

    release();
    await flush();
    expect(addHistoryItem).toHaveBeenCalledWith(
      expect.objectContaining({ data: 'https://example.com/page', canonicalUrl: copied }),
      50,
    );
  });

  it('a failed copy saves nothing', async () => {
    env.clipboardOk = false;
    const p = await openPanel();
    p.copyLink();
    await flush();
    expect(p.toast()).toBe('TOAST_COPY_FAILED');
    expect(addHistoryItem).not.toHaveBeenCalled();
  });

  it('a snippet carries the same link, HTML-escaped', async () => {
    const p = await openPanel();
    p.copySnippet();
    await flush();
    expect(writeText.mock.calls[0][0]).toContain('&amp;ecc=M&amp;q=2');
  });

  it("the Embed tab's Copy URL copies the plain link", async () => {
    const p = await openPanel();
    p.copyEmbedUrl();
    await flush();
    expect(writeText.mock.calls[0][0]).toMatch(/\.svg\?data=.+&ecc=M&q=2$/);
  });
});

describe('generation failure', () => {
  it('drops the previous link when the new data cannot be encoded', async () => {
    const p = await openPanel();
    expect(p.snippetText()).toContain('/qr/sq250/');

    env.tabUrl = `https://example.com/${'中'.repeat(2000)}`; // ≤ 2,048 units, but too big for any QR
    p.refresh();
    await flush();
    expect(p.preview()).toBeNull();
    expect(p.snippetText()).toBe('EMBED_NO_QR');

    p.copyLink();
    p.copySnippet();
    await flush();
    expect(writeText).not.toHaveBeenCalled();
    expect(addHistoryItem).not.toHaveBeenCalled();
  });
});

describe('data too long for a link', () => {
  beforeEach(() => {
    env.tabUrl = `https://example.com/?q=${'a'.repeat(2100)}`;
  });

  it('still draws the code, but withholds the link everywhere', async () => {
    const p = await openPanel();
    expect(p.preview()).not.toBeNull();
    expect(p.snippetText()).toBe('TOAST_TOO_LONG_FOR_LINK');

    p.copyLink();
    await flush();
    expect(p.toast()).toBe('TOAST_TOO_LONG_FOR_LINK');

    p.copySnippet();
    await flush();
    expect(writeText).not.toHaveBeenCalled();
  });
});

describe('history', () => {
  const legacy: HistoryItem = {
    data: 'https://old.example/',
    preset: 'sq200',
    ecc: 'Q',
    quiet: 2,
    canonicalUrl: 'https://qr.qrcgen.com/qr/sq200/0000.svg',
    createdAt: 0,
  };

  async function openHistory(items: HistoryItem[]) {
    env.history = items;
    const { createHistoryTab } = await import('@/entrypoints/sidepanel/components/history');
    const tab = createHistoryTab();
    document.body.append(tab);
    await flush();
    const [copy, open] = tab.querySelectorAll('.history-item__actions button');
    return { copy: copy as HTMLButtonElement, open: open as HTMLButtonElement };
  }

  it('copies a rebuilt self-contained link for an entry saved with a bare URL', async () => {
    const h = await openHistory([legacy]);
    h.copy.click();
    await flush();
    const url = writeText.mock.calls[0][0] as string;
    expect(url).not.toBe(legacy.canonicalUrl);
    expect(new URL(url).searchParams.get('data')).toBe(legacy.data);
    expect(url).toContain('/qr/sq200/');
  });

  it('opens the rebuilt link in a new tab', async () => {
    const h = await openHistory([legacy]);
    h.open.click();
    await flush();
    expect(tabsCreate).toHaveBeenCalledTimes(1);
    expect(tabsCreate.mock.calls[0][0]).toMatchObject({ url: expect.stringContaining('?data=') });
  });

  it('refuses an entry too long for a link', async () => {
    const h = await openHistory([{ ...legacy, data: `https://x.example/${'b'.repeat(2100)}` }]);
    h.copy.click();
    h.open.click();
    await flush();
    expect(writeText).not.toHaveBeenCalled();
    expect(tabsCreate).not.toHaveBeenCalled();
  });
});
