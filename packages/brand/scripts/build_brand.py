"""Build every Igongo brand asset from the master mark and the brand fonts.

Run from the repository root:

    pip install -r packages/brand/scripts/requirements.txt
    python packages/brand/scripts/build_brand.py

ffmpeg must be installed for the GIF and video files.

Everything in the output folders below is generated. Never edit those files
by hand: change the master, the fonts or these scripts, then build again.
Each builder lives in its own file; this one only runs them in order.
"""

from __future__ import annotations

import shutil

from animations import build_animations
from app_assets import build_app_icons, build_splash
from brand_kit import BRAND
from cards import build_cards
from logos import build_logos, build_patterns, build_preview
from social import build_social
from stationery import build_print
from web_assets import build_store, build_web

# Generated folders, emptied before each build so no stale file survives.
OUTPUTS = ["logo", "app-icon", "splash", "web", "store", "social", "print", "cards",
           "pattern", "animation", "preview"]

# Every builder, in the order the brand guide lists their output.
STEPS = [build_logos, build_app_icons, build_splash, build_web, build_store, build_social,
         build_print, build_cards, build_patterns, build_animations, build_preview]


def main() -> None:
    """Empty the generated folders and build everything again."""
    for name in OUTPUTS:
        shutil.rmtree(BRAND / name, ignore_errors=True)
    for step in STEPS:
        print(f"Building {step.__name__.removeprefix('build_')}...")
        step()
    print("Done.")


if __name__ == "__main__":
    main()
