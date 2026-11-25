"""App icons for Android and iOS, and splash screens."""

from __future__ import annotations

import json

from brand_kit import BRAND, COLOURWAY, CREAM, NIGHT, Colourway, svg_doc, write_png, write_svg
from canvas import centred_mark, render, save_opaque
from lockups import stacked

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
        background = svg_doc(f'<rect width="108" height="108" fill="{CREAM}"/>', 108, 108)
        write_png(mip / "ic_launcher_background.png", background, round(108 * k))
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
