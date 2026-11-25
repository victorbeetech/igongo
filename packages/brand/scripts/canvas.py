"""Shared drawing helpers for the brand build: rendering, opaque saving,
centred marks and placed logos. Used by every asset builder."""

from __future__ import annotations

import io
from pathlib import Path

import cairosvg
from PIL import Image

from brand_kit import MARK_H, MARK_W, Colourway, mark, svg_doc
from lockups import LOCKUPS


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


def logo_at(lockup: str, cw: Colourway, x: float, y: float, width: float) -> tuple[str, float]:
    """Return a lockup placed at (x, y) and scaled to `width`, and its height."""
    body, w, h = LOCKUPS[lockup](cw)
    k = width / w
    return f'<g transform="translate({x},{y}) scale({k:.5f})">{body}</g>', h * k


# ---------------------------------------------------------------------------
# Print helpers: live fields, QR codes, photos and the NFC symbol
# ---------------------------------------------------------------------------

def field(x: float, y: float, size: float, name: str, sample: str, fill: str, weight: int = 400,
          anchor: str = "start", family: str = "Lato", max_width: float | None = None,
          spacing: float = 0) -> str:
    """A live text field for a print template.

    `data-field` names the value the printing module fills in (such as
    full_name); `sample` is shown in previews. `data-max-width` tells the
    printer to shrink long values so they fit.
    """
    fit = f' data-max-width="{max_width:g}"' if max_width else ""
    track = f' letter-spacing="{spacing:g}"' if spacing else ""
    return (f'<text data-field="{name}"{fit}{track} x="{x:g}" y="{y:g}" font-family="{family}, sans-serif" '
            f'font-size="{size:g}" font-weight="{weight}" fill="{fill}" text-anchor="{anchor}">{sample}</text>')


def label(x: float, y: float, size: float, text: str, fill: str, weight: int = 400,
          anchor: str = "start", family: str = "Lato", spacing: float = 0) -> str:
    """Fixed text that is the same on every printed copy."""
    track = f' letter-spacing="{spacing:g}"' if spacing else ""
    return (f'<text x="{x:g}" y="{y:g}" font-family="{family}, sans-serif" font-size="{size:g}" '
            f'font-weight="{weight}" fill="{fill}" text-anchor="{anchor}"{track}>{text}</text>')


def qr(x: float, y: float, size: float, data: str, fill: str = "#000000",
       background: str = "#FFFFFF", name: str = "qr") -> str:
    """A real, scannable QR code drawn as vector squares.

    `data` is the sample content for previews. The printing module replaces
    the group marked `data-field="qr"` with the holder's own code.
    """
    import qrcode  # Imported here so the logo build does not need it.

    code = qrcode.QRCode(border=0, error_correction=qrcode.constants.ERROR_CORRECT_M)
    code.add_data(data)
    code.make(fit=True)
    cells = code.get_matrix()
    n = len(cells)
    quiet = size * 0.08  # White margin so scanners can find the code.
    k = (size - 2 * quiet) / n
    squares = "".join(f"M{c},{r}h1v1h-1z" for r, row in enumerate(cells) for c, on in enumerate(row) if on)
    return (f'<g data-field="{name}"><rect x="{x:g}" y="{y:g}" width="{size:g}" height="{size:g}" rx="{size * 0.04:g}" '
            f'fill="{background}"/><path fill="{fill}" transform="translate({x + quiet:.2f},{y + quiet:.2f}) '
            f'scale({k:.4f})" d="{squares}"/></g>')


_CLIP_IDS = iter(range(1, 10_000))


def photo(x: float, y: float, w: float, h: float, shape: str = "circle", ring: str | None = None,
          ring_width: float = 0) -> str:
    """The holder's photo. Previews show a neutral silhouette.

    shape is "circle" or "rounded". The printing module replaces the group
    marked `data-field="photo"` with the real photo, clipped the same way.
    """
    cid = f"photo-clip-{next(_CLIP_IDS)}"
    if shape == "circle":
        clip = f'<circle cx="{x + w / 2:g}" cy="{y + h / 2:g}" r="{w / 2:g}"/>'
    else:
        clip = f'<rect x="{x:g}" y="{y:g}" width="{w:g}" height="{h:g}" rx="{w * 0.08:g}"/>'
    cx, head_r = x + w / 2, w * 0.19
    silhouette = (f'<rect x="{x:g}" y="{y:g}" width="{w:g}" height="{h:g}" fill="#E2D9D1"/>'
                  f'<circle cx="{cx:g}" cy="{y + h * 0.40:g}" r="{head_r:g}" fill="#B3A69F"/>'
                  f'<ellipse cx="{cx:g}" cy="{y + h * 0.95:g}" rx="{w * 0.36:g}" ry="{h * 0.30:g}" fill="#B3A69F"/>')
    border = ""
    if ring:
        border = clip.replace("/>", f' fill="none" stroke="{ring}" stroke-width="{ring_width:g}"/>')
    return (f'<g data-field="photo" data-shape="{shape}"><clipPath id="{cid}">{clip}</clipPath>'
            f'<g clip-path="url(#{cid})">{silhouette}</g>{border}</g>')


def nfc_symbol(x: float, y: float, size: float, fill: str) -> str:
    """The contactless symbol: a dot and three arcs, so people know to tap."""
    s = size / 24
    arcs = "".join(f'<path d="M{6 + 4 * i},{4 + i * 0.5} q{5 + i * 1.5},8 0,{16 - i}" fill="none" '
                   f'stroke="{fill}" stroke-width="2" stroke-linecap="round"/>' for i in range(3))
    return (f'<g transform="translate({x:g},{y:g}) scale({s:.4f})">'
            f'<circle cx="3.5" cy="12" r="2" fill="{fill}"/>{arcs}</g>')
