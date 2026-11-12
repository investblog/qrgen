---
type: reference
status: active
tags: [store, listing, amo, en]
project: qrgen
---

# SVG QR Code Generator — AMO listing, English

Firefox Add-ons only: its own text in AMO's Markdown, not the Chrome Web Store one. Rules: [README](../README.md).

## Description

**A QR code for the page you are reading, in Firefox's sidebar.** Click the toolbar button and SVG QR Code Generator shows the code for the current tab. Scan it with your phone's camera to continue there: no emailing yourself links, no sync, no sign-up. Codes are drawn locally as clean SVG.

**From the desktop to your phone**

- The sidebar starts with the current page, so moving it to your phone takes a single scan.
- A dev server on your local network works too: open it by the computer's IP address and scan.
- Only addresses the phone can reach will open; localhost and other names known just to your computer will not.

**Making codes**

- Type any text or link in place of the page address.
- Four size presets and four error correction levels; with Q or H a printed code copes better with scratches.
- Save the code as an SVG file or copy the markup: a single path, a few kilobytes, sharp at any scale.

**Sharing and embedding**

- A share link on qr.clx.cx rebuilds the image from the link each time it is opened, so no image file is ever stored.
- Snippets for HTML, Markdown, React and Vue are one click away.
- Codes you copy with Copy Share Link go to History, kept on this computer only.

**Privacy**

- The add-on makes no network requests of its own.
- Whatever you encode can be read by anyone who gets the share link, so leave secrets out.
- No sign-up, no analytics, no ads.

Want scan counts? Put a [clx.cx](https://clx.cx/short-links) short link inside the code.

By 301.st, open source on [GitHub](https://github.com/investblog/qrgen). Light and dark themes; the interface follows the language of your Firefox, in seven languages.
