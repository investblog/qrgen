![QRCGen](assets/banner-1280x800.png)

# QRCGen

QR code generator browser extension — side panel UI, share links, embed snippets and offline preview.

[![Chrome Web Store](https://img.shields.io/badge/Chrome-Web%20Store-4285F4?logo=googlechrome&logoColor=white)](#)
[![Edge Add-ons](https://img.shields.io/badge/Edge-Add--ons-0078D7?logo=microsoftedge&logoColor=white)](#)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](#)
[![WXT](https://img.shields.io/badge/WXT-0.19-00DC82?logo=data:image/svg+xml;base64,&logoColor=white)](#)

## Features

- **Side panel UI** — always accessible, doesn't block the page
- **Instant preview** — QR generated locally via `uqr`, no network needed
- **~5 KB SVGs** — run-length encoded, single `<path>`, integer coordinates
- **Share links** — self-contained links at `qr.qrcgen.com` that work from any CDN edge location
- **Embed snippets** — HTML, Markdown, React, Vue formats
- **History** — recent QR codes stored locally
- **Dark & light theme** — with auto-detection
- **2 languages** — English, Russian
- **Local first** — no accounts, no tracking; data leaves your browser only in a link you copy or open

## Install

| Browser | Link |
|---------|------|
| Chrome | Coming soon |
| Edge | Coming soon |

## How It Works

1. Click the extension icon — side panel opens with a QR code for the current page
2. QR matrix generated **locally** with `uqr` — instant, offline
3. SHA-256 hash computed locally (same algorithm as the API worker)
4. Share link built deterministically — the path names the image, the query carries the data, so the
   API can rebuild and verify it anywhere; no API call needed
5. Copy share link, download SVG, or grab an embed snippet — copying a link requests it once to warm
   the CDN edge cache

## Development

```bash
git clone https://github.com/investblog/qrgen.git
cd qrgen
npm install

npm run dev            # Chrome dev build with HMR
npm run dev:edge       # Edge dev build
npm run build          # Chrome production
npm run build:all      # Chrome + Edge production
npm run zip:all        # Distribution archives
npm run check          # typecheck + lint + test
```

## Tech Stack

- [WXT](https://wxt.dev) ^0.19 — web extension framework with HMR
- TypeScript ^5.7
- [uqr](https://github.com/unjs/uqr) — QR matrix generation (zero deps)
- Vanilla DOM — no React/Vue runtime
- [Biome](https://biomejs.dev) — linter & formatter
- [Vitest](https://vitest.dev) + happy-dom — unit tests and side panel flow tests
- Chrome MV3 + Edge MV3 builds

## Privacy

QRCGen runs in your browser. QR codes are generated locally — nothing is sent for the preview. The extension contacts `qr.qrcgen.com` only when you copy or open a share link or snippet, and the link carries the encoded text. No accounts, no tracking, no analytics. Full policy: [PRIVACY.md](PRIVACY.md).

## Related

- [qr-generator](https://github.com/investblog/qr-generator) — Cloudflare Worker API at `qr.qrcgen.com`
- [qrcgen.com](https://qrcgen.com) — web UI & documentation
- [API docs](https://qrcgen.com/docs/qr-api) — endpoint reference
- [Extension guide](https://qrcgen.com/docs/qr-extension) — user documentation

## License

[MIT](LICENSE)

---

Built by [investblog](https://github.com/investblog) with [Claude](https://claude.ai)
