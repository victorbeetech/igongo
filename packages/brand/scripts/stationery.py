"""Print and office stationery: event wristbands, QR stickers, thermal
receipt headers, letterhead, business card, name badge, email header, email
signature and watermark.

Print designs are sized in tenths of a millimetre and saved three ways: an
SVG template with live `data-field` values, a PNG preview, and a
print-ready PDF at exact physical size. ID cards live in `cards.py`.
"""

from __future__ import annotations

import json
from pathlib import Path

import cairosvg
from PIL import Image

from brand_kit import BRAND, COLOURWAY, CREAM, INK, NIGHT, RED, RED_DEEP, WHITE, svg_doc, write_png, write_svg
from canvas import field, label, logo_at, nfc_symbol, qr, render
from lockups import LOCKUPS

MUTED, CHARCOAL = "#665C56", "#222323"

# Sample values shown in previews. The modules that print these replace them.
SAMPLE = {
    "band_no": "0147",
    "event_name": "Ankole Cultural Night",
    "event_date": "12 Dec 2026",
    "qr": "https://igongo.co.ug/w/0147",
    "label": "Table 12",
    "full_name": "Grace Atuhaire",
    "role": "Front Office Manager",
    "phone": "+256 700 000 247",
    "email": "grace@igongo.co.ug",
    "hotel_address": "Igongo Country Hotel, Biharwe, Mbarara, Uganda",
    "hotel_phone": "+256 000 000 000",
    "hotel_email": "info@igongo.co.ug",
}


def _save_print(folder: Path, name: str, body: str, w: float, h: float, title: str, preview_w: int = 900) -> None:
    """Save one print design as an SVG template, a PNG preview and a PDF at
    physical size (the design is drawn in tenths of a millimetre)."""
    doc = svg_doc(body, w, h, title=title)
    write_svg(folder / f"{name}.svg", doc)
    write_png(folder / "preview" / f"{name}.png", doc, preview_w)
    physical = doc.replace(f'width="{w:g}" height="{h:g}"', f'width="{w / 10:g}mm" height="{h / 10:g}mm"', 1)
    cairosvg.svg2pdf(bytestring=physical.encode(), write_to=str(folder / f"{name}-print.pdf"))


# ---------------------------------------------------------------------------
# Event wristbands, 250 x 25 mm
# ---------------------------------------------------------------------------

# Each band design: background, spiral colour, text colour, accent and label.
WRISTBANDS = {
    "standard": (RED, WHITE, WHITE, RED_DEEP, "GUEST"),
    "vip": (NIGHT, RED, CREAM, RED, "VIP"),
    "crew": (CREAM, RED, INK, RED, "CREW"),
}


def _wristband(bg: str, spiral: str, text: str, accent: str, kind: str) -> str:
    """One wristband face: spirals along the strap, the event, the band
    number and its QR code at the end that shows on the wrist."""
    W, H = 2500, 250
    cw = COLOURWAY["white"] if spiral == WHITE else COLOURWAY["red"]
    # Step 1: the strap and a row of faint spirals on the part that wraps.
    marks = "".join(f'<g opacity="0.35">{logo_at("spiral", cw, x, 55, 140)[0]}</g>' for x in range(140, 1000, 250))
    # Step 2: the logo, event name and band type in the middle.
    logo_cw = COLOURWAY["white"] if bg != CREAM else COLOURWAY["color"]
    logo, _ = logo_at("horizontal", logo_cw, 1130, 52, 430)
    divider = f'<rect x="1590" y="50" width="3" height="150" fill="{text}" opacity="0.5"/>'
    info = (label(1620, 105, 40, kind, accent if bg == CREAM else text, 900, spacing=6)
            + field(1620, 150, 30, "event_name", SAMPLE["event_name"], text, 700, max_width=330)
            + field(1620, 188, 24, "event_date", SAMPLE["event_date"], text, 400))
    # Step 3: the band number and QR code, where the band closes on the wrist.
    number = field(2120, 158, 84, "band_no", SAMPLE["band_no"], text, 900, "middle")
    code = qr(2270, 30, 190, SAMPLE["qr"])
    return (f'<rect width="{W}" height="{H}" rx="40" fill="{bg}"/>{marks}{logo}{divider}{info}{number}{code}'
            + nfc_symbol(2002, 186, 44, text))


# ---------------------------------------------------------------------------
# Small print items
# ---------------------------------------------------------------------------

def _qr_sticker() -> str:
    """QR sticker for tables, rooms, assets and patrol points, 50 x 65 mm."""
    logo, _ = logo_at("horizontal", COLOURWAY["color"], 60, 34, 380)
    return (f'<rect width="500" height="650" rx="30" fill="{WHITE}" stroke="{RED}" stroke-width="8"/>{logo}'
            + qr(100, 175, 300, SAMPLE["qr"])
            + field(250, 545, 38, "label", SAMPLE["label"], RED, 900, "middle", max_width=420)
            + label(250, 595, 24, "Scan with the Igongo app", INK, 400, "middle"))


def _business_card_front() -> str:
    """Business card front, 90 x 55 mm: name, role and contacts on cream."""
    logo, _ = logo_at("horizontal", COLOURWAY["color"], 50, 50, 360)
    rows = [("phone", "T"), ("email", "E")]
    contacts = "".join(label(60, 400 + i * 42, 22, k, RED, 900) + field(95, 400 + i * 42, 22, n, SAMPLE[n], INK, 400)
                       for i, (n, k) in enumerate(rows))
    return (f'<rect width="900" height="550" fill="{CREAM}"/>{logo}'
            + field(60, 290, 40, "full_name", SAMPLE["full_name"], INK, 900, max_width=600)
            + field(60, 330, 24, "role", SAMPLE["role"], RED, 700, max_width=600)
            + contacts + label(840, 484, 22, "igongo.co.ug", MUTED, 700, "end")
            + f'<rect y="525" width="900" height="25" fill="{RED}"/>')


def _business_card_back() -> str:
    """Business card back: the stacked logo in white on red."""
    logo, h = logo_at("stacked", COLOURWAY["white"], 330, 0, 240)
    return (f'<rect width="900" height="550" fill="{RED}"/>'
            f'<g transform="translate(0,{(550 - h) / 2:.1f})">{logo}</g>')


def _name_badge() -> str:
    """Pin or magnet name badge, 75 x 25 mm."""
    mark, _ = logo_at("mark", COLOURWAY["color"], 30, 30, 150)
    return (f'<rect width="750" height="250" rx="24" fill="{WHITE}"/>'
            f'<rect width="24" height="250" fill="{RED}"/>{mark}'
            + field(205, 120, 56, "full_name", SAMPLE["full_name"].split()[0], INK, 900, max_width=500)
            + field(205, 175, 28, "role", SAMPLE["role"], RED, 700, max_width=500)
            + label(205, 215, 20, "IGONGO COUNTRY HOTEL &amp; CULTURAL CENTRE", MUTED, 700, spacing=1))


def _letterhead() -> str:
    """A4 letterhead (210 x 297 mm), with the address line in the footer."""
    logo, lh = logo_at("horizontal", COLOURWAY["color"], 150, 120, 760)
    footer = f'{SAMPLE["hotel_address"]} · {SAMPLE["hotel_phone"]} · {SAMPLE["hotel_email"]} · igongo.co.ug'
    sp, _ = logo_at("spiral", COLOURWAY["red"], 1350, 2050, 700)
    return (f'<rect width="2100" height="2970" fill="{WHITE}"/>{logo}<g opacity="0.05">{sp}</g>'
            f'<rect x="150" y="{140 + lh:.1f}" width="1800" height="4" fill="{RED}"/>'
            f'<rect x="150" y="2780" width="1800" height="4" fill="{RED}"/>'
            + field(1050, 2850, 28, "footer", footer, MUTED, 400, "middle", max_width=1800))


# ---------------------------------------------------------------------------
# Digital stationery
# ---------------------------------------------------------------------------

def _receipt_headers(out: Path) -> None:
    """Thermal receipt headers: pure black and white, 58 mm (384 dots) and
    80 mm (576 dots) wide."""
    body, w, h = LOCKUPS["stacked"](COLOURWAY["black"])
    doc = svg_doc(body, w, h)
    for name, px in (("58mm", 384), ("80mm", 576)):
        img = render(doc, int(px * 0.6))
        canvas = Image.new("RGBA", (px, img.height), "white")
        canvas.alpha_composite(img, ((px - img.width) // 2, 0))
        canvas.convert("L").point(lambda v: 0 if v < 140 else 255, "1").save(out / f"receipt-header-{name}.png")


def _email(out: Path) -> None:
    """The email header image, and an email signature with its logo image.

    The signature is a plain HTML table with inline styles, which is what
    email apps show reliably. Its {{...}} values are filled per person, and
    the logo link must point to the hosted copy of the PNG.
    """
    body, w, h = LOCKUPS["horizontal"](COLOURWAY["color"])
    k = 380 / w
    header = svg_doc(f'<rect width="600" height="150" fill="{CREAM}"/>'
                     f'<g transform="translate({(600 - 380) / 2},{(146 - h * k) / 2}) scale({k})">{body}</g>'
                     f'<rect y="146" width="600" height="4" fill="{RED}"/>', 600, 150)
    write_png(out / "email-header@2x.png", header, 1200)

    # The signature logo: the mark alone, 64 px shown, saved at 2x.
    mark_body, mw, mh = LOCKUPS["mark"](COLOURWAY["color"])
    write_png(out / "email-signature-logo@2x.png", svg_doc(mark_body, mw, mh), 128)
    html = f"""<!-- Igongo email signature. Fill the {{{{...}}}} values per person, and
     point the image at the hosted copy of email-signature-logo@2x.png. -->
<table cellpadding="0" cellspacing="0" border="0" style="font-family:Lato,Arial,sans-serif;font-size:13px;color:{INK};">
  <tr>
    <td style="padding-right:14px;border-right:2px solid {RED};vertical-align:top;">
      <img src="{{{{logo_url}}}}" width="54" alt="Igongo" style="display:block;border:0;">
    </td>
    <td style="padding-left:14px;vertical-align:top;line-height:1.45;">
      <strong style="font-size:15px;">{{{{full_name}}}}</strong><br>
      <span style="color:{RED};font-weight:bold;">{{{{role}}}}</span><br>
      Igongo Country Hotel &amp; Cultural Centre<br>
      <span style="color:{MUTED};">T</span> {{{{phone}}}} &nbsp;
      <span style="color:{MUTED};">E</span> {{{{email}}}}<br>
      <a href="https://igongo.co.ug" style="color:{RED};text-decoration:none;font-weight:bold;">igongo.co.ug</a>
    </td>
  </tr>
</table>
"""
    (out / "email-signature.html").write_text(html)

    # A picture of the signature for the brand guide.
    mark_svg, _ = logo_at("mark", COLOURWAY["color"], 0, 6, 54 * mw / mh)
    rows = [(f"{SAMPLE['full_name']}", 15, INK, 900), (SAMPLE["role"], 13, RED, 700),
            ("Igongo Country Hotel &amp; Cultural Centre", 13, INK, 400),
            (f"T {SAMPLE['phone']}  ·  E {SAMPLE['email']}", 13, INK, 400), ("igongo.co.ug", 13, RED, 700)]
    text = "".join(label(84, 18 + i * 19, s, t, c, wt) for i, (t, s, c, wt) in enumerate(rows))
    sig = svg_doc(f'<rect width="380" height="110" fill="{WHITE}"/>{mark_svg}'
                  f'<rect x="68" y="4" width="2" height="96" fill="{RED}"/>{text}', 380, 110)
    write_png(out / "preview" / "email-signature.png", sig, 760)


def _watermark(out: Path) -> None:
    """A faint mark for photos and documents, in light and dark versions."""
    for name, cw, alpha in (("light", COLOURWAY["white"], 0.35), ("dark", COLOURWAY["black"], 0.18)):
        body, w, h = LOCKUPS["mark"](cw)
        doc = svg_doc(f'<g opacity="{alpha}">{body}</g>', w, h, title="Igongo watermark")
        write_svg(out / f"watermark-{name}.svg", doc)
        write_png(out / f"watermark-{name}-512.png", doc, 512)


# ---------------------------------------------------------------------------
# Build
# ---------------------------------------------------------------------------

def build_print() -> None:
    """Write every stationery item, its previews and the wristband manifest."""
    out = BRAND / "print"

    # Step 1: wristbands, one file per design, and the list the Wristbands
    # module imports as its starting band designs.
    bands = []
    for kind, (bg, spiral, text, accent, word) in WRISTBANDS.items():
        name = f"wristband-{kind}"
        _save_print(out / "wristbands", name, _wristband(bg, spiral, text, accent, word), 2500, 250,
                    f"Igongo {kind} wristband", 1600)
        bands.append({"id": name, "label": word, "size_mm": [250, 25], "chip": "NFC (as the band type sets)",
                      "fields": ["band_no", "event_name", "event_date", "qr"],
                      "files": {"svg": f"{name}.svg", "pdf": f"{name}-print.pdf"}})
    (out / "wristbands" / "wristbands.json").write_text(json.dumps(bands, indent=2) + "\n")

    # Step 2: the small print items, at exact physical size.
    items = [("qr-sticker", _qr_sticker, 500, 650, "QR sticker"),
             ("business-card-front", _business_card_front, 900, 550, "Business card front"),
             ("business-card-back", _business_card_back, 900, 550, "Business card back"),
             ("name-badge", _name_badge, 750, 250, "Name badge"),
             ("letterhead-a4", _letterhead, 2100, 2970, "Letterhead")]
    for name, design, w, h, title in items:
        _save_print(out, name, design(), w, h, title)

    # Step 3: digital items.
    _receipt_headers(out)
    _email(out)
    _watermark(out)
