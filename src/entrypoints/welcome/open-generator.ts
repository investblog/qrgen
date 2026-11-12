interface PanelApi {
  sidebarAction?: { open?: () => Promise<void> };
  sidePanel?: { open?: (options: { windowId: number }) => Promise<void> };
  tabs: { create: (options: { url: string }) => Promise<unknown> };
  runtime: { getURL: (path: string) => string };
}

/**
 * Open the generator from a click on the welcome page. Must be called synchronously inside the click
 * handler: Chromium's `sidePanel.open` and Firefox's `sidebarAction.open` require a user gesture, so the
 * window id is resolved beforehand. Any failure falls back to the panel page in a tab — never a dead button.
 */
export function openGenerator(api: PanelApi, windowId: number | undefined): void {
  const fallback = () => {
    api.tabs.create({ url: api.runtime.getURL('/sidepanel.html') }).catch(() => {});
  };
  if (api.sidebarAction?.open) {
    api.sidebarAction.open().catch(fallback);
  } else if (api.sidePanel?.open && windowId !== undefined) {
    api.sidePanel.open({ windowId }).catch(fallback);
  } else {
    fallback();
  }
}
