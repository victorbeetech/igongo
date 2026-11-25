"""Logo lockups: the fixed arrangements of mark, name and subtitle.

Each function returns (svg body, width, height) for one colourway, laid
out from the same proportions every time, so every logo file in every
size and colour matches.
"""

from brand_kit import MARK_H, MARK_W, Colourway, mark, mark_parts, name_face, sub_face, text_at_size, text_block

# Subtitle lines, exactly as on the hotel's logo.
SUB_LINES = ("COUNTRY HOTEL &", "CULTURAL CENTRE")
NAME = "IGONGO"

# Letter spacing for each line, as a fraction of the font size.
NAME_TRACKING = 0.04
SUB_TRACKING = 0.06

# Clear space around every lockup, as a fraction of the mark height.
CLEAR = 0.08


def _sub_lines(cw: Colourway, x: float, top: float, width: float, align: str,
               attrs: dict | None = None, centres: dict | None = None) -> tuple[str, float]:
    """Set the two subtitle lines at one shared size, the wider line filling
    `width`. Returns (svg, bottom y). `attrs` and `centres` are passed to
    `text_block` for letter-by-letter animation (keys sub0-n and sub1-n)."""
    face = sub_face()
    widths = [text_at_size(face, line, 100, SUB_TRACKING) for line in SUB_LINES]
    size = 100 * width / max(widths)
    svg, y = [], top
    for i, line in enumerate(SUB_LINES):
        line_w = text_at_size(face, line, size, SUB_TRACKING)
        key = f"sub{i}" if attrs is not None or centres is not None else None
        part, cap = text_block(face, line, line_w, cw.sub_text, x, y, SUB_TRACKING,
                               align=align, box=width, key=key, attrs=attrs, centres=centres)
        svg.append(part)
        y += cap * 1.6  # Line pitch: 1.6 x cap height.
    return "".join(svg), y - cap * 0.6


def stacked(cw: Colourway, part_transforms: dict | None = None,
            part_opacity: dict | None = None, letter_attrs: dict | None = None,
            centres: dict | None = None) -> tuple[str, float, float]:
    """Mark on top, IGONGO below it, then the two subtitle lines.

    The optional arguments are used by the animations: `part_transforms` and
    `part_opacity` move or fade parts of the mark. When `letter_attrs` or
    `centres` is given, every letter is drawn in its own group (keys name-n,
    sub0-n and sub1-n), with its attributes from `letter_attrs`, and the
    letter centres are written into `centres`.
    """
    by_letter = letter_attrs is not None or centres is not None
    W, mark_h, text_w = 1000.0, 600.0, 880.0
    pad = mark_h * CLEAR
    mark_w = MARK_W * mark_h / MARK_H

    # Step 1: the mark, centred at the top.
    body = [mark(cw, (W - mark_w) / 2, pad, mark_h, part_transforms, part_opacity)]

    # Step 2: IGONGO, as wide as the text column.
    name_top = pad + mark_h + 70
    name_svg, name_h = text_block(name_face(), NAME, text_w, cw.name_text,
                                  (W - text_w) / 2, name_top, NAME_TRACKING,
                                  key="name" if by_letter else None, attrs=letter_attrs, centres=centres)
    body.append(name_svg)

    # Step 3: the subtitle, the same width, centred.
    sub_svg, bottom = _sub_lines(cw, (W - text_w) / 2, name_top + name_h + 48, text_w, "center",
                                 letter_attrs if by_letter else None, centres)
    body.append(sub_svg)
    return "".join(body), W, bottom + pad


def horizontal(cw: Colourway, part_transforms: dict | None = None,
               part_opacity: dict | None = None, letter_attrs: dict | None = None,
               centres: dict | None = None) -> tuple[str, float, float]:
    """Mark on the left, a fine divider, then IGONGO and the subtitle.

    The optional arguments work as in `stacked`. The divider can also be
    animated: its attributes come from `letter_attrs["divider"]`, and its
    centre is written to `centres["divider"]`.
    """
    by_letter = letter_attrs is not None or centres is not None
    mark_h = 300.0
    pad = mark_h * CLEAR
    mark_w = MARK_W * mark_h / MARK_H

    # Step 1: the mark.
    body = [mark(cw, pad, pad, mark_h, part_transforms, part_opacity)]

    # Step 2: the divider, a thin spindle as tall as the mark.
    dx = pad + mark_w + 40
    top, bottom, mid = pad + 6, pad + mark_h - 6, pad + mark_h / 2
    if centres is not None:
        centres["divider"] = (dx, mid)
    body.append(f'<g {(letter_attrs or {}).get("divider", "")}><path fill="{cw.name_text}" '
                f'd="M{dx},{top} Q{dx + 4.5},{mid} {dx},{bottom} Q{dx - 4.5},{mid} {dx},{top}Z"/></g>')

    # Step 3: IGONGO, sized so its capitals are 36% of the mark height.
    text_x = dx + 40
    probe_w = text_at_size(name_face(), NAME, 100, NAME_TRACKING)
    _, probe_h = text_block(name_face(), NAME, probe_w, cw.name_text, 0, 0, NAME_TRACKING)
    name_w = probe_w * (mark_h * 0.36) / probe_h
    # The text block (name + subtitle) is centred on the mark's height.
    block_h = mark_h * 0.36 + 34 + mark_h * 0.36 * 0.92
    name_top = pad + (mark_h - block_h) / 2
    name_svg, name_h = text_block(name_face(), NAME, name_w, cw.name_text, text_x, name_top,
                                  NAME_TRACKING, align="left", key="name" if by_letter else None,
                                  attrs=letter_attrs, centres=centres)
    body.append(name_svg)

    # Step 4: the subtitle, as wide as the name, left aligned.
    sub_svg, _ = _sub_lines(cw, text_x, name_top + name_h + 34, name_w, "left",
                            letter_attrs if by_letter else None, centres)
    body.append(sub_svg)
    return "".join(body), text_x + name_w + pad, mark_h + 2 * pad


def mark_only(cw: Colourway) -> tuple[str, float, float]:
    """The emblem alone: spiral, horns and cup."""
    mark_h = 600.0
    pad = mark_h * CLEAR
    mark_w = MARK_W * mark_h / MARK_H
    return mark(cw, pad, pad, mark_h), mark_w + 2 * pad, mark_h + 2 * pad


def spiral_only(cw: Colourway) -> tuple[str, float, float]:
    """The spiral alone, for very small spaces and as a graphic motif."""
    # The spiral's own box inside the master, measured from the traced art.
    x0, y0, x1, y1 = 40.8, 0.9, 159.2, 117.0
    size = 600.0
    k = size / (x1 - x0)
    pad = size * CLEAR
    d = mark_parts()["spiral"]
    body = (f'<path fill="{cw.spiral}" transform="translate({pad - x0 * k:.2f},{pad - y0 * k:.2f}) '
            f'scale({k:.5f})" d="{d}"/>')
    return body, size + 2 * pad, (y1 - y0) * k + 2 * pad


def wordmark(cw: Colourway) -> tuple[str, float, float]:
    """IGONGO and the subtitle, without the mark."""
    W, text_w = 1000.0, 880.0
    pad = 60.0
    name_svg, name_h = text_block(name_face(), NAME, text_w, cw.name_text,
                                  (W - text_w) / 2, pad, NAME_TRACKING)
    sub_svg, bottom = _sub_lines(cw, (W - text_w) / 2, pad + name_h + 48, text_w, "center")
    return name_svg + sub_svg, W, bottom + pad


def name_only(cw: Colourway) -> tuple[str, float, float]:
    """IGONGO alone, for headers and tight horizontal spaces."""
    text_w, pad = 1000.0, 50.0
    svg, h = text_block(name_face(), NAME, text_w, cw.name_text, pad, pad, NAME_TRACKING)
    return svg, text_w + 2 * pad, h + 2 * pad


# Every lockup, by its file name, in the order the brand guide lists them.
LOCKUPS = {
    "stacked": stacked,
    "horizontal": horizontal,
    "mark": mark_only,
    "spiral": spiral_only,
    "wordmark": wordmark,
    "name": name_only,
}
