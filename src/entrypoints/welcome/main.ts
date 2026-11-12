import { GLYPHS, getStoreInfo, glyph, LINKS } from '@shared/brand';
import { initTheme } from '@shared/theme';
import { releaseNoteItems, WHATS_NEW } from '@shared/whats-new';
import { browser } from 'wxt/browser';
import { shortLinksUrl, t } from '../sidepanel/helpers';
import { openGenerator } from './open-generator';

initTheme();

// ---- i18n hydration: keep the English fallback in the HTML when a key is missing ----
document.documentElement.lang = browser.i18n.getUILanguage();
document.title = t('EXTENSION_NAME');
for (const node of document.querySelectorAll<HTMLElement>('[data-i18n]')) {
  const key = node.dataset.i18n!;
  const msg = t(key);
  if (msg && msg !== key) node.textContent = msg;
}

const clxLink = document.getElementById('clx-link') as HTMLAnchorElement | null;
if (clxLink) clxLink.href = shortLinksUrl('welcome');

// ---- What's new ----
const latest = WHATS_NEW[0];
const whatsNew = document.getElementById('whats-new');
const whatsNewList = document.getElementById('whats-new-list');
const whatsNewTitle = document.getElementById('whats-new-title');
if (latest && whatsNew && whatsNewList && whatsNewTitle) {
  whatsNewTitle.textContent = t('WHATS_NEW_TITLE', latest.version);
  for (const line of releaseNoteItems(latest, browser.i18n.getUILanguage())) {
    const li = document.createElement('li');
    li.textContent = line;
    whatsNewList.appendChild(li);
  }
  whatsNew.hidden = false;
}

// ---- Footer: version · rate · crafted at 301.st · feedback ----
const footer = document.getElementById('welcome-footer');
const version = document.getElementById('version');
if (version) version.textContent = `v${browser.runtime.getManifest().version}`;

function footerLink(href: string, title: string, className: string): HTMLAnchorElement {
  const a = document.createElement('a');
  a.href = href;
  a.target = '_blank';
  a.rel = 'noopener';
  a.className = className;
  a.title = title;
  a.setAttribute('aria-label', title);
  return a;
}

function separator(): HTMLElement {
  const sep = document.createElement('span');
  sep.className = 'welcome__footer-sep';
  sep.textContent = '·';
  return sep;
}

if (footer) {
  const store = getStoreInfo();
  if (store) {
    const review = footerLink(store.url, t('RATE_ON_STORE', store.label), 'welcome__sponsor');
    review.rel = 'noreferrer';
    const icon = document.createElement('img');
    icon.src = store.icon;
    icon.width = 14;
    icon.height = 14;
    icon.alt = '';
    review.append(icon, t('RATE_US'));
    footer.append(separator(), review);
  }

  const sponsor = footerLink(LINKS.sponsor('welcome'), '301.st', 'welcome__sponsor');
  sponsor.append(`${t('FOOTER_CRAFTED_AT')} `, glyph(GLYPHS.s301, 14));
  footer.append(separator(), sponsor, separator());

  const github = footerLink(LINKS.github, t('FOOTER_FEEDBACK'), 'welcome__social-link');
  github.appendChild(glyph(GLYPHS.github, 14));
  const telegram = footerLink(LINKS.telegram, t('FOOTER_TELEGRAM'), 'welcome__social-link');
  telegram.appendChild(glyph(GLYPHS.telegram, 14));
  footer.append(github, telegram);
}

// ---- CTA: open the side panel (Chrome/Edge) or the sidebar (Firefox) from this click ----
let windowId: number | undefined;
browser.windows
  ?.getCurrent?.()
  .then((win) => {
    windowId = win.id;
  })
  .catch(() => {});
document.getElementById('cta')?.addEventListener('click', () => openGenerator(browser as any, windowId));
