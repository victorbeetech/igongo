"""Logo files, the repeating pattern and the overview sheet."""

from __future__ import annotations

from PIL import Image

from brand_kit import BRAND, COLOURWAY, COLOURWAYS, CREAM, NIGHT, RED, WHITE, Colourway, svg_doc, write_png, write_svg
from canvas import logo_at, render
from lockups import LOCKUPS

# PNG widths made for every logo file.
LOGO_WIDTHS = [256, 512, 1024, 2048]


def build_logos() -> None:
    """Every lockup in every colourway, as SVG and as PNG in four widths."""
    for lockup, build in LOCKUPS.items():
        for cw in COLOURWAYS:
            body, w, h = build(cw)
            doc = svg_doc(body, w, h, title=f"Igongo {lockup} logo, {cw.name}")
            folder = BRAND / "logo" / lockup
            stem = f"igongo-{lockup}-{cw.name}"
            write_svg(folder / f"{stem}.svg", doc)
            for width in LOGO_WIDTHS:
                write_png(folder / "png" / f"{stem}-{width}w.png", doc, width)


def build_patterns() -> None:
    """A repeating spiral pattern for backgrounds, cards and packaging."""
    out = BRAND / "pattern"
    for name, fg, bg, alpha in (("on-cream", RED, CREAM, 0.10), ("on-red", WHITE, RED, 0.12),
                                ("on-night", RED, NIGHT, 0.22)):
        cw = Colourway(name, fg, fg, fg, fg, "")
        sp1, _ = logo_at("spiral", cw, 10, 10, 60)
        sp2, _ = logo_at("spiral", cw, 90, 90, 60)
        tile = svg_doc(f'<rect width="160" height="160" fill="{bg}"/><g opacity="{alpha}">{sp1}{sp2}</g>', 160, 160)
        write_svg(out / f"igongo-pattern-spiral-{name}.svg", tile)
        # A large rendered swatch made from the repeating tile.
        tile_img = render(tile, 320)
        swatch = Image.new("RGBA", (1280, 1280))
        for x in range(0, 1280, 320):
            for y in range(0, 1280, 320):
                swatch.paste(tile_img, (x, y))
        swatch.save(out / f"igongo-pattern-spiral-{name}-1280.png")


def build_preview() -> None:
    """One image showing the main logos and icons, for the brand guide."""
    out = BRAND / "preview"
    cells = []
    for lockup in ("stacked", "horizontal", "mark", "spiral"):
        for cw, bg in ((COLOURWAY["color"], "#FFFFFF"), (COLOURWAY["reversed"], NIGHT),
                       (COLOURWAY["white"], RED), (COLOURWAY["black"], CREAM)):
            body, w, h = LOCKUPS[lockup](cw)
            k = min(360 / w, 260 / h)
            cells.append(svg_doc(f'<rect width="400" height="300" fill="{bg}"/>'
                                 f'<g transform="translate({(400 - w * k) / 2},{(300 - h * k) / 2}) scale({k})">{body}</g>',
                                 400, 300))
    sheet = Image.new("RGB", (1600, 1200), "white")
    for i, doc in enumerate(cells):
        sheet.paste(render(doc, 400).convert("RGB"), ((i % 4) * 400, (i // 4) * 300))
    out.mkdir(parents=True, exist_ok=True)
    sheet.save(out / "brand-overview.png")
