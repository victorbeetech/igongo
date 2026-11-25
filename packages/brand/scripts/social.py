"""Social media kit: profile pictures, cover images for every network we
post on, and post and story templates for Instagram, Facebook and WhatsApp.

Covers keep the logo inside each network's safe area, so nothing is cut
off on phones or hidden behind the profile picture.
"""

from __future__ import annotations

from brand_kit import BRAND, COLOURWAY, CREAM, INK, RED, RED_DEEP, WHITE, svg_doc, write_png, write_svg
from canvas import centred_mark, field, label, logo_at

MUTED = "#665C56"

# Square profile pictures: name, size in pixels.
PROFILES = {"profile": 1080, "whatsapp-profile": 640, "google-business-logo": 720}

# Covers: name -> (width, height, safe width, safe height). The safe box is
# centred and is the part every device shows.
COVERS = {
    "facebook-cover": (1640, 624, 1200, 460),
    "x-header": (1500, 500, 1100, 360),
    "linkedin-cover": (1584, 396, 1100, 300),
    "youtube-banner": (2560, 1440, 1546, 423),
    "google-business-cover": (1080, 608, 900, 460),
}


def _profiles(out) -> None:
    """Profile pictures in two styles, with the mark kept inside the circle
    that every network crops to."""
    for name, size in PROFILES.items():
        for style, cw, bg in (("cream", COLOURWAY["color"], CREAM), ("red", COLOURWAY["white"], RED)):
            doc = centred_mark(cw, size, 0.58, bg)
            write_png(out / "profile" / f"igongo-{name}-{style}.png", doc, size)
        if name == "profile":
            write_svg(out / "profile" / "igongo-profile-cream.svg", centred_mark(COLOURWAY["color"], size, 0.58, CREAM))


def _cover(w: int, h: int, safe_w: int, safe_h: int) -> str:
    """A red cover: soft deep-red curves, faint spirals at the edges, and the
    white horizontal logo centred in the safe area."""
    # Step 1: the background and two soft curves for depth.
    bg = (f'<rect width="{w}" height="{h}" fill="{RED}"/>'
          f'<path d="M0,{h}V{h * 0.62:.0f}C{w * 0.3:.0f},{h * 0.45:.0f} {w * 0.6:.0f},{h * 0.95:.0f} {w},{h * 0.7:.0f}V{h}Z" '
          f'fill="{RED_DEEP}" opacity="0.55"/>')
    # Step 2: big faint spirals off the left and right edges.
    big = h * 0.9
    left, _ = logo_at("spiral", COLOURWAY["white"], -big * 0.45, h * 0.05, big)
    right, _ = logo_at("spiral", COLOURWAY["white"], w - big * 0.55, h * 0.1, big)
    deco = f'<g opacity="0.07">{left}{right}</g>'
    # Step 3: the logo, as large as fits 80% of the safe box, and the web address.
    logo_w = safe_w * 0.62
    _, logo_h = logo_at("horizontal", COLOURWAY["white"], 0, 0, logo_w)
    if logo_h > safe_h * 0.72:
        logo_w *= safe_h * 0.72 / logo_h
    logo, logo_h = logo_at("horizontal", COLOURWAY["white"], (w - logo_w) / 2, 0, logo_w)
    top = (h - logo_h - safe_h * 0.12) / 2
    site = label(w / 2, top + logo_h + safe_h * 0.11, safe_h * 0.075, "igongo.co.ug", CREAM, 700, "middle", spacing=2)
    return bg + deco + f'<g transform="translate(0,{top:.1f})">{logo}</g>' + site


def _post(w: int, h: int) -> str:
    """A post or story template: a photo area, the headline and the logo.

    The photo, headline and subline are live fields that the marketing team
    replaces in the Marketing module's post designer.
    """
    # The text block is the same size on every format; a story also keeps
    # clear of the reply bar that covers its lowest 250 px.
    footer = w * 0.065 + (250 if h / w > 1.5 else 0)
    photo_h = h - w * 0.355 - footer
    logo, logo_h = logo_at("horizontal", COLOURWAY["color"], w * 0.08, photo_h + w * 0.045, w * 0.44)
    head_y = photo_h + w * 0.045 + logo_h + w * 0.075
    return (f'<rect width="{w}" height="{h}" fill="{CREAM}"/>'
            f'<g data-field="photo"><rect width="{w}" height="{photo_h:.0f}" fill="#E2D9D1"/>'
            + label(w / 2, photo_h / 2, w * 0.03, "PHOTO", MUTED, 700, "middle", spacing=4) + '</g>'
            f'<rect y="{photo_h:.0f}" width="{w}" height="{h * 0.012:.0f}" fill="{RED}"/>{logo}'
            + field(w * 0.08, head_y, w * 0.062, "headline", "Headline goes here", INK, 900, max_width=w * 0.84)
            + field(w * 0.08, head_y + w * 0.06, w * 0.034, "subline", "Date, time or one short detail", RED, 700,
                    max_width=w * 0.84)
            + f'<rect y="{h - footer:.0f}" width="{w}" height="{footer:.0f}" fill="{RED}"/>'
            + label(w / 2, h - footer + w * 0.043, w * 0.03, "igongo.co.ug", WHITE, 700, "middle", spacing=2))


def build_social() -> None:
    """Write profile pictures, covers and post templates as SVG and PNG."""
    out = BRAND / "social"
    _profiles(out)

    # Covers, with a guide version that shows the safe area.
    for name, (w, h, sw, sh) in COVERS.items():
        body = _cover(w, h, sw, sh)
        write_svg(out / "cover" / f"igongo-{name}.svg", svg_doc(body, w, h, title=f"Igongo {name}"))
        write_png(out / "cover" / f"igongo-{name}.png", svg_doc(body, w, h), w)
        guide = (f'<rect x="{(w - sw) / 2}" y="{(h - sh) / 2}" width="{sw}" height="{sh}" fill="none" '
                 f'stroke="#00E5FF" stroke-width="{max(w / 600, 2):.1f}" stroke-dasharray="12 8"/>')
        write_png(out / "cover" / "guides" / f"igongo-{name}-safe-area.png", svg_doc(body + guide, w, h), w // 2)

    # Post and story templates.
    for name, (w, h) in {"post-square": (1080, 1080), "post-portrait": (1080, 1350), "story": (1080, 1920)}.items():
        doc = svg_doc(_post(w, h), w, h, title=f"Igongo {name} template")
        write_svg(out / "post" / f"igongo-{name}.svg", doc)
        write_png(out / "post" / f"igongo-{name}.png", doc, w)
