import { getTheme, initTheme, toggleTheme } from '@shared/theme';
import { createEmbedTab } from './components/embed';
import { createGenerateTab } from './components/generate';
import { createHistoryTab, refreshHistory } from './components/history';
import { createSettingsTab } from './components/settings';
import { el, ICONS, svgIcon, t } from './helpers';

type TabId = 'generate' | 'embed' | 'history' | 'settings';

const TAB_DEFS: Array<{ id: TabId; icon: string; labelKey: string }> = [
  { id: 'generate', icon: ICONS.qr, labelKey: 'TAB_GENERATE' },
  { id: 'embed', icon: ICONS.code, labelKey: 'TAB_EMBED' },
  { id: 'history', icon: ICONS.clock, labelKey: 'TAB_HISTORY' },
  { id: 'settings', icon: ICONS.settings, labelKey: 'TAB_SETTINGS' },
];

let activeTab: TabId = 'generate';
const tabContents = new Map<TabId, HTMLElement>();
const tabButtons = new Map<TabId, HTMLElement>();

function buildUI(): void {
  const app = document.getElementById('app')!;
  app.textContent = '';

  const panel = el('div', 'panel');

  // Header
  const header = el('div', 'panel__header');
  const titleLink = document.createElement('a');
  titleLink.href = 'https://qrcgen.com/?utm_source=extension&utm_medium=sidepanel';
  titleLink.target = '_blank';
  titleLink.rel = 'noopener';
  titleLink.className = 'panel__title';
  titleLink.textContent = 'QRCGen';
  header.appendChild(titleLink);

  const headerActions = el('div', 'panel__header-actions');
  const themeBtn = el('button', 'theme-toggle') as HTMLButtonElement;
  themeBtn.title = t('THEME_TOGGLE');
  updateThemeIcon(themeBtn);
  themeBtn.addEventListener('click', () => {
    toggleTheme();
    updateThemeIcon(themeBtn);
  });
  headerActions.appendChild(themeBtn);
  header.appendChild(headerActions);
  panel.appendChild(header);

  // Tabs navigation
  const tabs = el('div', 'tabs');
  for (const def of TAB_DEFS) {
    const btn = el('button', `tabs__item${def.id === activeTab ? ' active' : ''}`);
    btn.appendChild(svgIcon(def.icon, 14));
    btn.appendChild(document.createTextNode(t(def.labelKey)));
    btn.addEventListener('click', () => switchTab(def.id));
    tabs.appendChild(btn);
    tabButtons.set(def.id, btn);
  }
  panel.appendChild(tabs);

  // Tab contents
  const generateContent = el('div', 'tab-content');
  generateContent.id = 'tab-generate';
  generateContent.appendChild(createGenerateTab());
  tabContents.set('generate', generateContent);
  panel.appendChild(generateContent);

  const embedContent = el('div', 'tab-content');
  embedContent.id = 'tab-embed';
  embedContent.hidden = true;
  embedContent.appendChild(createEmbedTab());
  tabContents.set('embed', embedContent);
  panel.appendChild(embedContent);

  const historyContent = el('div', 'tab-content');
  historyContent.id = 'tab-history';
  historyContent.hidden = true;
  historyContent.appendChild(createHistoryTab());
  tabContents.set('history', historyContent);
  panel.appendChild(historyContent);

  const settingsContent = el('div', 'tab-content');
  settingsContent.id = 'tab-settings';
  settingsContent.hidden = true;
  settingsContent.appendChild(createSettingsTab());
  tabContents.set('settings', settingsContent);
  panel.appendChild(settingsContent);

  // Footer
  const footer = el('div', 'panel__footer');
  const footerLink = document.createElement('a');
  footerLink.href = 'https://qrcgen.com/?utm_source=extension&utm_medium=footer';
  footerLink.target = '_blank';
  footerLink.rel = 'noopener';
  footerLink.textContent = 'qrcgen.com';
  footer.appendChild(footerLink);
  panel.appendChild(footer);

  app.appendChild(panel);
}

function switchTab(tabId: TabId): void {
  if (tabId === activeTab) return;

  // Deactivate current
  tabButtons.get(activeTab)?.classList.remove('active');
  const currentContent = tabContents.get(activeTab);
  if (currentContent) currentContent.hidden = true;

  // Activate new
  activeTab = tabId;
  tabButtons.get(tabId)?.classList.add('active');
  const newContent = tabContents.get(tabId);
  if (newContent) newContent.hidden = false;

  // Refresh history when switching to history tab
  if (tabId === 'history') {
    refreshHistory();
  }
}

function updateThemeIcon(btn: HTMLElement): void {
  btn.textContent = '';
  const theme = getTheme();
  btn.appendChild(svgIcon(theme === 'dark' ? ICONS.sun : ICONS.moon, 16));
}

// ---- Init ----
initTheme();
buildUI();
