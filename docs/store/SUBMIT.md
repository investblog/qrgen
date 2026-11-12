---
type: runbook
status: active
tags: [store, release, runbook]
project: qrgen
---

# Submitting to the stores

| Store | Item | Package | Listing (texts, images, privacy) |
|---|---|---|---|
| Chrome Web Store | `jmajfmmdjbnmcjmkfffblmolhleklglg` | automatic on a `v*` tag | by hand in the dashboard |
| Edge Add-ons | `hibgblidmmohfjfompehcajiefijcnjg` | automatic on a `v*` tag | by hand in Partner Center |
| Firefox Add-ons | slug `qrcgen-qr-code-generator` (kept from the old name) | by hand: Actions → *Submit to stores* → `stores=firefox` | by hand in the AMO dashboard |

Opera has no listing (the Opera add-ons store no longer accepts extensions).

## What is automated and what is not

- **Packages are automated.** `.github/workflows/submit.yml` calls the shared workflow
  `investblog/geo-tier-builder/.github/workflows/store-submit.yml@main` (`wxt submit`). A `v*` tag uploads Chrome and
  Edge and submits them for review. Firefox never runs on a tag: AMO burns a version number on every upload, so it is a
  manual dispatch. Credentials are this repository's GitHub Actions secrets (`CHROME_*`, `EDGE_*`, `FIREFOX_*`).
- **Listings are manual.** The Chrome Web Store and Edge Add-ons APIs upload and publish packages only; descriptions,
  images and privacy answers exist only in the dashboards. AMO's API can edit a listing, but nothing here uses it: the
  texts change rarely, and AMO caches locale metadata, so a person checks them once by eye.
- **Name and summary** come from the package (`EXTENSION_NAME`, `EXTENSION_DESCRIPTION` in `src/public/_locales/`):
  every store takes them from the uploaded version.

## Where each field comes from

| Field | Source |
|---|---|
| Description, Chrome and Edge | `docs/store/<lang>.md`, section *Description*, pasted as is |
| Search terms, Edge | `docs/store/<lang>.md`, section *Search terms (Edge)*, one term per field |
| Description, AMO | `docs/store/amo/<lang>.md`, section *Description* |
| Small promo tile 440×280, Chrome | `store-assets/out/small-440x280-en.jpg` (Chrome tiles are one for all languages) |
| Marquee 1400×560, Chrome | `store-assets/out/marquee-1400x560-en.jpg` |
| Small / large promo tile, Edge | `store-assets/out/small-440x280-<en,ru>.png`, `marquee-1400x560-<en,ru>.png`: Edge sets them per language (`-ru` for Russian, `-en` for the rest) and wants the large tile as PNG |
| Screenshots 1280×800, all three | `store-assets/out/screenshots/<chrome,edge,firefox>/<en,ru>/01…06-*.png`, in that order; alt texts in `captions.md` next to them. Each store has its own set (the panel footer shows that store's rating link); `ru` for Russian, `en` for the rest |
| Privacy policy URL | `https://clx.cx/qr-code-privacy` |
| Homepage | `https://clx.cx/qr-code-extension` |
| Support | `https://github.com/investblog/qrgen/issues` |

The promo images (not the screenshots) are built by `python store-assets/build.py` (Chrome headless + Pillow; text in its `COPY` table) from the
SVG sources in `store-assets/src/`: JPEG at quality 92 without chroma subsampling, and 24-bit PNG. Do not
palette-compress the PNGs. `hero-1280x800-*` is the README banner (`assets/banner-1280x800.png`), not a store
screenshot: store screenshots show the actual panel.

### Privacy answers (Chrome privacy tab, Edge, AMO reviewer notes)

- **Single purpose:** Make QR codes for the current page or any text in the browser side panel, and copy share links
  or embed snippets for them.
- **`sidePanel`:** shows the extension's interface in the side panel, opened from the toolbar button.
- **`storage`:** keeps settings and the history of codes whose share link was copied, locally in
  `browser.storage.local`; nothing is synced or sent.
- **`tabs`:** reads the address of the active tab (`tabs.query`) when the panel opens or the user presses refresh, to
  make its code; the panel stays open across tab switches, so a one-time grant would not do.
- **Remote code:** none. **Data collection:** none; the extension itself makes no network requests (`PRIVACY.md`).
  Firefox declares `data_collection_permissions: none` in the manifest.

Since 1.1.0 there is no host permission (1.0.x had `https://qr.qrcgen.com/*`) and no `activeTab` (it was unused next
to `tabs`); drop their old justifications if the dashboard still shows them.

## A release that changes the listing (new languages, new texts or images)

Chrome offers a listing language only after a package containing that `_locales` directory has been uploaded, so the
order is: upload as a draft, fill the listing, then submit.

1. `npm run check`; build and try the extension in Chrome, Edge and Firefox.
2. Turn on hold: `gh variable set SUBMIT_HOLD --body true`.
3. Set the version in `wxt.config.ts`, commit and push it (a tag holds committed `HEAD`, not the working tree), then
   `git tag vX.Y.Z && git push origin vX.Y.Z`. `release.yml` makes the GitHub release; `submit.yml` uploads Chrome
   and Edge as drafts and submits nothing. Check both jobs in Actions.
4. **Chrome Web Store** dashboard → the item → *Store listing*: the tile and marquee once; for every language the
   description and screenshots. *Privacy*: single purpose, permissions, remote code, data use, privacy policy URL.
   Then *Submit for review*.
5. **Edge Partner Center** → the product → *Properties* (privacy policy, website, support) and *Store listings* for
   every language: description, search terms, tiles (PNG), screenshots. Then *Publish*.
6. Turn hold off: `gh variable delete SUBMIT_HOLD`.
7. **Firefox**, last: Actions → *Submit to stores* → tag `vX.Y.Z`, `stores=firefox`, first with `dry_run` on (checks
   the credentials), then off. Then in the AMO dashboard, for every language: the description from
   `docs/store/amo/<lang>.md`, screenshots, homepage, support and privacy policy.

## A release that does not change the listing

Set the version, commit and push, then tag and push the tag: Chrome and Edge go to review on their own (`SUBMIT_HOLD`
must not be set; it applies to tag pushes only, a manual run follows its own `hold` input). Firefox — step 7 above,
without the listing part.

## Before each submission

- The Edge limits in `README.md` still match Microsoft's page; `npm run check` covers the texts against them.
- The texts still describe what the extension does (README *Text rules*); a new feature or a removed one means editing
  all seven languages, and both the Chrome and the AMO text.
- The screenshots show the current interface. They are shot from the real build (`npm run build && npm run build:edge`)
  in Chromium: six slides per store and language, 24-bit PNG without alpha. Chromium does not load the Firefox (MV2)
  build, so the Firefox set is the Chrome build with the footer's rating link switched to what the Firefox build shows
  there; the rest of the panel is the same page. A UI change that shows on them means a new set.
