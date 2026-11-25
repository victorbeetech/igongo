"""State illustrations: empty, error, offline, success, denied and not found.

Small line drawings that the app and the web show above the message of each
screen state. They are drawn in `currentColor`, so the app and the web tint
them from the theme (muted text, or the error, warning or success colour) and
they work in light and dark mode. The only fixed colour is the Igongo spiral,
in Igongo red, which never changes with the theme (brand rule).

Each drawing is a 160 x 120 SVG in packages/brand/illustrations/. Run with the
whole kit (build_brand.py) or alone:

    python packages/brand/scripts/illustrations.py
"""

from __future__ import annotations

import re

from brand_kit import BRAND, RED, mark_parts, svg_doc, write_svg

W, H = 160, 120  # Every illustration's size: small, to sit above a message.

# Shared stroke style: rounded lines in the theme colour, and a soft fill of
# the same colour for the shapes, so one colour drives the whole drawing.
LINE = 'fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"'
FAINT = LINE + ' stroke-opacity="0.45"'      # Lesser lines: weave, ground.
BOLD = LINE.replace('width="3"', 'width="4"')  # The tick of success.
SOFT = 'fill="currentColor" fill-opacity="0.12"'


def spiral(cx: float, cy: float, size: float) -> str:
    """The Igongo spiral in Igongo red, centred on (cx, cy), `size` wide."""
    # Step 1: the spiral's own box, from the numbers in its master path.
    d = mark_parts()["spiral"]
    nums = [float(n) for n in re.findall(r"-?\d+(?:\.\d+)?", d)]
    xs, ys = nums[0::2], nums[1::2]
    x0, y0, w = min(xs), min(ys), max(xs) - min(xs)
    h = max(ys) - y0
    # Step 2: scale it to `size` and move its centre to (cx, cy).
    k = size / w
    return (f'<path fill="{RED}" transform="translate({cx - w * k / 2:.2f},{cy - h * k / 2:.2f}) '
            f'scale({k:.4f}) translate({-x0:.2f},{-y0:.2f})" d="{d}"/>')


def ground() -> str:
    """A short shadow line under each drawing, so they all sit the same way."""
    return f'<path {FAINT} d="M36 108 H124"/>'


# Step 3: the drawings. Each is a few shapes in the shared style plus the spiral.
DRAWINGS: dict[str, tuple[str, str]] = {
    # An empty woven basket (ekibbo), with the spiral floating above it.
    "empty": ("Nothing here yet", (
        f'<path {SOFT} d="M26 62 Q30 100 50 104 H110 Q130 100 134 62 Z"/>'
        f'<path {LINE} d="M26 62 Q30 100 50 104 H110 Q130 100 134 62"/>'
        f'<ellipse {LINE} cx="80" cy="62" rx="54" ry="10"/>'
        f'<path {FAINT} d="M40 78 Q80 88 120 78 M46 92 Q80 100 114 92"/>'
        + spiral(80, 30, 30))),
    # A cracked cup (the cup of the logo), for errors.
    "error": ("Something went wrong", (
        f'<path {SOFT} d="M50 44 H110 L102 102 H58 Z"/>'
        f'<path {LINE} d="M50 44 H110 L102 102 H58 Z"/>'
        f'<path {LINE} d="M108 56 Q128 58 124 74 Q121 86 104 86"/>'
        f'<path {LINE} d="M80 44 L74 60 L86 70 L78 86"/>'
        + spiral(42, 26, 18))),
    # A cloud with a line through it, for no connection.
    "offline": ("No connection", (
        f'<path {SOFT} d="M46 92 A18 18 0 0 1 48 56 A24 24 0 0 1 94 46 A20 20 0 0 1 116 92 Z"/>'
        f'<path {LINE} d="M46 92 A18 18 0 0 1 48 56 A24 24 0 0 1 94 46 A20 20 0 0 1 116 92 Z"/>'
        f'<path {LINE} d="M38 34 L124 104"/>'
        + spiral(124, 28, 18))),
    # A ticked circle with two small spirals, for success.
    "success": ("Done", (
        f'<circle {SOFT} cx="80" cy="62" r="36"/>'
        f'<circle {LINE} cx="80" cy="62" r="36"/>'
        f'<path {BOLD} d="M64 63 L76 75 L98 51"/>'
        + spiral(130, 30, 16) + spiral(32, 90, 12))),
    # A padlock whose keyhole is the spiral, for no permission.
    "denied": ("No access", (
        f'<path {LINE} d="M62 54 V42 A18 18 0 0 1 98 42 V54"/>'
        f'<rect {SOFT} x="50" y="54" width="60" height="48" rx="8"/>'
        f'<rect {LINE} x="50" y="54" width="60" height="48" rx="8"/>'
        + spiral(80, 78, 20))),
    # A map pin with the spiral inside, for a page that is not found.
    "not-found": ("Page not found", (
        f'<path {SOFT} d="M80 104 C62 80 52 66 52 50 A28 28 0 0 1 108 50 C108 66 98 80 80 104 Z"/>'
        f'<path {LINE} d="M80 104 C62 80 52 66 52 50 A28 28 0 0 1 108 50 C108 66 98 80 80 104 Z"/>'
        + spiral(80, 50, 24))),
}


def build_illustrations() -> None:
    """Write every state illustration to packages/brand/illustrations/."""
    for name, (title, body) in DRAWINGS.items():
        write_svg(BRAND / "illustrations" / f"{name}.svg", svg_doc(body + ground(), W, H, title=f"Igongo, {title}"))


if __name__ == "__main__":
    build_illustrations()
