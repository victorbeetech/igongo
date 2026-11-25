"""Build every Igongo brand asset from the master mark and the brand fonts.

Run from the repository root:

    pip install -r packages/brand/scripts/requirements.txt
    python packages/brand/scripts/build_brand.py

ffmpeg must be installed for the GIF and video files.

Everything in the output folders below is generated. Never edit those files
by hand: change the master, the fonts or these scripts, then build again.
"""

from __future__ import annotations

import io
import json
import shutil
import subprocess
import tempfile
from pathlib import Path

import cairosvg
from PIL import Image

from brand_kit import (BRAND, CREAM, COLOURWAY, COLOURWAYS, INK, MARK_H, MARK_W, NIGHT, RED,
                       SPIRAL_POLE, WHITE, Colourway, mark, mark_parts, svg_doc, write_png,
                       write_svg)
from lockups import LOCKUPS, stacked
from motion import ANIMATIONS, Animation, lottie, smil_wrap

# Generated folders. They are emptied and rebuilt on every run.
OUTPUTS = ["logo", "app-icon", "splash", "web", "store", "animation", "print", "pattern", "preview"]

# PNG widths made for every logo file.
LOGO_WIDTHS = [256, 512, 1024, 2048]


# ---------------------------------------------------------------------------
# Small helpers
# ---------------------------------------------------------------------------

def render(doc: str, width: int, height: int | None = None) -> Image.Image:
    """Render an SVG document to a Pillow image."""
    png = cairosvg.svg2png(bytestring=doc.encode(), output_width=width, output_height=height)
    return Image.open(io.BytesIO(png)).convert("RGBA")


def save_opaque(img: Image.Image, path: Path, background: str) -> None:
    """Save without an alpha channel, as app stores require for icons."""
    path.parent.mkdir(parents=True, exist_ok=True)
    flat = Image.new("RGB", img.size, background)
    flat.paste(img, mask=img.split()[3])
    flat.save(path)


def centred_mark(cw: Colourway, size: float, mark_ratio: float, background: str | None = None,
                 shape: str = "square", radius: float = 0.0) -> str:
    """Return a square SVG with the mark centred, `mark_ratio` of the height.

    shape is "square" (optionally with rounded corners) or "circle".
    """
    h = size * mark_ratio
    w = MARK_W * h / MARK_H
    bg = ""
    if background and shape == "circle":
        bg = f'<circle cx="{size / 2}" cy="{size / 2}" r="{size / 2}" fill="{background}"/>'
    elif background:
        bg = f'<rect width="{size}" height="{size}" rx="{radius * size}" fill="{background}"/>'
    return svg_doc(bg + mark(cw, (size - w) / 2, (size - h) / 2, h), size, size)


# ---------------------------------------------------------------------------
# 1. Logos
# ---------------------------------------------------------------------------

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


# ---------------------------------------------------------------------------
# 2. App icons
# ---------------------------------------------------------------------------

ANDROID_DENSITIES = {"mdpi": 1, "hdpi": 1.5, "xhdpi": 2, "xxhdpi": 3, "xxxhdpi": 4}
IOS_SIZES = [20, 29, 40, 58, 60, 76, 80, 87, 120, 152, 167, 180, 1024]


def build_app_icons() -> None:
    """Launcher icons for Android and iOS, and the Play Store icon."""
    color, black, white = COLOURWAY["color"], COLOURWAY["black"], COLOURWAY["white"]
    out = BRAND / "app-icon"

    # Master icon SVGs, kept for designers.
    write_svg(out / "igongo-app-icon.svg", centred_mark(color, 1024, 0.68, CREAM))
    write_svg(out / "igongo-app-icon-dark.svg", centred_mark(COLOURWAY["reversed"], 1024, 0.68, NIGHT))

    android = out / "android" / "res"
    for density, k in ANDROID_DENSITIES.items():
        mip = android / f"mipmap-{density}"
        # Legacy icons (before Android 8): rounded square and circle.
        write_png(mip / "ic_launcher.png", centred_mark(color, 48, 0.72, CREAM, radius=0.18), round(48 * k))
        write_png(mip / "ic_launcher_round.png", centred_mark(color, 48, 0.66, CREAM, "circle"), round(48 * k))
        # Adaptive icon layers (Android 8+). The mark stays inside the 66dp safe circle.
        write_png(mip / "ic_launcher_foreground.png", centred_mark(color, 108, 0.46), round(108 * k))
        write_png(mip / "ic_launcher_monochrome.png", centred_mark(black, 108, 0.46), round(108 * k))
        write_png(mip / "ic_launcher_background.png", svg_doc(f'<rect width="108" height="108" fill="{CREAM}"/>', 108, 108), round(108 * k))
        # Notification icon: a white silhouette, as Android requires.
        write_png(android / f"drawable-{density}" / "ic_stat_igongo.png", centred_mark(white, 24, 0.92), round(24 * k))

    # Adaptive icon definition and background colour.
    adaptive = ('<?xml version="1.0" encoding="utf-8"?>\n'
                '<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">\n'
                '    <background android:drawable="@color/ic_launcher_background"/>\n'
                '    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>\n'
                '    <monochrome android:drawable="@mipmap/ic_launcher_monochrome"/>\n'
                '</adaptive-icon>\n')
    for name in ("ic_launcher.xml", "ic_launcher_round.xml"):
        (android / "mipmap-anydpi-v26").mkdir(parents=True, exist_ok=True)
        (android / "mipmap-anydpi-v26" / name).write_text(adaptive)
    (android / "values").mkdir(parents=True, exist_ok=True)
    (android / "values" / "ic_launcher_background.xml").write_text(
        '<?xml version="1.0" encoding="utf-8"?>\n<resources>\n'
        f'    <color name="ic_launcher_background">{CREAM}</color>\n</resources>\n')

    # Play Store icon: 512 px, square, no transparency (Google adds the mask).
    save_opaque(render(centred_mark(color, 512, 0.68, CREAM), 512), out / "play-store" / "igongo-play-icon-512.png", CREAM)

    # iOS: the single 1024 px icon with dark and tinted versions (iOS 18),
    # plus every legacy size for older tools.
    ios = out / "ios" / "AppIcon.appiconset"
    save_opaque(render(centred_mark(color, 1024, 0.68, CREAM), 1024), ios / "AppIcon-1024.png", CREAM)
    save_opaque(render(centred_mark(COLOURWAY["reversed"], 1024, 0.68, NIGHT), 1024), ios / "AppIcon-1024-dark.png", NIGHT)
    tinted = Colourway("tinted", "#FFFFFF", "#9A9A9A", "", "", "")
    save_opaque(render(centred_mark(tinted, 1024, 0.68, "#000000"), 1024), ios / "AppIcon-1024-tinted.png", "#000000")
    contents = {
        "images": [
            {"filename": "AppIcon-1024.png", "idiom": "universal", "platform": "ios", "size": "1024x1024"},
            {"appearances": [{"appearance": "luminosity", "value": "dark"}],
             "filename": "AppIcon-1024-dark.png", "idiom": "universal", "platform": "ios", "size": "1024x1024"},
            {"appearances": [{"appearance": "luminosity", "value": "tinted"}],
             "filename": "AppIcon-1024-tinted.png", "idiom": "universal", "platform": "ios", "size": "1024x1024"},
        ],
        "info": {"author": "igongo-brand-build", "version": 1},
    }
    (ios / "Contents.json").write_text(json.dumps(contents, indent=2) + "\n")
    for px in IOS_SIZES:
        save_opaque(render(centred_mark(color, 1024, 0.68, CREAM), px), out / "ios" / "legacy" / f"igongo-icon-{px}.png", CREAM)


# ---------------------------------------------------------------------------
# 3. Splash screens
# ---------------------------------------------------------------------------

def build_splash() -> None:
    """Splash images for Android 12+, iOS and older Android, light and dark."""
    out = BRAND / "splash"
    for theme, cw, bg in (("light", COLOURWAY["color"], CREAM), ("dark", COLOURWAY["reversed"], NIGHT)):
        # Android 12+: a 288dp icon canvas; the mark must fit the 192dp circle.
        write_png(out / f"android12-splash-icon-{theme}.png", centred_mark(cw, 288, 0.50), 1152)
        # Centre logo for iOS and older Android, at 1x, 2x and 3x.
        body, w, h = stacked(cw)
        doc = svg_doc(body, w, h, title="Igongo")
        for scale in (1, 2, 3):
            write_png(out / f"splash-logo-{theme}@{scale}x.png", doc, 220 * scale)
        # A full phone-sized preview, to check the result.
        phone = svg_doc(f'<rect width="1080" height="2340" fill="{bg}"/>'
                        f'<g transform="translate({(1080 - 560) / 2},{(2340 - 560 * h / w) / 2}) scale({560 / w})">{body}</g>',
                        1080, 2340)
        write_png(out / "preview" / f"splash-preview-{theme}.png", phone, 540)
    (out / "splash-colors.json").write_text(json.dumps({"light": CREAM, "dark": NIGHT}, indent=2) + "\n")


# ---------------------------------------------------------------------------
# 4. Web
# ---------------------------------------------------------------------------

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


# ---------------------------------------------------------------------------
# 5. Store graphics
# ---------------------------------------------------------------------------

def build_store() -> None:
    """The Play Store feature graphic: the white logo on Igongo red."""
    body, w, h = LOCKUPS["horizontal"](COLOURWAY["white"])
    k = 760 / w
    doc = svg_doc(f'<rect width="1024" height="500" fill="{RED}"/>'
                  f'<g transform="translate({(1024 - 760) / 2},{(500 - h * k) / 2}) scale({k})">{body}</g>',
                  1024, 500)
    save_opaque(render(doc, 1024), BRAND / "store" / "play-feature-graphic-1024x500.png", RED)


# ---------------------------------------------------------------------------
# 6. Print templates
# ---------------------------------------------------------------------------

def _logo_at(lockup: str, cw: Colourway, x: float, y: float, width: float) -> tuple[str, float]:
    """Return a lockup placed at (x, y) and scaled to `width`, and its height."""
    body, w, h = LOCKUPS[lockup](cw)
    k = width / w
    return f'<g transform="translate({x},{y}) scale({k:.5f})">{body}</g>', h * k


def _text(x, y, size, text, fill=INK, weight=400, anchor="start", family="Lato") -> str:
    """Live text for print templates. Fields in {{braces}} are filled by the
    card printing module."""
    return (f'<text x="{x}" y="{y}" font-family="{family}, sans-serif" font-size="{size}" '
            f'font-weight="{weight}" fill="{fill}" text-anchor="{anchor}">{text}</text>')


def build_print() -> None:
    """Staff card, wristband, QR sticker, receipt headers, letterhead and email
    header. Sizes are in tenths of a millimetre for physical items."""
    out = BRAND / "print"
    color, white, black = COLOURWAY["color"], COLOURWAY["white"], COLOURWAY["black"]

    # Staff card, CR80 size (85.6 x 54 mm). Front.
    logo, lh = _logo_at("horizontal", white, 30, 22, 330)
    front = (f'<rect width="856" height="540" rx="32" fill="{CREAM}"/>'
             f'<path d="M0,32 a32,32 0 0 1 32,-32 h792 a32,32 0 0 1 32,32 v118 h-856z" fill="{RED}"/>{logo}'
             f'<rect x="40" y="190" width="220" height="270" rx="12" fill="#E7DCD4"/>'
             + _text(150, 335, 22, "PHOTO", "#6E5E57", 700, "middle")
             + _text(290, 230, 40, "{{full_name}}", INK, 900)
             + _text(290, 280, 28, "{{role}}", RED, 700)
             + _text(290, 320, 24, "{{department}}", "#6E5E57")
             + _text(290, 430, 24, "Staff No. {{staff_no}}", INK, 700)
             + '<rect x="640" y="300" width="176" height="176" fill="#FFFFFF" stroke="#E7DCD4"/>'
             + _text(728, 395, 18, "{{qr}}", "#6E5E57", 400, "middle")
             + f'<rect y="510" width="856" height="30" fill="{RED}"/>')
    write_svg(out / "staff-card-front.svg", svg_doc(front, 856, 540, title="Staff card front"))
    # Back.
    sp, _ = _logo_at("spiral", COLOURWAY["red"], 560, 120, 300)
    back = (f'<rect width="856" height="540" rx="32" fill="{CREAM}"/><g opacity="0.08">{sp}</g>'
            + _text(48, 90, 28, "IGONGO COUNTRY HOTEL &amp; CULTURAL CENTRE", RED, 900)
            + _text(48, 150, 22, "This card belongs to Igongo and must be shown on request.")
            + _text(48, 185, 22, "If found, please return it to the main gate or call {{hotel_phone}}.")
            + _text(48, 260, 22, "Tap or scan at any Igongo station.", INK, 700)
            + _text(48, 470, 20, "Valid until {{expiry_date}}", "#6E5E57")
            + _text(808, 470, 20, "Card {{card_no}}", "#6E5E57", 400, "end")
            + f'<rect y="510" width="856" height="30" fill="{RED}"/>')
    write_svg(out / "staff-card-back.svg", svg_doc(back, 856, 540, title="Staff card back"))

    # Event wristband, 250 x 25 mm.
    spiral_w = 160
    marks = "".join(_logo_at("spiral", white, x, 45, spiral_w)[0] for x in range(260, 1560, 320))
    band = (f'<rect width="2500" height="250" rx="40" fill="{RED}"/>{marks}'
            + _text(1900, 155, 80, "{{band_no}}", WHITE, 900, "middle")
            + '<rect x="2240" y="35" width="180" height="180" fill="#FFFFFF"/>'
            + _text(2330, 135, 30, "{{qr}}", "#6E5E57", 400, "middle"))
    write_svg(out / "wristband.svg", svg_doc(band, 2500, 250, title="Event wristband"))

    # QR sticker for tables, assets, rooms and patrol points, 50 x 65 mm.
    logo, lh = _logo_at("horizontal", color, 50, 30, 400)
    sticker = (f'<rect width="500" height="650" rx="30" fill="#FFFFFF" stroke="{RED}" stroke-width="8"/>{logo}'
               '<rect x="90" y="180" width="320" height="320" fill="#F3ECE5"/>'
               + _text(250, 350, 26, "{{qr}}", "#6E5E57", 400, "middle")
               + _text(250, 560, 34, "{{label}}", RED, 900, "middle")
               + _text(250, 605, 24, "Scan with the Igongo app", INK, 400, "middle"))
    write_svg(out / "qr-sticker.svg", svg_doc(sticker, 500, 650, title="QR sticker"))

    # Thermal receipt headers: black only, 58 mm (384 px) and 80 mm (576 px).
    body, w, h = LOCKUPS["stacked"](black)
    doc = svg_doc(body, w, h)
    for name, px in (("58mm", 384), ("80mm", 576)):
        img = render(doc, int(px * 0.6))
        canvas = Image.new("RGBA", (px, img.height), "white")
        canvas.alpha_composite(img, ((px - img.width) // 2, 0))
        canvas.convert("L").point(lambda v: 0 if v < 140 else 255, "1").save(out / f"receipt-header-{name}.png")

    # A4 letterhead (210 x 297 mm, in tenths of a mm).
    logo, lh = _logo_at("horizontal", color, 150, 120, 760)
    letter = (f'<rect width="2100" height="2970" fill="#FFFFFF"/>{logo}'
              f'<rect x="150" y="{140 + lh}" width="1800" height="4" fill="{RED}"/>'
              f'<rect x="150" y="2780" width="1800" height="4" fill="{RED}"/>'
              + _text(1050, 2850, 30, "{{hotel_address}} · {{hotel_phone}} · {{hotel_email}} · igongo.co.ug", "#6E5E57", 400, "middle"))
    write_svg(out / "letterhead-a4.svg", svg_doc(letter, 2100, 2970, title="Letterhead"))

    # Email header, 600 x 150 at 2x.
    body, w, h = LOCKUPS["horizontal"](color)
    k = 380 / w
    email = svg_doc(f'<rect width="600" height="150" fill="{CREAM}"/>'
                    f'<g transform="translate({(600 - 380) / 2},{(146 - h * k) / 2}) scale({k})">{body}</g>'
                    f'<rect y="146" width="600" height="4" fill="{RED}"/>', 600, 150)
    write_png(out / "email-header@2x.png", email, 1200)

    # PNG previews of the templates.
    for svg in out.glob("*.svg"):
        write_png(out / "preview" / f"{svg.stem}.png", svg.read_text(), 800)


# ---------------------------------------------------------------------------
# 7. Patterns
# ---------------------------------------------------------------------------

def build_patterns() -> None:
    """A repeating spiral pattern for backgrounds, cards and packaging."""
    out = BRAND / "pattern"
    for name, fg, bg, alpha in (("on-cream", RED, CREAM, 0.10), ("on-red", WHITE, RED, 0.12),
                                ("on-night", RED, NIGHT, 0.22)):
        cw = Colourway(name, fg, fg, fg, fg, "")
        sp1, _ = _logo_at("spiral", cw, 10, 10, 60)
        sp2, _ = _logo_at("spiral", cw, 90, 90, 60)
        tile = svg_doc(f'<rect width="160" height="160" fill="{bg}"/><g opacity="{alpha}">{sp1}{sp2}</g>', 160, 160)
        write_svg(out / f"igongo-pattern-spiral-{name}.svg", tile)
        # A large rendered swatch made from the repeating tile.
        tile_img = render(tile, 320)
        swatch = Image.new("RGBA", (1280, 1280))
        for x in range(0, 1280, 320):
            for y in range(0, 1280, 320):
                swatch.paste(tile_img, (x, y))
        swatch.save(out / f"igongo-pattern-spiral-{name}-1280.png")


# ---------------------------------------------------------------------------
# 8. Animations
# ---------------------------------------------------------------------------

def _anim_scene(anim: Animation, cw: Colourway, t: float | None) -> tuple[str, float, float]:
    """Return (svg body, width, height) for an animation, either frozen at
    time `t` (for frames) or with SMIL animation (when t is None)."""
    parts = mark_parts()
    fills = {"spiral": cw.spiral, "horn-left": cw.ink, "horn-right": cw.ink, "cup": cw.ink}

    if anim.name == "intro-stacked":
        if t is None:
            # Wrap the text group with its SMIL animation.
            body, w, h = stacked(cw)
            mark_end = body.index("</g>") + 4
            text_group = body[mark_end:]
            mark_svg = _smil_mark(anim, fills, parts)
            k = 600 / MARK_H
            mark_x = (w - MARK_W * k) / 2
            body = (f'<g transform="translate({mark_x},{600 * 0.08}) scale({k})">{mark_svg}</g>'
                    + smil_wrap(anim, "text", text_group))
            return body, w, h
        transforms, opacity = anim.state(t)
        text_move = transforms.pop("text", "")
        text_alpha = opacity.pop("text", 1.0)
        return stacked(cw, transforms, opacity,
                       f'transform="{text_move}" opacity="{text_alpha:.3f}"')

    if anim.name == "loader-spiral":
        # A square view centred on the spiral's pole.
        px, py = SPIRAL_POLE
        view = (px - 64, py - 64, 128, 128)
        if t is None:
            inner = smil_wrap(anim, "spiral", f'<path fill="{cw.spiral}" d="{parts["spiral"]}"/>')
        else:
            transforms, _ = anim.state(t)
            inner = f'<path fill="{cw.spiral}" transform="{transforms["spiral"]}" d="{parts["spiral"]}"/>'
        return f'<g transform="translate({-view[0]},{-view[1]})">{inner}</g>', view[2], view[3]

    # Mark-based animations: the mark with a little room to move.
    pad = 16
    if t is None:
        inner = _smil_mark(anim, fills, parts)
    else:
        transforms, opacity = anim.state(t)
        inner = mark(cw, 0, 0, MARK_H, transforms, opacity)
    return f'<g transform="translate({pad},{pad})">{inner}</g>', MARK_W + 2 * pad, MARK_H + 2 * pad


def _smil_mark(anim: Animation, fills: dict, parts: dict) -> str:
    """The mark with each part wrapped in its SMIL animation."""
    return "".join(smil_wrap(anim, p, f'<path fill="{fills[p]}" d="{d}"/>') for p, d in parts.items())


def _video(frames_dir: Path, fps: int, target: Path, kind: str) -> None:
    """Encode numbered PNG frames as a GIF or an MP4 with ffmpeg."""
    src = ["-framerate", str(fps), "-i", str(frames_dir / "f%04d.png")]
    if kind == "gif":
        graph = "split[a][b];[a]palettegen=reserve_transparent=0[p];[b][p]paletteuse=dither=sierra2_4a"
        args = src + ["-filter_complex", graph, "-loop", "0"]
    else:
        args = src + ["-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "18", "-movflags", "+faststart",
                      "-vf", "pad=ceil(iw/2)*2:ceil(ih/2)*2"]
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", *args, str(target)], check=True)


def build_animations() -> None:
    """For every animation: an animated SVG, a Lottie file (mark-based ones),
    and GIF and MP4 files on light and dark backgrounds."""
    fps = 30
    for anim in ANIMATIONS:
        folder = BRAND / "animation" / anim.name
        stem = f"igongo-{anim.name}"

        # Animated SVG (SMIL), transparent, in both colourways.
        for theme, cw in (("light", COLOURWAY["color"]), ("dark", COLOURWAY["reversed"])):
            body, w, h = _anim_scene(anim, cw, None)
            write_svg(folder / f"{stem}-{theme}.svg", svg_doc(body, w, h, title=f"Igongo {anim.name}"))

        # Lottie JSON for the Flutter app (not for the stacked intro, which has text).
        if anim.name != "intro-stacked":
            for theme, cw in (("light", COLOURWAY["color"]), ("dark", COLOURWAY["reversed"])):
                fills = {"spiral": cw.spiral, "horn-left": cw.ink, "horn-right": cw.ink, "cup": cw.ink}
                if anim.name == "loader-spiral":
                    px, py = SPIRAL_POLE
                    view, fills = (px - 64, py - 64, 128, 128), {"spiral": cw.spiral}
                else:
                    view = (-16, -16, MARK_W + 32, MARK_H + 32)
                (folder / f"{stem}-{theme}.json").write_text(lottie(anim, fills, view))

        # GIF and MP4 on light and dark backgrounds.
        width = 480 if anim.name.startswith("intro") else 240
        for theme, cw, bg in (("light", COLOURWAY["color"], CREAM), ("dark", COLOURWAY["reversed"], NIGHT)):
            with tempfile.TemporaryDirectory() as tmp:
                tmp = Path(tmp)
                # One extra second of hold at the end of one-off intros.
                total = anim.duration if anim.loop else anim.duration + 1.0
                count = round(total * fps)
                for i in range(count):
                    body, w, h = _anim_scene(anim, cw, i / fps)
                    write_png(tmp / f"f{i:04d}.png", svg_doc(body, w, h, background=bg), width)
                _video(tmp, fps, folder / f"{stem}-{theme}.gif", "gif")
                _video(tmp, fps, folder / f"{stem}-{theme}.mp4", "mp4")


# ---------------------------------------------------------------------------
# 9. Overview sheet
# ---------------------------------------------------------------------------

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


def main() -> None:
    """Empty the generated folders and build everything again."""
    for name in OUTPUTS:
        shutil.rmtree(BRAND / name, ignore_errors=True)
    steps = [build_logos, build_app_icons, build_splash, build_web, build_store,
             build_print, build_patterns, build_animations, build_preview]
    for step in steps:
        print(f"Building {step.__name__.removeprefix('build_')}...")
        step()
    print("Done.")


if __name__ == "__main__":
    main()
