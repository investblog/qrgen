export interface MessageMap {
  'qrcgen:get-tab-url': {
    request: Record<string, never>;
    response: { url: string; title: string };
  };
  'qrcgen:warm-cache': {
    request: { apiUrl: string };
    response: { ok: boolean };
  };
}

export type MessageType = keyof MessageMap;

export interface Message<T extends MessageType = MessageType> {
  type: T;
  payload?: MessageMap[T]['request'];
}

export type MessageResponse<T extends MessageType> = MessageMap[T]['response'];
