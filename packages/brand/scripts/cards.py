"""The ID card template library.

Each template is a front and a back design for a CR80 card (85.6 x 54 mm),
in portrait or landscape. Templates are SVG files with live fields: every
element the printing module fills in carries a `data-field` attribute
(full_name, role, staff_no, photo, qr and so on), and shows sample values
in previews. The super admin assigns templates to roles in the Staff Cards
module, and can clone and change them there without code.

Units are tenths of a millimetre, so a landscape card is 856 x 540.
"""

from __future__ import annotations

import json
import re
from collections.abc import Callable
from dataclasses import dataclass

import cairosvg
from PIL import Image

from brand_kit import BRAND, COLOURWAY, CREAM, INK, NIGHT, RED, RED_DEEP, WHITE, svg_doc, write_png, write_svg
from canvas import field, label, logo_at, nfc_symbol, photo, qr, render

# Card size in tenths of a millimetre, and the corner radius of CR80 cards.
LONG, SHORT, RADIUS = 856, 540, 32
CHARCOAL, MUTED, LINE = "#222323", "#665C56", "#E2D9D1"

# Sample values shown in previews. The printing module replaces them.
SAMPLE = {
    "full_name": "Grace Atuhaire",
    "role": "Front Office Manager",
    "department": "Front Office",
    "staff_no": "IGG-0247",
    "phone": "+256 700 000 247",
    "issue_date": "01 Dec 2026",
    "expiry_date": "30 Nov 2028",
    "card_no": "C-00247",
    "qr": "https://igongo.co.ug/c/IGG-0247",
    "card_label": "STAFF",
    "hotel_phone": "+256 000 000 000",
    "host": "Events Office",
    "valid_on": "12 Dec 2026",
}


# ---------------------------------------------------------------------------
# Shared pieces
# ---------------------------------------------------------------------------

def _rows(x_label: float, x_value: float, y: float, rows: list[tuple[str, str]], size: float = 21,
          colour: str = INK, label_colour: str = MUTED, gap: float = 40, max_width: float = 220) -> str:
    """Label and value pairs, one per line, such as "ID No  IGG-0247"."""
    out = []
    for i, (text, name) in enumerate(rows):
        yy = y + i * gap
        out.append(label(x_label, yy, size * 0.86, text, label_colour, 700))
        out.append(field(x_value, yy, size, name, SAMPLE[name], colour, 700, max_width=max_width))
    return "".join(out)


def _name_role(cx: float, y: float, dark: bool = False, anchor: str = "middle", width: float = 470) -> str:
    """The holder's name and role, the two biggest lines on every card."""
    name_colour, role_colour = (CREAM, "#E07A72") if dark else (INK, RED)
    return (field(cx, y, 40, "full_name", SAMPLE["full_name"], name_colour, 900, anchor, max_width=width)
            + field(cx, y + 44, 25, "role", SAMPLE["role"], role_colour, 700, anchor, max_width=width))


def _terms(cx: float, y: float, colour: str, anchor: str = "middle") -> str:
    """The return notice printed on every back."""
    lines = ["This card belongs to Igongo Country Hotel &amp;",
             "Cultural Centre. Wear it on duty and show it",
             "on request. If found, return it to the main gate."]
    out = [label(cx, y + i * 27, 18, line, colour, 400, anchor) for i, line in enumerate(lines)]
    out.append(label(cx, y + 3 * 27, 18, "Lost card? Call", colour, 700, anchor))
    shift = {"middle": 95, "start": 140, "end": 0}[anchor]
    out.append(field(cx + shift, y + 3 * 27, 18, "hotel_phone", SAMPLE["hotel_phone"], colour, 700, "start"))
    return "".join(out)


def _card(body: str, w: int, h: int, background: str) -> str:
    """Clip a design to the rounded card shape, with its background."""
    return (f'<clipPath id="card"><rect width="{w}" height="{h}" rx="{RADIUS}"/></clipPath>'
            f'<g clip-path="url(#card)"><rect width="{w}" height="{h}" fill="{background}"/>{body}</g>')


# ---------------------------------------------------------------------------
# Portrait fronts (540 x 856)
# ---------------------------------------------------------------------------

def front_wave() -> str:
    """Red wave across the top, round photo on the wave, wave at the foot."""
    W, H = SHORT, LONG
    logo, _ = logo_at("horizontal", COLOURWAY["white"], 60, 38, 420)
    body = (f'<path d="M0,0H{W}V275C400,335 160,235 0,305Z" fill="{RED_DEEP}"/>'
            f'<path d="M0,0H{W}V250C420,310 140,205 0,280Z" fill="{RED}"/>{logo}'
            + photo(155, 180, 230, 230, "circle", CREAM, 12)
            + _name_role(W / 2, 480)
            + f'<rect x="230" y="545" width="80" height="4" rx="2" fill="{RED}"/>'
            + _rows(45, 185, 600, [("ID No", "staff_no"), ("Dept", "department"), ("Phone", "phone")], max_width=190)
            + qr(392, 585, 115, SAMPLE["qr"])
            + f'<path d="M0,{H}V785C150,740 390,820 {W},770V{H}Z" fill="{RED}"/>'
            + nfc_symbol(470, 795, 40, WHITE))
    return _card(body, W, H, CREAM)


def front_diagonal() -> str:
    """Red and charcoal diagonal bands in two corners, on white."""
    W, H = SHORT, LONG
    logo, _ = logo_at("horizontal", COLOURWAY["color"], 36, 40, 300)
    body = (f'<path d="M{W},0V250L400,0Z" fill="{RED}"/><path d="M{W},0V130L470,0Z" fill="{CHARCOAL}"/>'
            f'<path d="M0,{H}V630L240,{H}Z" fill="{RED}"/><path d="M0,{H}V745L115,{H}Z" fill="{CHARCOAL}"/>{logo}'
            + photo(150, 185, 240, 240, "circle", RED, 8)
            + _name_role(W / 2, 495)
            + field(W / 2, 590, 22, "staff_no", SAMPLE["staff_no"], INK, 700, "middle")
            + qr(205, 615, 130, SAMPLE["qr"])
            + field(W / 2, 790, 20, "department", SAMPLE["department"], MUTED, 700, "middle", max_width=300)
            + nfc_symbol(462, 790, 40, CHARCOAL))
    return _card(body, W, H, WHITE)


def front_sidebar() -> str:
    """A red bar down the left with the spiral pattern and a big card label."""
    W, H = SHORT, LONG
    spirals = "".join(logo_at("spiral", COLOURWAY["white"], 18, y, 64)[0] for y in range(30, 840, 110))
    logo, _ = logo_at("horizontal", COLOURWAY["color"], 125, 40, 380)
    body = (f'<rect width="100" height="{H}" fill="{RED}"/><g opacity="0.14">{spirals}</g>'
            f'<g transform="translate(66,{H / 2}) rotate(-90)">'
            + field(0, 0, 46, "card_label", SAMPLE["card_label"], WHITE, 900, "middle", spacing=10)
            + f"</g>{logo}"
            + photo(200, 175, 240, 280, "rounded")
            + _name_role(320, 515, width=400)
            + _rows(125, 255, 625, [("ID No", "staff_no"), ("Dept", "department"), ("Phone", "phone")], max_width=250)
            + qr(410, 730, 110, SAMPLE["qr"])
            + nfc_symbol(130, 780, 44, RED))
    return _card(body, W, H, CREAM)


def front_minimal() -> str:
    """Quiet and elegant: a fine red frame, the mark, a rounded photo."""
    W, H = SHORT, LONG
    mark, _ = logo_at("mark", COLOURWAY["color"], 228, 40, 84)
    body = (f'<rect x="20" y="20" width="{W - 40}" height="{H - 40}" rx="20" fill="none" stroke="{RED}" stroke-width="3"/>{mark}'
            + photo(170, 160, 200, 235, "rounded")
            + _name_role(W / 2, 460)
            + f'<rect x="230" y="525" width="80" height="3" fill="{RED}"/>'
            + field(W / 2, 570, 22, "staff_no", SAMPLE["staff_no"], INK, 700, "middle")
            + field(W / 2, 604, 20, "department", SAMPLE["department"], MUTED, 400, "middle", max_width=400)
            + qr(205, 630, 130, SAMPLE["qr"])
            + nfc_symbol(445, 760, 36, RED)
            + field(W / 2, 800, 16, "card_no", SAMPLE["card_no"], MUTED, 400, "middle"))
    return _card(body, W, H, CREAM)


def front_executive() -> str:
    """Dark and formal, for the board and management."""
    W, H = SHORT, LONG
    logo, _ = logo_at("horizontal", COLOURWAY["reversed"], 60, 40, 420)
    body = (f"{logo}<rect x=\"60\" y=\"172\" width=\"{W - 120}\" height=\"2\" fill=\"{RED}\"/>"
            + photo(150, 205, 240, 240, "circle", RED, 6)
            + _name_role(W / 2, 515, dark=True)
            + f'<rect x="160" y="585" width="220" height="42" rx="21" fill="{RED}"/>'
            + field(W / 2, 614, 19, "card_label", "MANAGEMENT", WHITE, 900, "middle", spacing=3)
            + field(W / 2, 672, 22, "staff_no", SAMPLE["staff_no"], CREAM, 700, "middle")
            + qr(210, 700, 120, SAMPLE["qr"])
            + nfc_symbol(455, 780, 36, CREAM))
    return _card(body, W, H, NIGHT)


def front_visitor() -> str:
    """For visitors and day passes: no photo, a big label and a big QR."""
    W, H = SHORT, LONG
    logo, _ = logo_at("horizontal", COLOURWAY["white"], 60, 48, 420)
    body = (f'<rect width="{W}" height="200" fill="{RED}"/>{logo}'
            + field(W / 2, 300, 74, "card_label", "VISITOR", RED, 900, "middle", spacing=6)
            + _rows(70, 230, 370, [("Host", "host"), ("Valid on", "valid_on"), ("Pass No", "card_no")], size=22)
            + qr(135, 490, 270, SAMPLE["qr"])
            + nfc_symbol(250, 780, 40, RED)
            + f'<rect y="{H - 36}" width="{W}" height="36" fill="{RED}"/>')
    return _card(body, W, H, CREAM)


# ---------------------------------------------------------------------------
# Landscape fronts (856 x 540)
# ---------------------------------------------------------------------------

def front_classic() -> str:
    """Red header with the white logo and the card label."""
    W, H = LONG, SHORT
    logo, _ = logo_at("horizontal", COLOURWAY["white"], 30, 28, 330)
    body = (f'<rect width="{W}" height="150" fill="{RED}"/>{logo}'
            + field(820, 96, 30, "card_label", SAMPLE["card_label"], WHITE, 900, "end", spacing=4)
            + photo(40, 185, 210, 260, "rounded")
            + _name_role(280, 232, anchor="start", width=340)
            + field(280, 312, 21, "department", SAMPLE["department"], MUTED, 700, max_width=340)
            + _rows(280, 420, 380, [("ID No", "staff_no"), ("Phone", "phone"), ("Expires", "expiry_date")], max_width=200)
            + qr(650, 230, 170, SAMPLE["qr"])
            + nfc_symbol(715, 425, 40, RED)
            + f'<rect y="{H - 32}" width="{W}" height="32" fill="{RED}"/>')
    return _card(body, W, H, CREAM)


def front_curves() -> str:
    """Red and charcoal swooshes in opposite corners, with a label pill."""
    W, H = LONG, SHORT
    logo, _ = logo_at("horizontal", COLOURWAY["color"], 36, 30, 300)
    body = (f'<path d="M470,0H{W}V190C760,130 630,45 470,0Z" fill="{RED}"/>'
            f'<path d="M610,0H{W}V95C780,65 700,22 610,0Z" fill="{CHARCOAL}"/>'
            f'<path d="M0,{H}V400C120,480 260,525 430,{H}Z" fill="{RED}"/>'
            f'<path d="M0,{H}V475C80,510 160,530 250,{H}Z" fill="{CHARCOAL}"/>{logo}'
            + f'<rect x="36" y="140" width="230" height="40" rx="20" fill="{RED}"/>'
            + field(151, 167, 18, "card_label", "STAFF ID CARD", WHITE, 900, "middle", spacing=2)
            + photo(50, 200, 190, 220, "rounded")
            + _name_role(275, 250, anchor="start", width=340)
            + _rows(275, 410, 345, [("ID No", "staff_no"), ("Dept", "department"), ("Phone", "phone")], max_width=200)
            + qr(650, 215, 165, SAMPLE["qr"])
            + nfc_symbol(770, 460, 40, CHARCOAL))
    return _card(body, W, H, CREAM)


def front_split() -> str:
    """A red panel on the left with the mark and photo, details on the right."""
    W, H = LONG, SHORT
    spirals = "".join(logo_at("spiral", COLOURWAY["white"], x, y, 70)[0]
                      for x in (20, 200) for y in (20, 440))
    mark, _ = logo_at("mark", COLOURWAY["white"], 112, 26, 76)
    logo, _ = logo_at("horizontal", COLOURWAY["color"], 330, 34, 380)
    body = (f'<rect width="300" height="{H}" fill="{RED}"/><g opacity="0.12">{spirals}</g>{mark}'
            + photo(50, 140, 200, 200, "circle", CREAM, 8)
            + field(150, 395, 24, "staff_no", SAMPLE["staff_no"], WHITE, 900, "middle")
            + field(150, 430, 18, "department", SAMPLE["department"], CREAM, 700, "middle", max_width=250)
            + logo
            + _name_role(335, 232, anchor="start", width=480)
            + _rows(335, 470, 345, [("Phone", "phone"), ("Issued", "issue_date"), ("Expires", "expiry_date")], max_width=170)
            + qr(675, 315, 145, SAMPLE["qr"])
            + nfc_symbol(335, 465, 34, RED)
            + label(380, 490, 17, "Tap or scan", MUTED, 700))
    return _card(body, W, H, CREAM)


def front_banner() -> str:
    """Charcoal header with a coloured label, for casual workers,
    contractors and interns."""
    W, H = LONG, SHORT
    logo, _ = logo_at("horizontal", COLOURWAY["reversed"], 30, 28, 320)
    body = (f'<rect width="{W}" height="160" fill="{CHARCOAL}"/>{logo}'
            + f'<rect x="590" y="52" width="235" height="56" rx="28" fill="{RED}"/>'
            + field(707, 89, 23, "card_label", "CONTRACTOR", WHITE, 900, "middle", spacing=2)
            + photo(45, 195, 200, 200, "circle", RED, 6)
            + _name_role(280, 245, anchor="start", width=360)
            + field(280, 325, 21, "department", SAMPLE["department"], MUTED, 700, max_width=360)
            + _rows(280, 430, 385, [("ID No", "staff_no"), ("Valid until", "expiry_date"), ("Phone", "phone")], max_width=200)
            + qr(675, 220, 150, SAMPLE["qr"])
            + nfc_symbol(730, 400, 40, CHARCOAL)
            + f'<rect y="{H - 30}" width="{W}" height="30" fill="{RED}"/>')
    return _card(body, W, H, CREAM)


# ---------------------------------------------------------------------------
# Backs
# ---------------------------------------------------------------------------

def back_portrait(dark: bool = False) -> str:
    """Portrait back: logo, a large QR to verify the card, the return
    notice, dates and the tap symbol."""
    W, H = SHORT, LONG
    text, muted = (CREAM, "#B3A69F") if dark else (INK, MUTED)
    logo, _ = logo_at("horizontal", COLOURWAY["reversed" if dark else "color"], 60, 40, 420)
    sp, _ = logo_at("spiral", COLOURWAY["red"], 300, 420, 300)
    body = (f'<g opacity="0.06">{sp}</g>{logo}'
            + qr(150, 180, 240, SAMPLE["qr"])
            + label(W / 2, 460, 18, "Scan to check this card", muted, 700, "middle")
            + _terms(W / 2, 520, text)
            + _rows(150, 290, 680, [("Issued", "issue_date"), ("Expires", "expiry_date"), ("Card No", "card_no")],
                    size=19, colour=text, label_colour=muted, gap=34)
            + nfc_symbol(150, 782, 30, RED)
            + label(190, 803, 17, "Tap or scan at any Igongo station", muted, 700)
            + f'<rect y="{H - 26}" width="{W}" height="26" fill="{RED}"/>')
    return _card(body, W, H, NIGHT if dark else CREAM)


def back_landscape() -> str:
    """Landscape back: QR on the left, logo, notice and dates on the right."""
    W, H = LONG, SHORT
    logo, _ = logo_at("horizontal", COLOURWAY["color"], 360, 34, 420)
    body = (qr(50, 110, 260, SAMPLE["qr"])
            + label(180, 400, 18, "Scan to check this card", MUTED, 700, "middle")
            + logo + _terms(360, 200, INK, "start")
            + _rows(360, 500, 350, [("Issued", "issue_date"), ("Expires", "expiry_date"), ("Card No", "card_no")],
                    size=19, gap=34)
            + nfc_symbol(50, 452, 30, RED)
            + label(92, 474, 17, "Tap or scan at any Igongo station", MUTED, 700)
            + f'<rect y="{H - 26}" width="{W}" height="26" fill="{RED}"/>')
    return _card(body, W, H, CREAM)


# ---------------------------------------------------------------------------
# The library
# ---------------------------------------------------------------------------

@dataclass(frozen=True)
class Template:
    """One card design: its front, its back and who it suits."""

    id: str
    name: str
    orientation: str
    front: Callable[[], str]
    back: Callable[[], str]
    suits: str


TEMPLATES = [
    Template("portrait-wave", "Wave", "portrait", front_wave, back_portrait,
             "Default for all staff."),
    Template("portrait-diagonal", "Diagonal", "portrait", front_diagonal, back_portrait,
             "Guest-facing staff: front office, restaurant, events, sales."),
    Template("portrait-sidebar", "Sidebar", "portrait", front_sidebar, back_portrait,
             "Operations: maintenance, housekeeping, security, grounds. The bar label can show the department."),
    Template("portrait-minimal", "Minimal", "portrait", front_minimal, back_portrait,
             "Museum, cultural centre and spa staff."),
    Template("portrait-executive", "Executive", "portrait", front_executive, lambda: back_portrait(dark=True),
             "Board members, CEO, GM and senior managers."),
    Template("portrait-visitor", "Visitor", "portrait", front_visitor, back_portrait,
             "Visitors, suppliers and day passes, with no photo."),
    Template("landscape-classic", "Classic", "landscape", front_classic, back_landscape,
             "Default landscape card for all staff."),
    Template("landscape-curves", "Curves", "landscape", front_curves, back_landscape,
             "Front office, sales and guest relations."),
    Template("landscape-split", "Split", "landscape", front_split, back_landscape,
             "Kitchen, restaurant, bars and coffee shops."),
    Template("landscape-banner", "Banner", "landscape", front_banner, back_landscape,
             "Casual workers, contractors and interns. The label shows the card type."),
]

# Card types are data. Today's cards are NTAG213; others can be added later
# in the Staff Cards module without code. Saved here as the starting list.
CARD_TYPES = [
    {"id": "cr80-ntag213", "name": "CR80 PVC card with NXP NTAG213 (current cards)", "active": True,
     "size_mm": [85.6, 54.0], "corner_radius_mm": 3.18,
     "chip": {"model": "NXP NTAG213", "standard": "ISO 14443-3A, NFC Forum Type 2",
              "memory_bytes": 180, "user_memory_bytes": 144, "uid_bytes": 7},
     "encode": {"write": "NDEF URL with a secure card ID", "password_lock": True,
                "check_originality_signature": True, "use_tap_counter": True}},
    {"id": "cr80-ntag424dna", "name": "CR80 PVC card with NXP NTAG 424 DNA (recommended next order)",
     "active": False, "size_mm": [85.6, 54.0], "corner_radius_mm": 3.18,
     "chip": {"model": "NXP NTAG 424 DNA", "standard": "ISO 14443-4, NFC Forum Type 4",
              "memory_bytes": 416, "secure_messaging": "AES-128, a new signed code on every tap (SUN)"},
     "encode": {"write": "SUN URL with a secure card ID", "password_lock": True,
                "check_originality_signature": True, "use_tap_counter": True}},
]


def _doc(body: str, orientation: str, physical: bool = False) -> str:
    """Wrap a card design in an SVG document, sized in millimetres when
    `physical` is set (for print PDFs), otherwise in tenths of a mm."""
    w, h = (LONG, SHORT) if orientation == "landscape" else (SHORT, LONG)
    doc = svg_doc(body, w, h, title="Igongo ID card")
    if physical:
        doc = doc.replace(f'width="{w:g}" height="{h:g}"', f'width="{w / 10:g}mm" height="{h / 10:g}mm"', 1)
    return doc


def build_cards() -> None:
    """Write every template as SVG, PNG previews and print-ready PDFs, plus
    the manifest the Staff Cards module imports, and an overview sheet."""
    out = BRAND / "cards"
    manifest = []
    previews = []
    for tpl in TEMPLATES:
        folder = out / tpl.id
        entry = {"id": tpl.id, "name": tpl.name, "orientation": tpl.orientation,
                 "card_type": "cr80-ntag213", "suits": tpl.suits,
                 "print": {"width_mm": 85.6 if tpl.orientation == "landscape" else 54.0,
                           "height_mm": 54.0 if tpl.orientation == "landscape" else 85.6,
                           "dpi": 300, "margins_mm": 0, "duplex": True, "scale": "actual size"},
                 "files": {}, "fields": []}
        for side, design in (("front", tpl.front), ("back", tpl.back)):
            body = design()
            doc = _doc(body, tpl.orientation)
            write_svg(folder / f"{tpl.id}-{side}.svg", doc)
            write_png(folder / f"{tpl.id}-{side}.png", doc, 1012 if tpl.orientation == "landscape" else 638)
            cairosvg.svg2pdf(bytestring=_doc(body, tpl.orientation, physical=True).encode(),
                             write_to=str(folder / f"{tpl.id}-{side}-print.pdf"))
            entry["files"][side] = {"svg": f"{tpl.id}/{tpl.id}-{side}.svg",
                                    "pdf": f"{tpl.id}/{tpl.id}-{side}-print.pdf"}
            entry["fields"] += re.findall(r'data-field="([a-z_]+)"', body)
            previews.append((tpl, side, doc))
        entry["fields"] = sorted(set(entry["fields"]))
        manifest.append(entry)
    (out / "templates.json").write_text(json.dumps(manifest, indent=2) + "\n")
    (out / "card-types.json").write_text(json.dumps(CARD_TYPES, indent=2) + "\n")
    _overview(previews, out)


def _overview(previews: list, out) -> None:
    """One image with every template, front and back side by side: portrait
    pairs three to a row, then landscape pairs two to a row."""
    gap = 20
    pairs = []
    for i in range(0, len(previews), 2):
        tpl = previews[i][0]
        size = 300 if tpl.orientation == "portrait" else 380
        pairs.append((tpl.orientation, [render(doc, size) for _, _, doc in previews[i:i + 2]]))

    # Step 1: group the pairs into rows by orientation.
    rows = []
    for orientation, per_row in (("portrait", 3), ("landscape", 2)):
        group = [imgs for o, imgs in pairs if o == orientation]
        rows += [group[i:i + per_row] for i in range(0, len(group), per_row)]

    # Step 2: size the sheet to the widest row and the sum of row heights.
    def row_w(row):
        return sum(a.width + b.width + 3 * gap for a, b in row) + gap
    width = max(row_w(r) for r in rows)
    height = sum(max(a.height for a, _ in r) + gap for r in rows) + gap
    sheet = Image.new("RGB", (width, height), "#D9D2CB")

    # Step 3: paste each pair, front then back.
    y = gap
    for row in rows:
        x = gap
        for front, back in row:
            sheet.paste(front, (x, y), front)
            sheet.paste(back, (x + front.width + gap, y), back)
            x += front.width + back.width + 3 * gap
        y += max(a.height for a, _ in row) + gap
    (out / "preview").mkdir(parents=True, exist_ok=True)
    sheet.save(out / "preview" / "card-library.png")
