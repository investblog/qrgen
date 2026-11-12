/**
 * Links and glyphs shared by the side panel and the welcome page.
 * Brand glyphs are filled marks (not Feather strokes); markup is static and trusted.
 */

const UTM = 'utm_source=svg-qr-code-generator&utm_medium=extension';

export const LINKS = {
  sponsor: (campaign: string) => `https://301.st/?${UTM}&utm_campaign=${campaign}`,
  uninstall: `https://301.st/contact?${UTM}&utm_campaign=uninstall`,
  github: 'https://github.com/investblog/qrgen/issues',
  telegram: 'https://t.me/traffic301',
} as const;

export interface StoreInfo {
  url: string;
  icon: string;
  label: string;
}

const STORES: Record<string, StoreInfo> = {
  chrome: {
    url: 'https://chromewebstore.google.com/detail/qrcgen-qr-code-generator/jmajfmmdjbnmcjmkfffblmolhleklglg/reviews',
    icon: '/icons/chrome.svg',
    label: 'Chrome Web Store',
  },
  edge: {
    url: 'https://microsoftedge.microsoft.com/addons/detail/qrcgen-qr-code-generator/hibgblidmmohfjfompehcajiefijcnjg',
    icon: '/icons/edge.svg',
    label: 'Edge Add-ons',
  },
  firefox: {
    url: 'https://addons.mozilla.org/firefox/addon/qrcgen-qr-code-generator/reviews/',
    icon: '/icons/mozilla.svg',
    label: 'Firefox Add-ons',
  },
};

/** The review page of the store this build ships to; `null` for builds without a listing (e.g. Opera). */
export function getStoreInfo(browserName: string = import.meta.env.BROWSER): StoreInfo | null {
  return STORES[browserName] ?? null;
}

export const GLYPHS = {
  s301: '<svg viewBox="0 0 26 26"><path fill="currentColor" d="M13.295 18.57c-.013 1.026-.074 2.047-.438 3.026-.681 1.828-2.003 2.903-3.893 3.284a8.3 8.3 0 0 1-1.56.146c-2.42.024-4.839.025-7.259.034H0v-5.454h.214c2.22.01 4.442.017 6.662.003a4 4 0 0 0 1.058-.16 1.66 1.66 0 0 0 1.22-1.546c.034-.746.052-1.494.031-2.24-.028-1.03-.769-1.766-1.8-1.803-.854-.03-1.71-.032-2.565-.035-1.536-.005-3.072 0-4.607-.008H0V9.5h.196c2.104 0 4.208.005 6.313-.007.307-.002.628-.053.917-.154.608-.212.98-.81.986-1.5q.003-.573 0-1.146c-.002-.878-.595-1.475-1.467-1.475H.034V.936h.172C3.289.947 6.37.943 9.454.95c.638.001 1.283.03 1.86.35.68.38 1.116.956 1.157 1.743.049.917.039 1.837.04 2.755.001.645-.004 1.29-.036 1.934-.045.886-.27 1.72-.849 2.42-.472.573-1.058.98-1.794 1.146-.01.002-.016.014-.041.036.089.018.167.031.243.05 1.595.404 2.635 1.372 2.984 3.001.128.598.203 1.213.24 1.824.047.785.048 1.574.037 2.361m8.421.051c-.002 1.014-.14 2.011-.596 2.933-.86 1.734-2.254 2.807-4.108 3.298-.848.224-1.712.225-2.59.2v-4.084c.265-.02.528-.026.788-.058 1.106-.136 1.82-.776 2.238-1.78.278-.667.396-1.375.41-2.089.04-1.84.053-3.68.064-5.52a60 60 0 0 0-.035-2.542c-.03-.8-.128-1.591-.436-2.343-.431-1.049-1.256-1.616-2.387-1.628-.429-.005-.857-.001-1.293-.001V.955c.018-.007.033-.018.048-.018.776.01 1.556-.023 2.327.043a5.94 5.94 0 0 1 3.612 1.601 5.94 5.94 0 0 1 1.857 3.404c.066.379.104.767.104 1.151q.01 5.869-.003 11.738zM26 .96v24.087q-.08.008-.152.01-1.155.003-2.312 0-.145 0-.286-.033a.38.38 0 0 1-.31-.325c-.017-.112-.016-.227-.016-.341q.002-11.388-.006-22.775c0-.44.185-.619.62-.621q.94-.004 1.883-.002z"/></svg>',
  clx: '<svg viewBox="0 0 100 100"><path d="M64 5H91Q95 5 95 9V36Q95 38 93.6 39.4L39.4 93.6Q38 95 36 95H9Q5 95 5 91V64Q5 62 6.4 60.6L60.6 6.4Q62 5 64 5Z" fill="none" stroke="currentColor" stroke-width="10" stroke-linejoin="round"/><g fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M46.58 1H20.34L1 20.34V46.58L9 38.58V23.66L23.66 9H38.58Z"/><path d="M46.58 1H20.34L1 20.34V46.58L9 38.58V23.66L23.66 9H38.58Z" transform="rotate(180 50 50)"/></g></svg>',
  github:
    '<svg viewBox="0 0 20 20"><path fill="currentColor" d="M10 0a10 10 0 0 0-3.162 19.487c.5.088.687-.212.687-.475 0-.237-.012-1.025-.012-1.862-2.513.462-3.163-.613-3.363-1.175a3.64 3.64 0 0 0-1.025-1.413c-.35-.187-.85-.65-.013-.662a2 2 0 0 1 1.538 1.025 2.135 2.135 0 0 0 2.912.825 2.1 2.1 0 0 1 .638-1.338c-2.225-.25-4.55-1.112-4.55-4.937a3.9 3.9 0 0 1 1.025-2.688 3.6 3.6 0 0 1 .1-2.65s.837-.262 2.75 1.025a9.43 9.43 0 0 1 5 0c1.912-1.3 2.75-1.025 2.75-1.025a3.6 3.6 0 0 1 .1 2.65A3.87 3.87 0 0 1 16.4 9.475c0 3.837-2.338 4.687-4.562 4.937a2.37 2.37 0 0 1 .674 1.85c0 1.338-.012 2.413-.012 2.75 0 .263.187.575.687.475A10.005 10.005 0 0 0 10 0"/></svg>',
  telegram:
    '<svg viewBox="0 0 20 20"><path fill="currentColor" fill-rule="evenodd" d="M10 20c5.523 0 10-4.477 10-10S15.523 0 10 0 0 4.477 0 10s4.477 10 10 10M14.99 5.863c.09-.575-.458-1.029-.97-.804L3.833 9.532c-.367.161-.34.717.04.838l2.102.67c.4.127.835.06 1.185-.181l4.737-3.273c.143-.099.299.104.177.23l-3.41 3.516a.765.765 0 0 0 .133 1.168l3.818 2.395c.428.268.979-.002 1.059-.52z"/></svg>',
} as const;

/** Build a filled brand glyph from {@link GLYPHS}. */
export function glyph(markup: string, size = 14): SVGSVGElement {
  const doc = new DOMParser().parseFromString(
    markup.replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" '),
    'image/svg+xml',
  );
  const svg = document.importNode(doc.documentElement, true) as unknown as SVGSVGElement;
  svg.setAttribute('width', String(size));
  svg.setAttribute('height', String(size));
  svg.setAttribute('aria-hidden', 'true');
  return svg;
}
