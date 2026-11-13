---
type: reference
status: active
tags: [store, listing]
project: qrgen
---

# Store listings

Listing texts for the Chrome Web Store, Edge Add-ons and Firefox Add-ons (AMO), one per package language. They are
pasted into the store dashboards as they are, so every paragraph is a single line: a hard wrap would be pasted as a
line break.

| File | What it holds | Where it goes |
|---|---|---|
| `<lang>.md` (`en`, `ru`, `de`, `es`, `fr`, `pt_BR`, `tr`) | the detailed description, the Edge search terms and the screenshot captions | description: Chrome Web Store and Edge, in its language; search terms: Edge; captions: Edge and AMO |
| `amo/<lang>.md` (the same 7) | a separate description in AMO's Markdown | AMO, in its language |
| `SUBMIT.md` | the submission runbook: what is automated, which file fills which field, release order | every release |
| `../../store-assets/` | promo tiles for Chrome and Edge and the README banner (`build.py`, SVG sources, JPEG + PNG) | Chrome and Edge tiles |

**Name and summary** come from the package: `EXTENSION_NAME` and `EXTENSION_DESCRIPTION` in `src/public/_locales/`
(the summary is limited to 132 characters, checked by `test/locales.test.ts`). They are not repeated here. AMO has no
separate summary either: it takes `EXTENSION_DESCRIPTION`.

**Privacy policy URL** in all three stores: `https://clx.cx/qr-code-privacy` (the same text as `PRIVACY.md`).

## Text rules

- Only what the extension does now, checked against the code and `PRIVACY.md`: the extension itself makes no network
  requests; a share link points to `qr.clx.cx` and carries the encoded text in plain form; scan counting belongs to clx.cx
  short links, not to the extension. No "offline" claims for share links, no promise that every page opens on a phone
  (an address only the computer can reach, such as `localhost`, does not).
- No keyword lists: no comma-separated runs of brands, formats or languages. Every bullet is a sentence about what a
  person does. The one list allowed is the snippet formats, written as a sentence.
- No third-party product names beyond the browsers themselves.
- The lead phrase is "SVG QR code generator" (what people search for); the second use case is opening the current page
  on a phone.
- Chrome Web Store and Edge: plain text, bullets as `•`, section titles as plain lines (`<lang>.md`).
- AMO: its own wording in `amo/<lang>.md`, in the Markdown AMO renders: bold, italics, links, lists, quotes, code.
  Headings, images, tables and HTML show up as text, so a section title is a bold line, bullets are `-`, and blocks are
  separated by an empty line (adjacent lines merge into one paragraph). Firefox is named by name, the panel is its
  sidebar. No paragraph or bullet repeats the Chrome text word for word.
- AMO caches locale metadata: check the text before the first submission of a language.

## Edge search terms

Up to 7 terms, each up to 30 characters, at most 21 words in all; the description is 250 to 10,000 characters
([Partner Center limits](https://learn.microsoft.com/en-us/microsoft-edge/extensions/publish/publish-extension),
checked November 12, 2026; re-check before each submission). English terms follow measured search demand; the other languages are localised by intent and are not
measured yet.

## Checks

`test/store-listing.test.ts`:
- both files exist for every package language;
- descriptions are 250 (Edge minimum) to 10,000 characters;
- search terms are within the Edge limits;
- AMO text uses no `•` and no headings, and repeats no line of 40+ characters from the Chrome text;
- every `<lang>.md` has six screenshot captions, numbered in the gallery's order;
- no old domain (`qrcgen.com`).
