"""Website icons, the web manifest, the share image and store graphics."""

from __future__ import annotations

import json

from brand_kit import BRAND, COLOURWAY, CREAM, INK, MARK_H, MARK_W, RED, mark, svg_doc, write_png, write_svg
from canvas import centred_mark, render, save_opaque
from lockups import LOCKUPS


def build_web() -> None:
    """Favicons, touch icons, PWA icons, the web manifest and the share image."""
    out = BRAND / "web"
    color = COLOURWAY["color"]

    # SVG favicon that switches the horns and cup to cream in dark mode.
    body = mark(color, 0, 0, MARK_H).replace(f'fill="{INK}"', 'class="ink"')
    style = (f"<style>.ink{{fill:{INK}}}@media (prefers-color-scheme:dark){{.ink{{fill:{CREAM}}}}}</style>")
    write_svg(out / "favicon.svg", svg_doc(f'<g transform="translate({(MARK_H - MARK_W) / 2},0)">{body}</g>',
                                           MARK_H, MARK_H, extra_head=style))

    # PNG favicons and the multi-size .ico.
    icon = centred_mark(color, 64, 0.94)
    sizes = {16: None, 32: None, 48: None}
    for px in sizes:
        sizes[px] = render(icon, px)
        if px != 48:
            sizes[px].save(out / f"favicon-{px}x{px}.png")
    sizes[48].save(out / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])

    # Touch and PWA icons.
    save_opaque(render(centred_mark(color, 180, 0.72, CREAM), 180), out / "apple-touch-icon.png", CREAM)
    for px in (192, 512):
        write_png(out / f"icon-{px}.png", centred_mark(color, 512, 0.80), px)
    write_png(out / "icon-maskable-512.png", centred_mark(color, 512, 0.56, CREAM), 512)

    manifest = {
        "name": "Igongo Country Hotel & Cultural Centre",
        "short_name": "Igongo",
        "icons": [
            {"src": "/icon-192.png", "sizes": "192x192", "type": "image/png"},
            {"src": "/icon-512.png", "sizes": "512x512", "type": "image/png"},
            {"src": "/icon-maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable"},
        ],
        "theme_color": RED,
        "background_color": CREAM,
        "display": "standalone",
    }
    (out / "site.webmanifest").write_text(json.dumps(manifest, indent=2) + "\n")

    # Social share image (Open Graph and X): 1200 x 630.
    body, w, h = LOCKUPS["horizontal"](color)
    k = 900 / w
    og = svg_doc(f'<rect width="1200" height="630" fill="{CREAM}"/>'
                 f'<rect y="610" width="1200" height="20" fill="{RED}"/>'
                 f'<g transform="translate({(1200 - 900) / 2},{(610 - h * k) / 2}) scale({k})">{body}</g>',
                 1200, 630, title="Igongo Country Hotel & Cultural Centre")
    write_png(out / "og-image.png", og, 1200)

    # The tags to paste into the website's <head>.
    (out / "head-tags.html").write_text(
        '<!-- Igongo brand: paste into <head>. Files are served from the site root. -->\n'
        '<link rel="icon" href="/favicon.ico" sizes="48x48">\n'
        '<link rel="icon" href="/favicon.svg" type="image/svg+xml">\n'
        '<link rel="apple-touch-icon" href="/apple-touch-icon.png">\n'
        '<link rel="manifest" href="/site.webmanifest">\n'
        f'<meta name="theme-color" content="{RED}">\n'
        '<meta property="og:image" content="/og-image.png">\n'
        '<meta property="og:image:width" content="1200">\n'
        '<meta property="og:image:height" content="630">\n'
        '<meta name="twitter:card" content="summary_large_image">\n')


def build_store() -> None:
    """The Play Store feature graphic: the white logo on Igongo red."""
    body, w, h = LOCKUPS["horizontal"](COLOURWAY["white"])
    k = 760 / w
    doc = svg_doc(f'<rect width="1024" height="500" fill="{RED}"/>'
                  f'<g transform="translate({(1024 - 760) / 2},{(500 - h * k) / 2}) scale({k})">{body}</g>',
                  1024, 500)
    save_opaque(render(doc, 1024), BRAND / "store" / "play-feature-graphic-1024x500.png", RED)
