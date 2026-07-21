#!/usr/bin/env python3
"""Verify referenced static assets exist."""

from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PATTERN = re.compile(r'''(?:href|src)=["']((?:/[^"']+)|(?:[^/"'][^"']*))["']''')

SKIP_PREFIXES = ("http://", "https://", "//", "#", "mailto:", "tel:")
SKIP_EXACT = {"", "#"}


def local_paths_from_file(path: Path) -> set[str]:
    text = path.read_text(encoding="utf-8")
    refs: set[str] = set()
    for match in PATTERN.finditer(text):
        ref = match.group(1)
        if ref in SKIP_EXACT or ref.startswith(SKIP_PREFIXES):
            continue
        if ref.startswith("/"):
            refs.add(ref.lstrip("/"))
        elif path.parent == ROOT:
            refs.add(ref)
        else:
            refs.add(str((path.parent / ref).relative_to(ROOT)).replace("\\", "/"))
    return refs


def main() -> int:
    html_files = list(ROOT.glob("*.html")) + list(ROOT.glob("*/*.html"))
    manifest = ROOT / "site.webmanifest"
    if manifest.exists():
        html_files.append(manifest)

    missing: list[tuple[str, str]] = []
    for file in html_files:
        for ref in sorted(local_paths_from_file(file)):
            if ref.endswith((".css", ".js", ".png", ".jpg", ".jpeg", ".ico", ".webmanifest", ".xml", ".txt")):
                target = ROOT / ref
                if not target.is_file():
                    missing.append((str(file.relative_to(ROOT)), ref))

    if missing:
        print("Missing assets:")
        for file, ref in missing:
            print(f"  {file}: {ref}")
        return 1

    print(f"OK - checked {len(html_files)} files, all asset references resolve.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
