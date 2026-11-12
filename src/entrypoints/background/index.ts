import type { MessageMap } from '@shared/messaging';
import { browser } from 'wxt/browser';
import { registerLifecycle, registerToolbarButton } from './lifecycle';

export default defineBackground(() => {
  registerLifecycle(browser as any);
  registerToolbarButton(browser as any);

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
