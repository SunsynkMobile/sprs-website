#!/usr/bin/env python3
"""Update asset paths after reorganising into /assets/."""

from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

# Normalise any accidental repeated /assets/images/ segments first.
REPEAT_ASSETS = re.compile(r"(?:/assets/images/)+")

REPLACEMENTS = [
    ("https://sunsynkreports.com/og-image.jpg", "https://sunsynkreports.com/assets/images/og-image.jpg"),
    ("https://sunsynkreports.com/twitter-image.jpg", "https://sunsynkreports.com/assets/images/twitter-image.jpg"),
    ("https://sunsynkreports.com/sunsynk-logo.png", "https://sunsynkreports.com/assets/images/sunsynk-logo.png"),
    ('href="/styles.css"', 'href="/assets/css/styles.css"'),
    ('href="styles.css"', 'href="/assets/css/styles.css"'),
    ('href="/doc-pages.css"', 'href="/assets/css/doc-pages.css"'),
    ('src="/script.js"', 'src="/assets/js/script.js"'),
    ('src="script.js"', 'src="/assets/js/script.js"'),
    ('src="/cookie-consent.js"', 'src="/assets/js/cookie-consent.js"'),
    ('src="cookie-consent.js"', 'src="/assets/js/cookie-consent.js"'),
    ('src="/doc-pages.js"', 'src="/assets/js/doc-pages.js"'),
    ('src="/sunsynk-logo.png"', 'src="/assets/images/sunsynk-logo.png"'),
    ('src="sunsynk-logo.png"', 'src="/assets/images/sunsynk-logo.png"'),
    ('href="/favicon.ico"', 'href="/assets/images/favicon.ico"'),
    ('href="/apple-touch-icon.png"', 'href="/assets/images/apple-touch-icon.png"'),
    ('"src": "/favicon.ico"', '"src": "/assets/images/favicon.ico"'),
    ('"src": "/apple-touch-icon.png"', '"src": "/assets/images/apple-touch-icon.png"'),
    ('"src": "/sunsynk-logo.png"', '"src": "/assets/images/sunsynk-logo.png"'),
]

TARGETS = [
    ROOT / "index.html",
    *ROOT.glob("*/*.html"),
    ROOT / "site.webmanifest",
    ROOT / "README.md",
]


def normalise(text: str) -> str:
    return REPEAT_ASSETS.sub("/assets/images/", text)


def main() -> None:
    changed = 0
    for path in TARGETS:
        if not path.is_file():
            continue
        text = normalise(path.read_text(encoding="utf-8"))
        original = text
        for old, new in REPLACEMENTS:
            if old in text and old != new:
                text = text.replace(old, new)
        text = normalise(text)
        if text != original:
            path.write_text(text, encoding="utf-8")
            print(f"updated {path.relative_to(ROOT)}")
            changed += 1
    print(f"Done. {changed} file(s) updated.")


if __name__ == "__main__":
    main()
