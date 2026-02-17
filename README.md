# QRCGen — QR Code Generator

Browser extension (Chrome/Edge) that generates QR codes in a side panel with share links and embed snippets.

## Features

- **Side panel UI** — always accessible, doesn't block the page
- **Instant preview** — QR generated locally via `uqr`, no network needed
- **Share links** — canonical URLs at `qr.qrcgen.com` with CDN edge caching
- **Embed snippets** — HTML, Markdown, React, Vue formats
- **History** — recent QR codes stored locally
- **Dark/Light/Auto** theme
- **i18n** — English, Russian

## Install

```bash
npm install
```

## Development

```bash
npm run dev          # Chrome with hot-reload
npm run dev:edge     # Edge
```

## Build

```bash
npm run build        # Chrome MV3 → dist/chrome-mv3/
npm run build:all    # Chrome + Edge
npm run zip:all      # Distribution archives
```

## Quality

```bash
npm run check        # typecheck + lint + test
npm run test         # Vitest
npm run lint:fix     # Biome auto-fix
```

## How It Works

1. Extension opens as a **side panel** (Chrome 116+)
2. QR matrix generated **locally** with `uqr` — instant, offline
3. SHA-256 hash computed **locally** (same algorithm as the API worker)
4. Canonical URL built deterministically — no API call needed
5. Background worker warms the CDN edge cache (fire-and-forget)
6. User copies share link, SVG, or embed snippet

## Tech

WXT, TypeScript, Vanilla DOM, uqr, Biome, Vitest.

## License

Private
