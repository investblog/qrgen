"""Store promo images for SVG QR Code Generator: SVG sources -> PNG-24 + JPEG.

Usage (from the repo root):  python store-assets/build.py
Needs Google Chrome (headless render; override the path with CHROME) and Pillow.
Writes store-assets/src/*.svg and store-assets/out/*.{png,jpg}. Text lives in COPY below.
"""

import os
import subprocess
import sys
import tempfile
import time
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent
SRC, OUT = ROOT / "src", ROOT / "out"
CHROME = os.environ.get("CHROME", r"C:\Program Files\Google\Chrome\Application\chrome.exe")

SANS = "'Segoe UI Variable Display', 'Segoe UI', 'SF Pro Display', system-ui, sans-serif"
MONO = "'Cascadia Code', 'SF Mono', Consolas, monospace"

COPY = {
    "en": {
        "title": ["SVG QR Code", "Generator"],
        "tag": "Open a page on your phone with one scan",
        "tag_short": "A page to your phone in one scan",
        "sub": "Crisp SVG codes, share links and embed snippets in the side panel",
        "pills": ["Page → phone", "SVG download", "Share links", "Embed snippets", "No tracking", "7 languages"],
        "pills_small": [["SVG", "Share links"], ["No tracking"]],
    },
    "ru": {
        "title": ["SVG QR Code", "Generator"],
        "tag": "Откройте страницу на телефоне одним сканированием",
        "tag_short": "Страницу — на телефон за скан",
        "sub": "Чёткие SVG-коды, ссылки и сниппеты — в боковой панели",
        "pills": ["Страница → телефон", "Скачать SVG", "Ссылки", "Сниппеты", "Без трекинга", "7 языков"],
        "pills_small": [["SVG", "Ссылки"], ["Без трекинга"]],
    },
}

DEFS = """<defs>
  <radialGradient id="bg" cx="28%" cy="40%" r="75%"><stop offset="0%" stop-color="#181A1F"/><stop offset="100%" stop-color="#0D0E12"/></radialGradient>
  <linearGradient id="rim" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#3475C0"/><stop offset="50%" stop-color="#4DA3FF"/><stop offset="100%" stop-color="#56C8E6"/></linearGradient>
  <filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur in="SourceGraphic" stdDeviation="6" result="b"/><feColorMatrix in="b" type="matrix" values="0 0 0 0 0.204  0 0 0 0 0.459  0 0 0 0 0.753  0 0 0 0.35 0"/><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse"><rect x="0" y="0" width="9" height="9" rx="1.5" fill="#4DA3FF" opacity="0.03"/><rect x="13" y="13" width="9" height="9" rx="1.5" fill="#4DA3FF" opacity="0.018"/></pattern>
</defs>"""

# The extension icon: a 160x160 tile, placed with transform="translate(x,y) scale(s)".
ICON = """<rect x="10" y="10" width="140" height="140" rx="24" fill="#4DA3FF" opacity="0.06" filter="url(#glow)"/>
<rect width="160" height="160" rx="28" fill="url(#rim)"/>
<rect x="2" y="2" width="156" height="156" rx="26" fill="#111111"/>
<rect x="20" y="20" width="36" height="36" rx="4.5" fill="none" stroke="#4DA3FF" stroke-width="3.8"/><rect x="31" y="31" width="14" height="14" rx="2.5" fill="#4DA3FF"/>
<rect x="104" y="20" width="36" height="36" rx="4.5" fill="none" stroke="#4DA3FF" stroke-width="3.8"/><rect x="115" y="31" width="14" height="14" rx="2.5" fill="#4DA3FF"/>
<rect x="20" y="104" width="36" height="36" rx="4.5" fill="none" stroke="#4DA3FF" stroke-width="3.8"/><rect x="31" y="115" width="14" height="14" rx="2.5" fill="#4DA3FF"/>
<rect x="65" y="58" width="10" height="10" rx="1.5" fill="#4DA3FF" filter="url(#glow)"/><rect x="76" y="69" width="10" height="10" rx="1.5" fill="#4DA3FF" filter="url(#glow)"/><rect x="87" y="80" width="10" height="10" rx="1.5" fill="#4DA3FF" filter="url(#glow)"/>
<rect x="65" y="74" width="8" height="8" rx="1" fill="#3475C0" opacity="0.65"/><rect x="85" y="62" width="8" height="8" rx="1" fill="#3475C0" opacity="0.65"/><rect x="104" y="70" width="8" height="8" rx="1" fill="#3475C0" opacity="0.4"/>
<rect x="112" y="112" width="20" height="20" rx="3" fill="none" stroke="#4DA3FF" stroke-width="2.2" opacity="0.65"/><rect x="118" y="118" width="8" height="8" rx="1.5" fill="#4DA3FF" opacity="0.8"/>"""

# A phone (100x180) showing a page, with a scan beam towards the icon on its left.
PHONE = """<path d="M-8 52 L-58 20 M-8 70 L-58 70 M-8 88 L-58 120" stroke="#56C8E6" stroke-width="2" stroke-dasharray="4 6" opacity="0.55" fill="none"/>
<rect width="100" height="180" rx="16" fill="#0D0E12" stroke="#56C8E6" stroke-width="3"/>
<rect x="38" y="9" width="24" height="4" rx="2" fill="#56C8E6" opacity="0.6"/>
<rect x="12" y="26" width="76" height="10" rx="3" fill="#4DA3FF" opacity="0.85"/>
<rect x="12" y="46" width="76" height="40" rx="5" fill="#3475C0" opacity="0.35"/>
<rect x="12" y="96" width="70" height="6" rx="3" fill="#A0A4AF" opacity="0.45"/><rect x="12" y="110" width="76" height="6" rx="3" fill="#A0A4AF" opacity="0.45"/>
<rect x="12" y="124" width="58" height="6" rx="3" fill="#A0A4AF" opacity="0.45"/><rect x="12" y="138" width="72" height="6" rx="3" fill="#A0A4AF" opacity="0.45"/>"""


def esc(s: str) -> str:
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def text(x, y, s, size, weight=400, fill="#E7E9EE", family=SANS, anchor="start", ls=0):
    return (f'<text x="{x}" y="{y}" font-family="{family}" font-size="{size}" font-weight="{weight}" fill="{fill}" '
            f'text-anchor="{anchor}" letter-spacing="{ls}">{esc(s)}</text>')


def pills(x, y, labels, size, h, gap):
    out, cx = [], x
    for label in labels:
        w = round(len(label) * size * 0.6 + size * 2)
        out.append(f'<rect x="{cx}" y="{y}" width="{w}" height="{h}" rx="{h / 2}" fill="#1F2229" stroke="#3475C0" stroke-width="1"/>')
        out.append(text(cx + w / 2, y + h / 2 + size * 0.36, label, size, 600, "#4DA3FF", MONO, "middle"))
        cx += w + gap
    return "".join(out)


def frame(w, h, body):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}">{DEFS}'
            f'<rect width="{w}" height="{h}" fill="url(#bg)"/><rect width="{w}" height="{h}" fill="url(#grid)"/>{body}</svg>')


def small(c):  # 440x280 small promo tile (Chrome Web Store, Edge)
    b = [f'<g transform="translate(26,62) scale(1)">{ICON}</g>',
         text(206, 96, c["title"][0], 29, 700, ls=-0.4), text(206, 129, c["title"][1], 29, 700, ls=-0.4),
         text(206, 155, c["tag_short"], 13, 400, "#4DA3FF"),
         pills(206, 170, c["pills_small"][0], 10.5, 24, 8), pills(206, 201, c["pills_small"][1], 10.5, 24, 8),
         text(206, 254, "clx.cx", 11, 400, "#7A7E87", MONO, ls=0.5), text(262, 254, "by 301.st", 10.5, 400, "#555860", ls=1)]
    return frame(440, 280, "".join(b))


def marquee(c):  # 1400x560 marquee promo tile (Chrome Web Store, Edge)
    b = [f'<g transform="translate(70,120) scale(1.8)">{ICON}</g>',
         f'<g transform="translate(400,250)">{PHONE}</g>',
         text(580, 205, " ".join(c["title"]), 66, 700, ls=-1),
         text(582, 265, c["tag"], 30, 500, "#4DA3FF"),
         text(582, 312, c["sub"], 22, 400, "#A0A4AF"),
         pills(582, 352, c["pills"][:4], 17, 42, 12),
         text(1350, 500, "clx.cx", 17, 400, "#7A7E87", MONO, "end", 0.5),
         text(1350, 526, "by 301.st", 14, 400, "#555860", anchor="end", ls=2)]
    return frame(1400, 560, "".join(b))


def hero(c):  # 1280x800: README banner (not a store screenshot: those show the real panel)
    b = [f'<g transform="translate(90,230) scale(1.75)">{ICON}</g>',
         f'<g transform="translate(410,360)">{PHONE}</g>',
         text(600, 285, c["title"][0], 72, 700, ls=-1), text(600, 362, c["title"][1], 72, 700, ls=-1),
         text(602, 418, c["tag"], 25, 500, "#4DA3FF"),
         text(602, 456, c["sub"], 18, 400, "#A0A4AF"),
         pills(602, 492, c["pills"][:3], 15, 40, 12), pills(602, 544, c["pills"][3:], 15, 40, 12),
         text(640, 715, "clx.cx", 16, 400, "#7A7E87", MONO, "middle", 0.5),
         text(640, 741, "by 301.st", 13, 400, "#555860", anchor="middle", ls=2)]
    return frame(1280, 800, "".join(b))


SIZES = {"small-440x280": (440, 280, small), "marquee-1400x560": (1400, 560, marquee), "hero-1280x800": (1280, 800, hero)}


def render(svg: Path, w: int, h: int, png: Path):
    png.unlink(missing_ok=True)
    with tempfile.TemporaryDirectory(ignore_cleanup_errors=True) as profile:
        subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=1",
                        f"--user-data-dir={profile}", f"--window-size={w},{h}", f"--screenshot={png}", svg.as_uri()],
                       check=True, capture_output=True)
        # On Windows chrome.exe may return before the screenshot is written: wait for a stable file.
        last = -1
        for _ in range(100):
            time.sleep(0.2)
            size = png.stat().st_size if png.exists() else -1
            if size > 0 and size == last:
                return
            last = size
    sys.exit(f"{png.name}: Chrome wrote no screenshot")


def main():
    SRC.mkdir(exist_ok=True)
    OUT.mkdir(exist_ok=True)
    for lang, c in COPY.items():
        for name, (w, h, draw) in SIZES.items():
            svg = SRC / f"{name}-{lang}.svg"
            svg.write_text(draw(c), encoding="utf-8")
            raw = OUT / f"{name}-{lang}.raw.png"
            render(svg, w, h, raw)
            img = Image.open(raw).convert("RGB")
            if img.size != (w, h):
                sys.exit(f"{raw.name}: got {img.size}, want {(w, h)}")
            img.save(OUT / f"{name}-{lang}.png", optimize=True)
            img.save(OUT / f"{name}-{lang}.jpg", quality=92, subsampling=0, progressive=True, optimize=True)
            raw.unlink()
            print(f"{name}-{lang}: ok")


if __name__ == "__main__":
    main()
