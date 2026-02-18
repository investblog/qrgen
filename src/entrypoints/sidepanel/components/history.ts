import { clearHistory, loadHistory } from '@shared/storage';
import type { HistoryItem } from '@shared/types';
import { copyToClipboard, el, ICONS, showToast, svgIcon, t } from '../helpers';

let listContainer: HTMLElement | null = null;

export function createHistoryTab(): HTMLElement {
  const container = el('div');
  listContainer = el('ul', 'history-list');
  container.appendChild(listContainer);

  const footer = el('div');
  footer.style.textAlign = 'center';
  footer.style.paddingTop = 'var(--space-3)';

  const clearBtn = el('button', 'btn btn--danger btn--sm') as HTMLButtonElement;
  clearBtn.appendChild(svgIcon(ICONS.trash, 14));
  clearBtn.appendChild(document.createTextNode(t('HISTORY_CLEAR')));
  clearBtn.addEventListener('click', async () => {
    await clearHistory();
    renderHistory([]);
    showToast(t('HISTORY_CLEARED'), 'success');
  });
  footer.appendChild(clearBtn);
  container.appendChild(footer);

  refreshHistory();
  return container;
}

export async function refreshHistory(): Promise<void> {
  const items = await loadHistory();
  renderHistory(items);
}

function renderHistory(items: HistoryItem[]): void {
  if (!listContainer) return;
  listContainer.textContent = '';

  if (items.length === 0) {
    const empty = el('div', 'history-empty', t('HISTORY_EMPTY'));
    listContainer.appendChild(empty);
    return;
  }

  for (const item of items) {
    listContainer.appendChild(createHistoryRow(item));
  }
}

function createHistoryRow(item: HistoryItem): HTMLElement {
  const li = el('li', 'history-item');

  // Info
  const info = el('div', 'history-item__info');
  const dataText = el('div', 'history-item__data', truncateData(item.data));
  dataText.title = item.data;

  const meta = el('div', 'history-item__meta');
  const date = el('span', undefined, formatDate(item.createdAt));
  const badge = el('span', undefined, `${item.preset} · ${item.ecc}`);
  meta.appendChild(date);
  meta.appendChild(badge);

  info.appendChild(dataText);
  info.appendChild(meta);
  li.appendChild(info);

  // Actions
  const actions = el('div', 'history-item__actions');

  const copyBtn = el('button', 'btn btn--ghost btn--icon') as HTMLButtonElement;
  copyBtn.title = t('HISTORY_COPY_LINK');
  copyBtn.appendChild(svgIcon(ICONS.link, 14));
  copyBtn.addEventListener('click', async (e) => {
    e.stopPropagation();
    const ok = await copyToClipboard(item.canonicalUrl);
    showToast(ok ? t('TOAST_COPIED') : t('TOAST_COPY_FAILED'), ok ? 'success' : 'error');
  });

  const openBtn = el('button', 'btn btn--ghost btn--icon') as HTMLButtonElement;
  openBtn.title = t('HISTORY_OPEN');
  openBtn.appendChild(svgIcon(ICONS.externalLink, 14));
  openBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    window.open(item.canonicalUrl, '_blank');
  });

  actions.appendChild(copyBtn);
  actions.appendChild(openBtn);
  li.appendChild(actions);

  return li;
}

function truncateData(data: string): string {
  try {
    const url = new URL(data);
    return url.hostname + (url.pathname !== '/' ? url.pathname : '');
  } catch {
    return data.length > 40 ? `${data.slice(0, 40)}...` : data;
  }
}

function formatDate(timestamp: number): string {
  const d = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - d.getTime();

  if (diff < 60_000) return t('HISTORY_JUST_NOW');
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h`;

  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}
