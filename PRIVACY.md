# Privacy Policy

**QRCGen** — QR Code Generator Browser Extension

*Last updated: November 12, 2026*

## Summary

QRCGen runs in your browser. No accounts, no tracking, no analytics. QR codes are drawn locally; the
extension contacts `qr.qrcgen.com` only when you copy or open a share link or an embed snippet.

## Data Collection

QRCGen does not collect personal data and has no user accounts. The only data that leaves your device
is the content of a QR code you choose to share, as described below.

### What stays on your device

- QR code generation is performed locally using the `uqr` library, including the automatic code for
  the current page; it is not stored.
- Extension settings (theme, default size, error correction level) and QR code history (codes whose
  share link you copied) are stored locally via `browser.storage.local`; they are not synced or sent
  anywhere automatically. A history entry's text goes out only when you copy or open its link.

### What is sent over the network

When you **copy a share link, copy an embed snippet or copy/open a link from history**, the extension
requests that link from `qr.qrcgen.com` once, so the image is ready in the CDN cache. The link — and
therefore this request — contains:

- The URL or text you encoded
- QR parameters (size preset, error correction level, quiet zone)

The share link itself carries the encoded text in plain form: anyone you give the link to, and anyone
who scans the QR code, can read it. Do not put passwords or other secrets into a QR code you share.
No cookies, tokens, or identifiers are attached to the request.

Versions before 1.1.0 sent the same request every time a QR code was generated, including the
automatic code for the current page when the panel opened.

**No other network requests are made.**

## Permissions

| Permission | Purpose |
|------------|---------|
| `sidePanel` / `sidebar` | Display the extension UI in the browser side panel |
| `storage` | Save your settings and history locally |
| `activeTab` + `tabs` | Read the URL of the current page when the panel opens or you press refresh |
| `qr.qrcgen.com` (host) | Request the share link you copied (see above) |

The extension does not access page content, browsing history, bookmarks, passwords, or any other browser data.

## Third-Party Services

- **qr.qrcgen.com** — QR code API and CDN, run on Cloudflare Workers. Its code does not log the encoded
  data or user identities and uses no analytics or cookies. Cloudflare, as the hosting provider, processes
  request metadata under its own privacy policy. See the
  [API documentation](https://qrcgen.com/docs/qr-api) and the
  [service privacy policy](https://qrcgen.com/docs/privacy).

No other third-party services, SDKs, or analytics tools are used.

## Data Retention

- Local data (settings, history) persists until you clear it via the extension settings or uninstall the extension.
- The generated image is kept in Cloudflare's edge cache for up to a year and may be evicted earlier.
  The service stores nothing about who requested it; request metadata handled by Cloudflare itself is
  covered by Cloudflare's privacy policy.

## Children's Privacy

QRCGen does not knowingly collect any data from children or any other users.

## Changes to This Policy

Updates will be posted in this file and reflected in the extension's store listing. The "last updated" date at the top indicates the most recent revision.

## Contact

If you have questions about this policy, please open an issue at [github.com/investblog/qrgen](https://github.com/investblog/qrgen/issues) or email [support@qrcgen.com](mailto:support@qrcgen.com).
