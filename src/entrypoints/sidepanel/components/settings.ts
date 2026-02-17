import { DEFAULT_SETTINGS, ECC_LEVELS, HISTORY_LIMITS } from '@shared/constants';
import { PRESET_IDS, PRESETS } from '@shared/presets';
import { loadSettings, saveSettings } from '@shared/storage';
import { getThemePreference, setThemePreference, type ThemePreference } from '@shared/theme';
import type { EccLevel, PresetId, Settings } from '@shared/types';
import { el, t } from '../helpers';

let settings: Settings = { ...DEFAULT_SETTINGS };

export function createSettingsTab(): HTMLElement {
  const container = el('div');

  // Defaults group
  const defaultsGroup = el('div', 'settings-group');
  defaultsGroup.appendChild(el('div', 'settings-group__title', t('SETTINGS_DEFAULTS')));

  // Default preset
  const presetRow = createSelectRow(
    t('SETTINGS_DEFAULT_PRESET'),
    PRESET_IDS.map((id) => ({
      value: id,
      label: PRESETS.get(id)!.label,
    })),
    settings.defaultPreset,
    (val) => {
      settings.defaultPreset = val as PresetId;
      persist();
    },
  );
  defaultsGroup.appendChild(presetRow);

  // Default ECC
  const eccRow = createSelectRow(
    t('SETTINGS_DEFAULT_ECC'),
    ECC_LEVELS.map((l) => ({
      value: l,
      label: l,
    })),
    settings.defaultEcc,
    (val) => {
      settings.defaultEcc = val as EccLevel;
      persist();
    },
  );
  defaultsGroup.appendChild(eccRow);

  container.appendChild(defaultsGroup);

  // Behavior group
  const behaviorGroup = el('div', 'settings-group');
  behaviorGroup.appendChild(el('div', 'settings-group__title', t('SETTINGS_BEHAVIOR')));

  // Auto-generate
  const autoRow = createToggleRow(t('SETTINGS_AUTO_GENERATE'), settings.autoGenerate, (val) => {
    settings.autoGenerate = val;
    persist();
  });
  behaviorGroup.appendChild(autoRow);

  // History limit
  const historyRow = createSelectRow(
    t('SETTINGS_HISTORY_LIMIT'),
    HISTORY_LIMITS.map((n) => ({
      value: String(n),
      label: String(n),
    })),
    String(settings.historyLimit),
    (val) => {
      settings.historyLimit = Number(val);
      persist();
    },
  );
  behaviorGroup.appendChild(historyRow);

  container.appendChild(behaviorGroup);

  // Appearance group
  const appearanceGroup = el('div', 'settings-group');
  appearanceGroup.appendChild(el('div', 'settings-group__title', t('SETTINGS_APPEARANCE')));

  const themeRow = createSelectRow(
    t('SETTINGS_THEME'),
    [
      { value: 'auto', label: t('SETTINGS_THEME_AUTO') },
      { value: 'dark', label: t('SETTINGS_THEME_DARK') },
      { value: 'light', label: t('SETTINGS_THEME_LIGHT') },
    ],
    getThemePreference(),
    (val) => {
      setThemePreference(val as ThemePreference);
      settings.theme = val as Settings['theme'];
      persist();
    },
  );
  appearanceGroup.appendChild(themeRow);

  container.appendChild(appearanceGroup);

  // Privacy
  const privacyGroup = el('div', 'settings-group');
  privacyGroup.appendChild(el('div', 'settings-group__title', t('SETTINGS_PRIVACY')));
  privacyGroup.appendChild(el('div', 'privacy-note', t('SETTINGS_PRIVACY_NOTE')));
  container.appendChild(privacyGroup);

  // Links
  const linksGroup = el('div', 'settings-group');
  linksGroup.appendChild(el('div', 'settings-group__title', t('SETTINGS_LINKS')));
  const links = el('div', 'settings-links');

  const docLink = document.createElement('a');
  docLink.href = 'https://qrcgen.com/docs/qr-extension';
  docLink.target = '_blank';
  docLink.rel = 'noopener';
  docLink.textContent = t('SETTINGS_LINK_DOCS');
  links.appendChild(docLink);

  const apiLink = document.createElement('a');
  apiLink.href = 'https://qrcgen.com/docs/qr-api';
  apiLink.target = '_blank';
  apiLink.rel = 'noopener';
  apiLink.textContent = t('SETTINGS_LINK_API');
  links.appendChild(apiLink);

  linksGroup.appendChild(links);
  container.appendChild(linksGroup);

  // Load saved settings
  initSettings();

  return container;
}

async function initSettings(): Promise<void> {
  settings = await loadSettings();
}

async function persist(): Promise<void> {
  await saveSettings(settings);
}

function createSelectRow(
  label: string,
  options: Array<{ value: string; label: string }>,
  current: string,
  onChange: (value: string) => void,
): HTMLElement {
  const row = el('div', 'setting-row');
  row.appendChild(el('span', 'setting-row__label', label));

  const select = document.createElement('select');
  for (const opt of options) {
    const option = document.createElement('option');
    option.value = opt.value;
    option.textContent = opt.label;
    if (opt.value === current) option.selected = true;
    select.appendChild(option);
  }
  select.addEventListener('change', () => onChange(select.value));
  row.appendChild(select);

  return row;
}

function createToggleRow(label: string, initial: boolean, onChange: (value: boolean) => void): HTMLElement {
  const row = el('div', 'setting-row');
  row.appendChild(el('span', 'setting-row__label', label));

  const toggle = el('button', `toggle${initial ? ' active' : ''}`) as HTMLButtonElement;
  toggle.setAttribute('role', 'switch');
  toggle.setAttribute('aria-checked', String(initial));

  toggle.addEventListener('click', () => {
    const isActive = toggle.classList.toggle('active');
    toggle.setAttribute('aria-checked', String(isActive));
    onChange(isActive);
  });

  row.appendChild(toggle);
  return row;
}
