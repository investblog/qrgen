import type { MessageMap } from '@shared/messaging';
import { browser } from 'wxt/browser';

export default defineBackground(() => {
  // Open side panel on action click
  browser.action.onClicked.addListener(async (tab) => {
    if (tab.windowId != null) {
      await (browser as any).sidePanel.open({ windowId: tab.windowId });
    }
  });

  // Enable side panel to open on action click
  (browser as any).sidePanel?.setPanelBehavior?.({ openPanelOnActionClick: true }).catch(() => {
    // Fallback: not all browsers support this
  });

  // Message router
  browser.runtime.onMessage.addListener(((
    message: unknown,
    _sender: any,
    sendResponse: (response: unknown) => void,
  ) => {
    const msg = message as { type: string; payload?: any };

    if (msg.type === 'qrcgen:get-tab-url') {
      handleGetTabUrl().then(sendResponse);
      return true;
    }

    if (msg.type === 'qrcgen:warm-cache') {
      const payload = msg.payload as MessageMap['qrcgen:warm-cache']['request'];
      handleWarmCache(payload.apiUrl).then(sendResponse);
      return true;
    }

    return true;
  }) as any);
});

async function handleGetTabUrl(): Promise<MessageMap['qrcgen:get-tab-url']['response']> {
  try {
    const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
    return {
      url: tab?.url ?? '',
      title: tab?.title ?? '',
    };
  } catch {
    return { url: '', title: '' };
  }
}

async function handleWarmCache(apiUrl: string): Promise<MessageMap['qrcgen:warm-cache']['response']> {
  try {
    await fetch(apiUrl, { redirect: 'follow', mode: 'no-cors' });
    return { ok: true };
  } catch {
    return { ok: false };
  }
}
