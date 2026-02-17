import { generateMatrix } from '@qr/generate';
import { renderSvg, renderSvgPreview } from '@qr/render';
import { buildApiUrl, buildCanonicalUrl } from '@shared/canonical';
import { DEFAULT_SETTINGS, ECC_LEVELS, MAX_DATA_LENGTH } from '@shared/constants';
import type { MessageMap } from '@shared/messaging';
import { sendMessageSafe } from '@shared/messaging';
import { getPreset, PRESET_IDS, PRESETS } from '@shared/presets';
import { addHistoryItem, loadSettings } from '@shared/storage';
import type { EccLevel, PresetId, QrParams } from '@shared/types';
import { copyToClipboard, downloadFile, el, ICONS, showToast, svgIcon, t } from '../helpers';
import { setCanonicalUrl } from '../state';

interface GenerateState {
  source: 'tab' | 'custom';
  customInput: string;
  tabUrl: string;
  tabTitle: string;
  preset: PresetId;
  ecc: EccLevel;
  quiet: number;
  canonicalUrl: string;
  svgString: string;
}

const state: GenerateState = {
  source: 'tab',
  customInput: '',
  tabUrl: '',
  tabTitle: '',
  preset: DEFAULT_SETTINGS.defaultPreset,
  ecc: DEFAULT_SETTINGS.defaultEcc,
  quiet: 4,
  canonicalUrl: '',
  svgString: '',
};

let previewContainer: HTMLElement | null = null;

export function createGenerateTab(): HTMLElement {
  const container = el('div');

  // Source selector
  const sourceRow = el('div', 'source-selector');
  const tabRadio = createSourceRadio('tab', t('GENERATE_SOURCE_TAB'));
  const customRadio = createSourceRadio('custom', t('GENERATE_SOURCE_CUSTOM'));

  const refreshBtn = el('button', 'btn--icon') as HTMLButtonElement;
  refreshBtn.title = 'Reload URL';
  refreshBtn.appendChild(svgIcon(ICONS.refresh, 14));
  refreshBtn.addEventListener('click', () => refreshTabUrl());

  sourceRow.appendChild(tabRadio);
  sourceRow.appendChild(refreshBtn);
  sourceRow.appendChild(customRadio);
  container.appendChild(sourceRow);

  // Custom input (hidden by default)
  const inputGroup = el('div', 'input-group');
  inputGroup.id = 'custom-input-group';
  inputGroup.style.display = 'none';
  const inputLabel = el('label', 'input-group__label', t('GENERATE_INPUT_LABEL'));
  const input = document.createElement('textarea');
  input.className = 'input-group__field';
  input.placeholder = t('GENERATE_INPUT_PLACEHOLDER');
  input.rows = 2;
  input.maxLength = MAX_DATA_LENGTH;
  input.addEventListener('input', () => {
    state.customInput = input.value;
    counter.textContent = `${input.value.length} / ${MAX_DATA_LENGTH}`;
    regenerate();
  });
  const counter = el('div', 'input-group__counter', `0 / ${MAX_DATA_LENGTH}`);
  inputGroup.appendChild(inputLabel);
  inputGroup.appendChild(input);
  inputGroup.appendChild(counter);
  container.appendChild(inputGroup);

  // Options row
  const optionsRow = el('div', 'options-row');

  const presetGroup = el('div', 'input-group');
  const presetLabel = el('label', 'input-group__label', t('GENERATE_PRESET'));
  const presetSelect = document.createElement('select');
  for (const id of PRESET_IDS) {
    const preset = PRESETS.get(id)!;
    const option = document.createElement('option');
    option.value = id;
    option.textContent = preset.label;
    if (id === state.preset) option.selected = true;
    presetSelect.appendChild(option);
  }
  presetSelect.addEventListener('change', () => {
    state.preset = presetSelect.value as PresetId;
    regenerate();
  });
  presetGroup.appendChild(presetLabel);
  presetGroup.appendChild(presetSelect);

  const eccGroup = el('div', 'input-group');
  const eccLabel = el('label', 'input-group__label', t('GENERATE_ECC'));
  const eccSelect = document.createElement('select');
  for (const level of ECC_LEVELS) {
    const option = document.createElement('option');
    option.value = level;
    option.textContent = level;
    if (level === state.ecc) option.selected = true;
    eccSelect.appendChild(option);
  }
  eccSelect.addEventListener('change', () => {
    state.ecc = eccSelect.value as EccLevel;
    regenerate();
  });
  eccGroup.appendChild(eccLabel);
  eccGroup.appendChild(eccSelect);

  optionsRow.appendChild(presetGroup);
  optionsRow.appendChild(eccGroup);
  container.appendChild(optionsRow);

  // Preview
  previewContainer = el('div', 'qr-preview');
  previewContainer.innerHTML = `<div class="qr-preview__empty">${t('GENERATE_PREVIEW_EMPTY')}</div>`;
  container.appendChild(previewContainer);

  // Actions
  const actions = el('div', 'actions');

  const copyLinkBtn = el('button', 'btn btn--primary') as HTMLButtonElement;
  copyLinkBtn.appendChild(svgIcon(ICONS.link));
  copyLinkBtn.appendChild(document.createTextNode(t('GENERATE_COPY_LINK')));
  copyLinkBtn.addEventListener('click', async () => {
    if (!state.canonicalUrl) return;
    const ok = await copyToClipboard(state.canonicalUrl);
    showToast(ok ? t('TOAST_COPIED') : t('TOAST_COPY_FAILED'), ok ? 'success' : 'error');
    if (ok) saveToHistory();
  });
  actions.appendChild(copyLinkBtn);

  const row2 = el('div', 'actions__row');

  const copySvgBtn = el('button', 'btn btn--secondary') as HTMLButtonElement;
  copySvgBtn.appendChild(svgIcon(ICONS.copy));
  copySvgBtn.appendChild(document.createTextNode(t('GENERATE_COPY_SVG')));
  copySvgBtn.addEventListener('click', async () => {
    if (!state.svgString) return;
    const ok = await copyToClipboard(state.svgString);
    showToast(ok ? t('TOAST_COPIED') : t('TOAST_COPY_FAILED'), ok ? 'success' : 'error');
  });

  const downloadBtn = el('button', 'btn btn--secondary') as HTMLButtonElement;
  downloadBtn.appendChild(svgIcon(ICONS.download));
  downloadBtn.appendChild(document.createTextNode(t('GENERATE_DOWNLOAD_SVG')));
  downloadBtn.addEventListener('click', () => {
    if (!state.svgString) return;
    const data = getCurrentData();
    const domain = extractDomain(data);
    downloadFile(state.svgString, `qr-${domain}.svg`, 'image/svg+xml');
    showToast(t('TOAST_DOWNLOADED'), 'success');
  });

  row2.appendChild(copySvgBtn);
  row2.appendChild(downloadBtn);
  actions.appendChild(row2);
  container.appendChild(actions);

  // Load initial data
  initGenerate();

  return container;
}

function createSourceRadio(value: 'tab' | 'custom', label: string): HTMLElement {
  const wrapper = el('label', `source-selector__item${state.source === value ? ' active' : ''}`);
  const radio = document.createElement('input');
  radio.type = 'radio';
  radio.name = 'source';
  radio.value = value;
  radio.checked = state.source === value;
  radio.addEventListener('change', () => {
    state.source = value;
    for (const item of document.querySelectorAll('.source-selector__item')) {
      item.classList.remove('active');
    }
    wrapper.classList.add('active');
    const customGroup = document.getElementById('custom-input-group');
    if (customGroup) customGroup.style.display = value === 'custom' ? '' : 'none';
    regenerate();
  });
  wrapper.appendChild(radio);
  wrapper.appendChild(document.createTextNode(label));
  return wrapper;
}

async function initGenerate(): Promise<void> {
  const settings = await loadSettings();
  state.preset = settings.defaultPreset;
  state.ecc = settings.defaultEcc;

  await refreshTabUrl();

  if (settings.autoGenerate && state.tabUrl) {
    regenerate();
  }
}

async function refreshTabUrl(): Promise<void> {
  const response = await sendMessageSafe<MessageMap['qrcgen:get-tab-url']['response']>({
    type: 'qrcgen:get-tab-url',
  });

  if (response && !response.__error) {
    state.tabUrl = response.url;
    state.tabTitle = response.title;
  }

  if (state.source === 'tab') {
    regenerate();
  }
}

function getCurrentData(): string {
  return state.source === 'tab' ? state.tabUrl : state.customInput.trim();
}

async function regenerate(): Promise<void> {
  const data = getCurrentData();
  if (!data || !previewContainer) {
    if (previewContainer) {
      previewContainer.innerHTML = `<div class="qr-preview__empty">${t('GENERATE_PREVIEW_EMPTY')}</div>`;
    }
    state.canonicalUrl = '';
    state.svgString = '';
    setCanonicalUrl('');
    return;
  }

  const params: QrParams = {
    data,
    preset: state.preset,
    ecc: state.ecc,
    quiet: state.quiet,
  };

  // Local render (instant)
  try {
    const matrix = generateMatrix(data, state.ecc);
    const previewSvg = renderSvgPreview(matrix, state.quiet);
    previewContainer.innerHTML = previewSvg;

    const preset = getPreset(state.preset);
    state.svgString = renderSvg(matrix, state.quiet, preset);
  } catch {
    previewContainer.innerHTML = `<div class="qr-preview__empty">${t('GENERATE_ERROR')}</div>`;
    state.svgString = '';
    return;
  }

  // Build canonical URL (local hash computation)
  state.canonicalUrl = await buildCanonicalUrl(params);
  setCanonicalUrl(state.canonicalUrl);

  // Background: warm edge cache (fire-and-forget)
  const apiUrl = buildApiUrl(params);
  sendMessageSafe({ type: 'qrcgen:warm-cache', payload: { apiUrl } });
}

async function saveToHistory(): Promise<void> {
  const data = getCurrentData();
  if (!data || !state.canonicalUrl) return;

  const settings = await loadSettings();
  await addHistoryItem(
    {
      data,
      preset: state.preset,
      ecc: state.ecc,
      quiet: state.quiet,
      canonicalUrl: state.canonicalUrl,
      createdAt: Date.now(),
    },
    settings.historyLimit,
  );
}

function extractDomain(data: string): string {
  try {
    const url = new URL(data);
    return url.hostname.replace(/^www\./, '');
  } catch {
    return data.slice(0, 20).replace(/[^a-zA-Z0-9-]/g, '_');
  }
}
