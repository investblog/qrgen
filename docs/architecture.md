---
type: reference
status: active
tags: [architecture, release]
project: qrgen
---

# QRCGen — architecture and development

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
│   ├── background/index.ts          # Service worker: opens the side panel, tab URL
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
│       └── index.ts                 # re-exports the types
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
  → side panel reads the active tab URL (tabs.query)
  → LOCAL: uqr.encode() → matrix → renderSvgPreview() → inline SVG (instant)
  → LOCAL: computeHash() → canonical URL /qr/<preset>/<hash>.svg?data=…&ecc=…&q=… (no fetch)
  → User clicks "Copy Share Link" / copies a snippet / copies or opens a history item
      → clipboard gets the URL (history entries open via tabs.create)
```

The extension makes no network requests and has no host permissions. The link is self-contained: the
worker re-creates the image from the query and checks it against the hash, so it works from any edge
location; `isLinkable()` withholds links whose data the worker would reject (over 2,048 characters).
History entries are re-linked from their stored data, so entries saved by older versions (bare URLs)
get self-contained links too.

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

## Conventions

- i18n keys: `SCREAMING_SNAKE` → `browser.i18n.getMessage()`
- Icons: Feather Icons as inline SVG paths in `helpers.ts`
- CSS: BEM-like classes, CSS custom properties for theming
- State: Local component state + pub-sub (`state.ts`) for cross-component
- Imports: Path aliases `@shared/`, `@qr/`, `@/`

## Releasing / store deploy

Version lives **only** in `wxt.config.ts` (`manifest.version`); `package.json` is not
used by the build. To release: bump it, then `git tag vX.Y.Z && git push origin vX.Y.Z`.

A `v*` tag drives two workflows:
- `release.yml` — typecheck/lint/test + a GitHub release with the built ZIPs.
- `submit.yml` — a thin caller of the **shared reusable workflow**
  `investblog/geo-tier-builder/.github/workflows/store-submit.yml@main`.

**Chrome + Edge auto-submit on the tag; Firefox is manual** (Actions → *Submit to
stores* → `stores=firefox`; AMO burns version numbers forever, so it never
auto-runs). The manual dispatch has a `dry_run` toggle that validates
credentials without publishing.

Store credentials are this repo's **GitHub Actions secrets** (`CHROME_*`,
`FIREFOX_*`, `EDGE_*`). API creds are account-level and shared across all
investblog extensions; only the per-extension IDs (`CHROME_EXTENSION_ID`,
`FIREFOX_EXTENSION_ID`, `EDGE_PRODUCT_ID`) differ.

**Before changing the release/CI flow:** confirm the reusable-workflow ref still
resolves and the secrets exist (`gh secret list`). Store publishing here depends
on the external `investblog/geo-tier-builder` workflow — it is a cross-repo
contract, not visible from this repo's code alone.
