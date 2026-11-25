"""Uniformity check: the same logo, colours and type everywhere.

Scans the app (apps/igongo/lib) and the web (apps/web/src) for anything that
skips the single theme: a hard-coded colour, font size or font name, or a logo
file that does not come from the brand kit. Every colour and size must be a
named token from packages/design-tokens, and every logo must come from
packages/brand. Run from the repository root:

    python3 tools/brand-check/check_uniformity.py .

Exits with an error, listing each line, if anything is found.
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

# Step 1: where to look, and the files allowed to hold raw values (the theme itself and generated files).
FOLDERS = ["apps/igongo/lib", "apps/web/src"]
SUFFIXES = {".dart", ".ts", ".tsx", ".css"}
ALLOWED = [
    "apps/igongo/lib/shared/theme/",  # Builds the theme from the tokens.
    "apps/web/src/app/globals.css",  # Maps the token variables to Tailwind names and loads the brand fonts.
    ".g.dart",
    ".g.ts",  # Generated from the tokens, the inventory or the brand kit.
]

# Step 2: what counts as skipping the theme. Comments are ignored.
RULES = [
    ("hard-coded colour", re.compile(
        r"(Color\(0x[0-9A-Fa-f]{8}\)|Colors\.(?!transparent)\w+|['\"`]#[0-9A-Fa-f]{3,8}\b|\[#[0-9A-Fa-f]{3,8}\]|rgba?\()")),
    ("hard-coded font size", re.compile(r"(fontSize:\s*\d|text-\[\d+(px|rem)\]|font-size:\s*\d)")),
    ("font not from the tokens", re.compile(r"(fontFamily:\s*['\"]|font-\[['\"]?[A-Z])")),
    # Logos must be the brand kit's files: /brand/... on the web (copied from the kit at build), BrandAssets in the app.
    ("logo not from the brand kit", re.compile(
        r"['\"`](?!/brand/|\./brand/)[^'\"`]*igongo-(mark|horizontal|stacked|spiral)[^'\"`]*\.(png|svg)['\"`]")),
]


def code_lines(text: str) -> list[tuple[int, str]]:
    """The file's lines with line comments removed, numbered from 1."""
    return [(i, re.sub(r"(^|\s)//.*$", "", line)) for i, line in enumerate(text.splitlines(), 1)]


def main(root: Path) -> int:
    """Scan every source file and print what skips the theme."""
    found = []
    for folder in FOLDERS:
        for path in sorted((root / folder).rglob("*")):
            rel = path.relative_to(root).as_posix()
            if path.suffix not in SUFFIXES or any(a in rel for a in ALLOWED):
                continue
            for number, line in code_lines(path.read_text(encoding="utf-8")):
                for name, pattern in RULES:
                    if pattern.search(line):
                        found.append(f"{rel}:{number}: {name}: {line.strip()[:120]}")
    print("\n".join(found) or "Uniform: every colour, size, font and logo comes from the tokens and the brand kit.")
    return 1 if found else 0


if __name__ == "__main__":
    sys.exit(main(Path(sys.argv[1] if len(sys.argv) > 1 else ".")))
