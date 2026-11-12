import { GLYPHS, getStoreInfo, glyph, LINKS } from '@shared/brand';
import { el, t } from '../helpers';

function link(href: string, className: string, title: string): HTMLAnchorElement {
  const a = document.createElement('a');
  a.href = href;
  a.target = '_blank';
  a.rel = 'noopener';
  a.className = className;
  a.title = title;
  a.setAttribute('aria-label', title);
  return a;
}

/** Panel footer: rate link for this build's store on the left, clx / 301.st / feedback glyphs on the right. */
export function createFooter(): HTMLElement {
  const footer = el('div', 'panel__footer');

  const store = getStoreInfo();
  if (store) {
    const review = link(store.url, 'panel__review', t('RATE_ON_STORE', store.label));
    review.rel = 'noreferrer';
    const icon = document.createElement('img');
    icon.src = store.icon;
    icon.width = 14;
    icon.height = 14;
    icon.alt = '';
    review.append(icon, t('RATE_US'));
    footer.appendChild(review);
  } else {
    footer.appendChild(el('span'));
  }

  const right = el('div', 'panel__footer-links');

  const clx = link(
    `${t('SITE_URL')}/qr-code-generator?utm_source=extension&utm_medium=footer`,
    'panel__clx',
    t('FOOTER_CLX_TITLE'),
  );
  clx.append(glyph(GLYPHS.clx, 14), 'clx.cx');
  right.appendChild(clx);

  const sponsor = link(LINKS.sponsor('footer'), 'panel__glyph', t('FOOTER_CRAFTED_AT'));
  sponsor.appendChild(glyph(GLYPHS.s301, 14));
  right.appendChild(sponsor);

  const github = link(LINKS.github, 'panel__glyph', t('FOOTER_FEEDBACK'));
  github.appendChild(glyph(GLYPHS.github, 14));
  right.appendChild(github);

  const telegram = link(LINKS.telegram, 'panel__glyph', t('FOOTER_TELEGRAM'));
  telegram.appendChild(glyph(GLYPHS.telegram, 14));
  right.appendChild(telegram);

  footer.appendChild(right);
  return footer;
}
