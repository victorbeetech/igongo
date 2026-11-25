"""Shared building blocks for the Igongo brand build.

Holds the brand colours and colourways, loads the master mark, turns text
into vector outlines with the brand fonts, and writes SVG and PNG files.
`build_brand.py` uses these to make every asset, so each rule lives in one
place only.
"""

from __future__ import annotations

import re
from dataclasses import dataclass
from functools import cache, lru_cache
from html import escape
from pathlib import Path

import cairosvg
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------

BRAND = Path(__file__).resolve().parents[1]
FONTS = BRAND / "fonts"
MASTER = BRAND / "source" / "igongo-mark.svg"

# ---------------------------------------------------------------------------
# Colours, sampled from the hotel's original logo files
# ---------------------------------------------------------------------------

RED = "#B8292F"        # Igongo red: the spiral and the IGONGO name.
RED_DEEP = "#8F292A"   # Deep red: pressed states and dark accents.
INK = "#000000"        # Black: horns, cup and the subtitle.
CREAM = "#F6F1EC"      # Cream: the reversed logo and light backgrounds.
WHITE = "#FFFFFF"
NIGHT = "#1A1210"      # Dark background for dark mode.

# The point the spiral turns around, in master coordinates (found by testing
# which centre makes the spinning spiral wobble least). Used by the
# animations so the spiral spins on its own centre.
SPIRAL_POLE = (99.0, 58.5)

# Master mark size (the viewBox of source/igongo-mark.svg).
MARK_W, MARK_H = 200.0, 235.0


@dataclass(frozen=True)
class Colourway:
    """The fill of each part of the logo for one colour version."""

    name: str
    spiral: str     # The spiral.
    ink: str        # Horns, cup and divider.
    name_text: str  # The IGONGO name.
    sub_text: str   # COUNTRY HOTEL & CULTURAL CENTRE.
    use: str        # When to use this version (for the brand guide).


COLOURWAYS = [
    Colourway("color", RED, INK, RED, INK, "Full colour, on white or cream backgrounds."),
    Colourway("reversed", RED, CREAM, RED, CREAM, "On dark backgrounds and photos."),
    Colourway("black", INK, INK, INK, INK, "One-colour print, receipts, stamps, fax."),
    Colourway("white", WHITE, WHITE, WHITE, WHITE, "On Igongo red or any strong colour."),
    Colourway("red", RED, RED, RED, RED, "One-colour print in red, merchandise, embossing."),
]
COLOURWAY = {c.name: c for c in COLOURWAYS}


# ---------------------------------------------------------------------------
# Master mark
# ---------------------------------------------------------------------------

@lru_cache(maxsize=1)
def mark_parts() -> dict[str, str]:
    """Return the path data of each named part of the master mark."""
    svg = MASTER.read_text()
    return dict(re.findall(r'<path id="([^"]+)" d="([^"]+)"', svg))


def mark(cw: Colourway, x: float = 0, y: float = 0, height: float = MARK_H,
         part_transforms: dict[str, str] | None = None,
         part_opacity: dict[str, float] | None = None) -> str:
    """Return SVG for the mark at (x, y), scaled to `height`.

    `part_transforms` and `part_opacity` let animations move or fade single
    parts (spiral, horn-left, horn-right, cup) in master coordinates.
    """
    k = height / MARK_H
    part_transforms = part_transforms or {}
    part_opacity = part_opacity or {}
    fills = {"spiral": cw.spiral, "horn-left": cw.ink, "horn-right": cw.ink, "cup": cw.ink}
    out = []
    for part, d in mark_parts().items():
        attrs = f'fill="{fills[part]}"'
        if part in part_transforms:
            attrs += f' transform="{part_transforms[part]}"'
        if part in part_opacity:
            attrs += f' opacity="{part_opacity[part]:.3f}"'
        out.append(f'<path id="{part}" {attrs} d="{d}"/>')
    return f'<g transform="translate({x:.2f},{y:.2f}) scale({k:.5f})">{"".join(out)}</g>'


# ---------------------------------------------------------------------------
# Text as outlines
# ---------------------------------------------------------------------------

class Typeface:
    """A brand font that turns text into SVG outlines, so no font is needed
    wherever the logo is used."""

    def __init__(self, file: str, weight: int | None = None):
        font = TTFont(FONTS / file)
        # Variable fonts (Cinzel) are pinned to the weight the logo uses.
        if weight and "fvar" in font:
            font = instancer.instantiateVariableFont(font, {"wght": weight})
        self.glyphs = font.getGlyphSet()
        self.cmap = font.getBestCmap()
        self.advance = font["hmtx"]
        self.upm = font["head"].unitsPerEm

    def letters(self, text: str, size: float, tracking: float = 0.0) -> list[tuple[str, tuple | None]]:
        """Return (path data, ink bounds) for each letter of `text` at `size`,
        already placed along the line, with the baseline at y = 0.

        `tracking` is extra letter spacing, as a fraction of the size. Spaces
        give empty path data and no bounds.
        """
        scale = size / self.upm
        out, cursor = [], 0.0
        for i, ch in enumerate(text):
            name = self.cmap[ord(ch)]
            path_pen, bounds_pen = SVGPathPen(self.glyphs), BoundsPen(self.glyphs)
            # Flip y, because fonts draw upwards and SVG draws downwards.
            matrix = (scale, 0, 0, -scale, cursor, 0)
            self.glyphs[name].draw(TransformPen(path_pen, matrix))
            self.glyphs[name].draw(TransformPen(bounds_pen, matrix))
            out.append((path_pen.getCommands(), bounds_pen.bounds))
            cursor += self.advance[name][0] * scale
            if i < len(text) - 1:
                cursor += tracking * size
        return out

    def outline(self, text: str, size: float, tracking: float = 0.0) -> tuple[str, tuple]:
        """Return (path data, ink bounds) for the whole of `text`."""
        letters = self.letters(text, size, tracking)
        boxes = [b for _, b in letters if b]
        bounds = (min(b[0] for b in boxes), min(b[1] for b in boxes),
                  max(b[2] for b in boxes), max(b[3] for b in boxes))
        return "".join(d for d, _ in letters), bounds


@cache
def typeface(file: str, weight: int | None = None) -> Typeface:
    """Load each typeface once."""
    return Typeface(file, weight)


def name_face() -> Typeface:
    """Cinzel Bold, the face of the IGONGO name."""
    return typeface("Cinzel-Variable.ttf", 700)


def sub_face() -> Typeface:
    """Lato Bold, the face of the subtitle."""
    return typeface("Lato-Bold.ttf")


def text_block(face: Typeface, text: str, width: float, fill: str, x: float, top: float,
               tracking: float = 0.0, align: str = "center", box: float | None = None,
               key: str | None = None, attrs: dict | None = None,
               centres: dict | None = None) -> tuple[str, float]:
    """Set `text` so its ink is exactly `width` wide, with its top at `top`.

    `align` positions the ink inside a box of width `box` starting at `x`
    (box defaults to `width`). Returns (svg, ink height).

    For animation, pass `key`: each letter is then drawn in its own group
    named `<key>-<n>`, with extra attributes from `attrs`, and the centre of
    each letter (in canvas units) is written into `centres`.
    """
    d, (x0, y0, x1, y1) = face.outline(text, 100, tracking)
    k = width / (x1 - x0)
    box = box or width
    left = x + {"center": (box - width) / 2, "left": 0, "right": box - width}[align]
    tx, ty = left - x0 * k, top - y0 * k
    place = f'transform="translate({tx:.2f},{ty:.2f}) scale({k:.5f})"'
    if key is None:
        return f'<path fill="{fill}" {place} d="{d}"/>', (y1 - y0) * k

    # One group per letter, so each can move on its own.
    svg = []
    for n, (letter_d, bounds) in enumerate(face.letters(text, 100, tracking)):
        if not bounds:
            continue  # A space.
        name = f"{key}-{n}"
        if centres is not None:
            centres[name] = (tx + (bounds[0] + bounds[2]) / 2 * k, ty + (bounds[1] + bounds[3]) / 2 * k)
        extra = (attrs or {}).get(name, "")
        svg.append(f'<g {extra}><path fill="{fill}" {place} d="{letter_d}"/></g>')
    return "".join(svg), (y1 - y0) * k


def text_at_size(face: Typeface, text: str, size: float, tracking: float = 0.0) -> float:
    """Return the ink width of `text` at `size`."""
    _, (x0, _, x1, _) = face.outline(text, size, tracking)
    return x1 - x0


# ---------------------------------------------------------------------------
# Writing files
# ---------------------------------------------------------------------------

def svg_doc(body: str, w: float, h: float, background: str | None = None,
            title: str = "Igongo", extra_head: str = "") -> str:
    """Wrap SVG body content in a complete, titled document."""
    bg = f'<rect width="{w:g}" height="{h:g}" fill="{background}"/>' if background else ""
    title = escape(title)  # Titles such as "Hotel & Centre" must be valid XML.
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w:g} {h:g}" '
            f'width="{w:g}" height="{h:g}" role="img" aria-label="{title}">'
            f"<title>{title}</title>{extra_head}{bg}{body}</svg>\n")


def write_svg(path: Path, doc: str) -> None:
    """Write an SVG file, creating folders as needed."""
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(doc)


def write_png(path: Path, doc: str, width: int, height: int | None = None) -> None:
    """Render an SVG document to a PNG of the given pixel size."""
    path.parent.mkdir(parents=True, exist_ok=True)
    cairosvg.svg2png(bytestring=doc.encode(), write_to=str(path),
                     output_width=width, output_height=height)
