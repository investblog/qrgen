import { LINKS } from '@shared/brand';

interface LifecycleApi {
  runtime: {
    onInstalled: { addListener: (cb: (details: { reason: string }) => void) => void };
    setUninstallURL?: (url: string) => Promise<void> | void;
    getURL: (path: string) => string;
  };
  tabs: { create: (options: { url: string }) => Promise<unknown> };
}

type ClickApi = { onClicked: { addListener: (cb: (tab: { windowId?: number }) => void) => void } };

interface ToolbarApi {
  action?: ClickApi;
  browserAction?: ClickApi;
  sidebarAction?: { toggle?: () => Promise<void> };
  sidePanel?: {
    open?: (options: { windowId: number }) => Promise<void>;
    setPanelBehavior?: (options: { openPanelOnActionClick: boolean }) => Promise<void>;
  };
}

/** Toolbar button opens the panel directly, no popup: Firefox toggles the sidebar (its MV2 API is
 *  browserAction), Chrome/Edge open the side panel. Both calls run inside the click gesture. */
export function registerToolbarButton(api: ToolbarApi): void {
  (api.action ?? api.browserAction)?.onClicked.addListener((tab) => {
    if (api.sidebarAction?.toggle) {
      api.sidebarAction.toggle().catch(() => {});
    } else if (tab.windowId != null) {
      api.sidePanel?.open?.({ windowId: tab.windowId }).catch(() => {});
    }
  });
  api.sidePanel?.setPanelBehavior?.({ openPanelOnActionClick: true }).catch(() => {});
}

/** Welcome page on first install only (not on updates); the feedback form opens once on uninstall. */
export function registerLifecycle(api: LifecycleApi): void {
  api.runtime.onInstalled.addListener(({ reason }) => {
    if (reason === 'install') {
      api.tabs.create({ url: api.runtime.getURL('/welcome.html') }).catch(() => {});
    }
  });

  try {
    Promise.resolve(api.runtime.setUninstallURL?.(LINKS.uninstall)).catch(() => {});
  } catch {
    // Not supported in this browser: nothing to do.
  }
}
