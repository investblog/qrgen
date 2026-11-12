import { registerLifecycle, registerToolbarButton } from '@/entrypoints/background/lifecycle';
import { openGenerator } from '@/entrypoints/welcome/open-generator';
import { describe, expect, it, vi } from 'vitest';

const flush = () => new Promise((r) => setTimeout(r, 0));

function lifecycleApi(setUninstallURL?: (url: string) => Promise<void>) {
  let onInstalled: (d: { reason: string }) => void = () => {};
  const create = vi.fn(async () => ({}));
  const api = {
    runtime: {
      onInstalled: { addListener: (cb: typeof onInstalled) => (onInstalled = cb) },
      setUninstallURL,
      getURL: (p: string) => `ext://id${p}`,
    },
    tabs: { create },
  };
  registerLifecycle(api);
  return { fire: (reason: string) => onInstalled({ reason }), create };
}

describe('install and uninstall', () => {
  it('opens the welcome page on first install only', () => {
    const l = lifecycleApi(vi.fn(async () => {}));
    l.fire('update');
    l.fire('browser_update');
    expect(l.create).not.toHaveBeenCalled();
    l.fire('install');
    expect(l.create).toHaveBeenCalledWith({ url: 'ext://id/welcome.html' });
  });

  it('sets the feedback form as the uninstall page', () => {
    const set = vi.fn(async () => {});
    lifecycleApi(set);
    expect(set).toHaveBeenCalledWith(expect.stringMatching(/^https:\/\/301\.st\/contact\?.*utm_campaign=uninstall$/));
  });

  it('survives a browser without, or rejecting, setUninstallURL', async () => {
    expect(() => lifecycleApi(undefined)).not.toThrow();
    expect(() => lifecycleApi(() => Promise.reject(new Error('no')))).not.toThrow();
    await flush();
  });
});

describe('toolbar button opens the panel, no popup', () => {
  function clickable() {
    let click: (tab: { windowId?: number }) => void = () => {};
    return { api: { onClicked: { addListener: (cb: typeof click) => (click = cb) } }, click: (t = {}) => click(t) };
  }

  it('Firefox (MV2 browserAction) toggles the sidebar', () => {
    const b = clickable();
    const toggle = vi.fn(async () => {});
    registerToolbarButton({ browserAction: b.api, sidebarAction: { toggle } });
    b.click();
    expect(toggle).toHaveBeenCalledTimes(1);
  });

  it('Chrome/Edge open the side panel on click and set it as the button behavior', () => {
    const a = clickable();
    const open = vi.fn(async () => {});
    const setPanelBehavior = vi.fn(async () => {});
    registerToolbarButton({ action: a.api, sidePanel: { open, setPanelBehavior } });
    expect(setPanelBehavior).toHaveBeenCalledWith({ openPanelOnActionClick: true });
    a.click({ windowId: 3 });
    expect(open).toHaveBeenCalledWith({ windowId: 3 });
  });
});

describe('welcome page: open the generator', () => {
  const base = () => ({
    tabs: { create: vi.fn(async () => ({})) },
    runtime: { getURL: (p: string) => `ext://id${p}` },
  });

  it('Firefox opens the sidebar', () => {
    const open = vi.fn(async () => {});
    const api = { ...base(), sidebarAction: { open } };
    openGenerator(api, undefined);
    expect(open).toHaveBeenCalled();
    expect(api.tabs.create).not.toHaveBeenCalled();
  });

  it('Chrome/Edge open the side panel in the cached window, synchronously', () => {
    const open = vi.fn(async () => {});
    openGenerator({ ...base(), sidePanel: { open } }, 7);
    expect(open).toHaveBeenCalledWith({ windowId: 7 });
  });

  it('a rejected or unavailable panel falls back to the panel page in a tab', async () => {
    const rejected = { ...base(), sidePanel: { open: vi.fn(() => Promise.reject(new Error('gesture'))) } };
    openGenerator(rejected, 7);
    await flush();
    expect(rejected.tabs.create).toHaveBeenCalledWith({ url: 'ext://id/sidepanel.html' });

    const noWindow = { ...base(), sidePanel: { open: vi.fn(async () => {}) } };
    openGenerator(noWindow, undefined);
    expect(noWindow.sidePanel.open).not.toHaveBeenCalled();
    expect(noWindow.tabs.create).toHaveBeenCalledWith({ url: 'ext://id/sidepanel.html' });
  });
});
