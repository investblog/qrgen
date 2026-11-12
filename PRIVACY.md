# Privacy Policy

**SVG QR Code Generator** browser extension (formerly QRCGen)

*Last updated: November 12, 2026*

The same policy, together with the QR code API and the web generator, is published at
[clx.cx/qr-code-privacy](https://clx.cx/qr-code-privacy).

## Summary

The extension runs entirely in your browser. No accounts, no tracking, no analytics, and — since version
1.1.0 — the extension itself makes no network requests. Your data leaves the browser only in a link you
copy or open. The one page the browser opens without a click is a feedback form when you uninstall the
extension (see *Pages the browser opens*).

## Data Collection

The extension does not collect personal data and has no user accounts.

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

### Pages the browser opens

On first install the extension opens its welcome page, which is bundled with the extension. When you
uninstall it, the browser opens a feedback form at `301.st/contact` once; the address carries only
campaign tags naming the extension, nothing about you, and like any web page the request reaches
301.st with your IP address and browser user agent. Links in the panel (store reviews, clx.cx,
301.st, GitHub, Telegram) open only when you click them.

## Third-Party Services

The extension itself uses none. Share links are served by **qr.clx.cx**, a QR code API on
Cloudflare Workers: it renders a share link's image from the link on each request without storing it,
and its code does not log the encoded data or user identities. Cloudflare, as the hosting provider, processes request
metadata under its own privacy policy.

## Data Retention

- Local data (settings, history) persists until you clear it via the extension settings or uninstall the extension.
- The extension keeps nothing anywhere else, and the QR service does not store share-link images.

## Children's Privacy

The extension does not knowingly collect any data from children or any other users.

## Changes to This Policy

Updates will be posted in this file and reflected in the extension's store listing. The "last updated" date at the top indicates the most recent revision.

## Contact

If you have questions about this policy, please open an issue at [github.com/investblog/qrgen](https://github.com/investblog/qrgen/issues) or use the contact form at [301.st/contact](https://301.st/contact).
