# Privacy Policy

**QRCGen** — QR Code Generator Browser Extension

*Last updated: November 12, 2026*

## Summary

QRCGen runs entirely in your browser. No accounts, no tracking, no analytics, and — since version
1.1.0 — no network requests at all. The only way your data leaves the browser is a link you copy or open.

## Data Collection

QRCGen does not collect personal data and has no user accounts.

### What stays on your device

- QR code generation is performed locally using the `uqr` library, including the automatic code for
  the current page; it is not stored.
- Extension settings (theme, default size, error correction level, history limit, auto-generate) and
  QR code history (codes whose share link you copied) are stored locally via `browser.storage.local`;
  they are not synced or sent anywhere.

### Share links

A share link or embed snippet points to `qr.clx.cx` and carries the encoded text and QR
parameters in plain form, so the image can be rebuilt from the link itself. The extension does not
request the link; it is requested by whoever opens it — you, if you open it from history, or anyone you
share it with. Anyone who has the link, or scans the QR code, can read the text: do not put passwords
or other secrets into a QR code you share.

Versions before 1.1.0 sent a request to `qr.qrcgen.com` every time a QR code was generated, including
the automatic code for the current page when the panel opened.

## Permissions

| Permission | Purpose |
|------------|---------|
| `sidePanel` / `sidebar` | Display the extension UI in the browser side panel |
| `storage` | Save your settings and history locally |
| `activeTab` + `tabs` | Read the URL of the current page when the panel opens or you press refresh |

The extension does not access page content, browsing history, bookmarks, passwords, or any other browser data.

## Third-Party Services

The extension itself uses none. Share links are served by **qr.clx.cx**, a QR code API on
Cloudflare Workers: it renders a share link's image from the link on each request without storing it,
and its code does not log the encoded data or user identities. Cloudflare, as the hosting provider, processes request
metadata under its own privacy policy. See the [clx.cx privacy policy](https://clx.cx/privacy).

## Data Retention

- Local data (settings, history) persists until you clear it via the extension settings or uninstall the extension.
- The extension keeps nothing anywhere else, and the QR service does not store share-link images.

## Children's Privacy

QRCGen does not knowingly collect any data from children or any other users.

## Changes to This Policy

Updates will be posted in this file and reflected in the extension's store listing. The "last updated" date at the top indicates the most recent revision.

## Contact

If you have questions about this policy, please open an issue at [github.com/investblog/qrgen](https://github.com/investblog/qrgen/issues) or email [support@qrcgen.com](mailto:support@qrcgen.com).
