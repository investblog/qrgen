# QRCGen — QR Code Generator Browser Extension

## What This Is

Chrome/Edge MV3 side panel extension that generates QR codes locally and produces **share links** + **embed snippets** pointing to `qr.qrcgen.com` — driving organic traffic to the domain.

## Tech Stack

- **Framework:** WXT 0.19+ (cross-browser extension toolkit)
- **Language:** TypeScript strict
- **UI:** Vanilla DOM (no React/Vue), imperative `el()` helper pattern
- **QR Engine:** `uqr` (bundled, local render, zero network for preview)
- **Hash:** SHA-256 via Web Crypto (same algo as `qr-generator` worker → matching canonical URLs)
- **Styling:** CSS custom properties, design tokens from `301-ui`
- **Linter:** Biome (single quotes, semicolons, 120 width)
- **Tests:** Vitest
- **i18n:** `browser.i18n` (en + ru)

## Architecture

```
src/
├── entrypoints/
│   ├── background/index.ts          # Service worker: tab URL, cache warming
│   └── sidepanel/
│       ├── index.html               # HTML shell
│       ├── main.ts                  # Bootstrap, tab navigation
│       ├── state.ts                 # Pub-sub for canonical URL (cross-tab)
│       ├── helpers.ts               # DOM helpers, icons (Feather), clipboard, toasts
│       └── components/
│           ├── generate.ts          # QR generation: source selector, preview, actions
│           ├── embed.ts             # Snippet formats: HTML, Markdown, React, Vue
│           ├── history.ts           # History list from storage.local
│           └── settings.ts          # Defaults, theme, limits
├── qr/
│   ├── generate.ts                  # uqr.encode() → QrMatrix
│   ├── render.ts                    # SVG render with RLE path optimization
│   └── hash.ts                      # SHA-256 hash (identical to qr-generator worker)
├── shared/
│   ├── types.ts                     # QrParams, Preset, EccLevel, HistoryItem, Settings
│   ├── presets.ts                   # 4 presets: sq125, sq200, sq250, sq300
│   ├── constants.ts                 # API_BASE, defaults, limits
│   ├── canonical.ts                 # Canonical URL builder (hash-based, no fetch)
│   ├── snippets.ts                  # 5 formats: html-img, html-object, markdown, react, vue
│   ├── storage.ts                   # browser.storage.local wrappers
│   ├── theme.ts                     # Dark/light/auto theme switcher
│   └── messaging/
│       ├── protocol.ts              # MessageMap type definitions
│       └── index.ts                 # sendMessageSafe()
├── assets/css/
│   ├── theme.css                    # Design tokens (colors, typography, spacing, dark/light)
│   └── sidepanel.css                # Component styles (panel, tabs, buttons, preview, toasts)
└── public/
    ├── _locales/{en,ru}/messages.json
    └── icons/{16,32,48,128}.png
```

## Data Flow

```
User opens side panel
  → background sends current tab URL
  → LOCAL: uqr.encode() → matrix → renderSvgPreview() → inline SVG (instant)
  → LOCAL: computeHash() → canonical URL (deterministic, no fetch)
  → BACKGROUND (fire-and-forget): fetch API URL → warms CDN edge cache
  → User clicks "Copy Share Link" → clipboard gets canonical URL
```

No network dependency for preview. Network only for cache warming (best-effort).

## Commands

```bash
npm run dev          # WXT dev server + Chrome with hot-reload
npm run dev:edge     # Same for Edge
npm run build        # Production build → dist/chrome-mv3/
npm run build:all    # Chrome + Edge
npm run check        # typecheck + lint + test (run before commit)
npm run test         # Vitest
npm run lint:fix     # Biome auto-fix
```

## Manifest Permissions

- `sidePanel` — open side panel
- `storage` — persist history + settings
- `activeTab` + `tabs` — read current tab URL
- `host_permissions: qr.qrcgen.com/*` — cache warming fetch

## Related Projects

- `W:\Projects\qr-generator` — Cloudflare Worker API at `qr.qrcgen.com` (same hash algo)
- `W:\Projects\cookiepeak` — Reference WXT extension (messaging, theme patterns)
- `W:\Projects\301-ui` — Design system (CSS tokens origin)

## Conventions

- i18n keys: `SCREAMING_SNAKE` → `browser.i18n.getMessage()`
- Icons: Feather Icons as inline SVG paths in `helpers.ts`
- CSS: BEM-like classes, CSS custom properties for theming
- State: Local component state + pub-sub (`state.ts`) for cross-component
- Imports: Path aliases `@shared/`, `@qr/`, `@/`
