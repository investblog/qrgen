# Privacy Policy

**QRCGen** — QR Code Generator Browser Extension

*Last updated: February 19, 2026*

## Summary

QRCGen runs entirely in your browser. No accounts, no tracking, no analytics. The only network request is an optional cache-warming fetch so share links load instantly for recipients.

## Data Collection

QRCGen does **not** collect, store, or transmit any personal data.

### What stays on your device

- QR code generation (performed locally using the `uqr` library)
- Extension settings (theme, default size, error correction level)
- QR code history (recent items you explicitly saved)

All of the above is stored locally via `browser.storage.local` and never leaves your browser.

### What is sent over the network

When you generate a QR code, the extension sends a single **cache-warming request** to `qr.qrcgen.com`. This request contains:

- The URL or text you encoded
- QR parameters (size preset, error correction level, quiet zone)

This request is used solely to pre-cache the QR code image on a CDN edge server so that share links load instantly. No cookies, tokens, or identifiers are attached.

**No other network requests are made.**

## Permissions

| Permission | Purpose |
|------------|---------|
| `sidePanel` / `sidebar` | Display the extension UI in the browser side panel |
| `storage` | Save your settings and history locally |
| `activeTab` + `tabs` | Read the URL of your current page to generate a QR code |

The extension does not access page content, browsing history, bookmarks, passwords, or any other browser data.

## Third-Party Services

- **qr.qrcgen.com** — QR code CDN (Cloudflare Workers). No analytics, no cookies, no logging of user identities. See [API documentation](https://qrcgen.com/docs/qr-api).

No other third-party services, SDKs, or analytics tools are used.

## Data Retention

- Local data (settings, history) persists until you clear it via the extension settings or uninstall the extension.
- Cache-warming requests are processed by Cloudflare Workers with no persistent logging of request origins.

## Children's Privacy

QRCGen does not knowingly collect any data from children or any other users.

## Changes to This Policy

Updates will be posted in this file and reflected in the extension's store listing. The "last updated" date at the top indicates the most recent revision.

## Contact

If you have questions about this policy, please open an issue at [github.com/investblog/qrgen](https://github.com/investblog/qrgen/issues) or email [support@qrcgen.com](mailto:support@qrcgen.com).
