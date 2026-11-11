import { browser } from 'wxt/browser';

export type { Message, MessageMap, MessageResponse, MessageType } from './protocol';

export function sendMessageSafe<T = unknown>(message: {
  type: string;
  payload?: unknown;
}): Promise<T & { __error?: string }> {
  return browser.runtime.sendMessage(message).then(
    (response: any) => response as T & { __error?: string },
    (err: Error) => {
      console.warn('sendMessageSafe:', err.message);
      return { __error: err.message } as T & { __error: string };
    },
  );
}

/**
 * Asks the background to request a share link once, so the image is cached at the nearest edge.
 * Called only when the user hands a link out (copy / open) — never for the local preview.
 */
export function warmLink(url: string): void {
  void sendMessageSafe({ type: 'qrcgen:warm-cache', payload: { url } });
}
