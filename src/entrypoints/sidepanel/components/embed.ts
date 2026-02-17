import { generateSnippet, SNIPPET_FORMATS } from '@shared/snippets';
import type { SnippetFormat } from '@shared/types';
import { copyToClipboard, el, ICONS, showToast, svgIcon, t } from '../helpers';
import { onCanonicalUrlChange } from '../state';

let currentFormat: SnippetFormat = 'html-img';
let currentCanonicalUrl = '';
let codeBlock: HTMLPreElement | null = null;

export function createEmbedTab(): HTMLElement {
  const container = el('div');

  // Format selector
  const selectorGroup = el('div', 'snippet-selector input-group');
  const selectorLabel = el('label', 'input-group__label', t('EMBED_FORMAT'));
  const select = document.createElement('select');
  select.className = 'input-group__field';
  select.style.minHeight = 'auto';

  for (const fmt of SNIPPET_FORMATS) {
    const option = document.createElement('option');
    option.value = fmt.id;
    option.textContent = fmt.label;
    select.appendChild(option);
  }

  select.addEventListener('change', () => {
    currentFormat = select.value as SnippetFormat;
    updateSnippet();
  });

  selectorGroup.appendChild(selectorLabel);
  selectorGroup.appendChild(select);
  container.appendChild(selectorGroup);

  // Code block
  const codeWrap = el('div', 'snippet-code');
  codeBlock = document.createElement('pre');
  codeBlock.textContent = t('EMBED_NO_QR');
  codeWrap.appendChild(codeBlock);
  container.appendChild(codeWrap);

  // Actions
  const actions = el('div', 'actions');

  const copySnippetBtn = el('button', 'btn btn--primary') as HTMLButtonElement;
  copySnippetBtn.appendChild(svgIcon(ICONS.copy));
  copySnippetBtn.appendChild(document.createTextNode(t('EMBED_COPY_SNIPPET')));
  copySnippetBtn.addEventListener('click', async () => {
    if (!currentCanonicalUrl) return;
    const snippet = generateSnippet(currentCanonicalUrl, currentFormat);
    const ok = await copyToClipboard(snippet);
    showToast(ok ? t('TOAST_COPIED') : t('TOAST_COPY_FAILED'), ok ? 'success' : 'error');
  });
  actions.appendChild(copySnippetBtn);

  const copyUrlBtn = el('button', 'btn btn--secondary') as HTMLButtonElement;
  copyUrlBtn.appendChild(svgIcon(ICONS.link));
  copyUrlBtn.appendChild(document.createTextNode(t('EMBED_COPY_URL')));
  copyUrlBtn.addEventListener('click', async () => {
    if (!currentCanonicalUrl) return;
    const ok = await copyToClipboard(currentCanonicalUrl);
    showToast(ok ? t('TOAST_COPIED') : t('TOAST_COPY_FAILED'), ok ? 'success' : 'error');
  });
  actions.appendChild(copyUrlBtn);

  // API docs link
  const docsLink = document.createElement('a');
  docsLink.href = 'https://qrcgen.com/docs/qr-api';
  docsLink.target = '_blank';
  docsLink.rel = 'noopener';
  docsLink.className = 'btn btn--ghost btn--sm';
  docsLink.style.marginTop = 'var(--space-2)';
  docsLink.style.justifyContent = 'center';
  docsLink.appendChild(svgIcon(ICONS.externalLink, 14));
  docsLink.appendChild(document.createTextNode(t('EMBED_API_DOCS')));
  actions.appendChild(docsLink);

  container.appendChild(actions);

  // Subscribe to canonical URL changes from Generate tab
  onCanonicalUrlChange((url) => {
    currentCanonicalUrl = url;
    updateSnippet();
  });

  return container;
}

function updateSnippet(): void {
  if (!codeBlock) return;
  if (!currentCanonicalUrl) {
    codeBlock.textContent = t('EMBED_NO_QR');
    return;
  }
  codeBlock.textContent = generateSnippet(currentCanonicalUrl, currentFormat);
}
