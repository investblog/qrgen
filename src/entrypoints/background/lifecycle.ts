import { LINKS } from '@shared/brand';

interface LifecycleApi {
  runtime: {
    onInstalled: { addListener: (cb: (details: { reason: string }) => void) => void };
    setUninstallURL?: (url: string) => Promise<void> | void;
    getURL: (path: string) => string;
  };
  tabs: { create: (options: { url: string }) => Promise<unknown> };
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
