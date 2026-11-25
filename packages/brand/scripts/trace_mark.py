"""Trace the original Igongo mark into the master vector file.

This is a one-time step. It reads the hotel's original raster mark
(`originals/igongo-original-mark-color.png`), separates its red and black
ink, traces each with potrace into smooth Bezier curves, and writes
`source/igongo-mark.svg` with one named path per part of the mark:

    spiral      the red spiral
    horn-left   the left horn
    horn-right  the right horn
    cup         the striped cup with the "Z" stripes

Every other brand asset is built from that master by `build_brand.py`, so
this script only needs to run again if the hotel supplies a better original.

Usage:
    python packages/brand/scripts/trace_mark.py
"""

from pathlib import Path

import numpy as np
import potrace
from PIL import Image, ImageFilter

# Folder layout, relative to packages/brand/.
BRAND = Path(__file__).resolve().parents[1]
ORIGINAL = BRAND / "originals" / "igongo-original-mark-color.png"
MASTER = BRAND / "source" / "igongo-mark.svg"

# Upscale factor before tracing. A larger value gives smoother curves.
SCALE = 8

# The master's coordinate box. The traced art is shifted down by Y_SHIFT so
# that nothing sits above y = 0.
VIEW_W, VIEW_H, Y_SHIFT = 200, 235, 1.0


def ink_mask(img: Image.Image, ink: str) -> np.ndarray:
    """Return a smooth, upscaled boolean mask of the red or the black ink.

    Red is detected by how much the red channel exceeds green. Black is any
    dark pixel that is not red. Both are weighted by the pixel's alpha.
    """
    px = np.asarray(img.convert("RGBA")).astype(float)
    r, g, b, alpha = px[..., 0], px[..., 1], px[..., 2], px[..., 3] / 255
    redness = np.clip((r - g - 40) / 80, 0, 1)

    # Step 1: pick the ink.
    if ink == "red":
        weight = redness * alpha
    else:
        darkness = np.clip((120 - (r + g + b) / 3) / 100, 0, 1)
        weight = darkness * (1 - redness) * alpha

    # Step 2: upscale and blur slightly, so the trace follows smooth edges
    # instead of the original pixel steps.
    mask = Image.fromarray((weight * 255).astype("uint8"))
    mask = mask.resize((mask.width * SCALE, mask.height * SCALE), Image.LANCZOS)
    mask = mask.filter(ImageFilter.GaussianBlur(SCALE * 0.6))

    # Step 3: threshold at 50% to get the final shape.
    return np.asarray(mask) > 127


def trace(mask: np.ndarray) -> list[str]:
    """Trace a mask and return one SVG path string per closed shape."""
    # potracer treats False as ink, so the mask is inverted first.
    curves = potrace.Bitmap(~mask).trace(
        turdsize=40, alphamax=1.1, opticurve=True, opttolerance=0.3
    )

    def pt(p) -> str:
        """Format a traced point back in the original pixel scale."""
        return f"{p.x / SCALE:.2f},{p.y / SCALE + Y_SHIFT:.2f}"

    shapes = []
    for curve in curves:
        d = ["M" + pt(curve.start_point)]
        for seg in curve.segments:
            if seg.is_corner:
                d.append("L" + pt(seg.c) + "L" + pt(seg.end_point))
            else:
                d.append(f"C{pt(seg.c1)} {pt(seg.c2)} {pt(seg.end_point)}")
        shapes.append("".join(d) + "Z")
    return shapes


def top_and_left(shape: str) -> tuple[float, float]:
    """Return the smallest y and x of a path, used to tell the parts apart."""
    nums = [float(n) for n in shape.replace("M", " ").replace("C", " ")
            .replace("L", " ").replace("Z", " ").replace(",", " ").split()]
    return min(nums[1::2]), min(nums[0::2])


def main() -> None:
    """Trace the original and write the master SVG with named parts."""
    img = Image.open(ORIGINAL)

    # The red ink is a single shape: the spiral.
    spiral = trace(ink_mask(img, "red"))

    # The black ink holds the two horns (top half) and the cup (bottom half).
    horns, cup = [], []
    for shape in trace(ink_mask(img, "black")):
        top, left = top_and_left(shape)
        (horns if top < VIEW_H * 0.5 else cup).append((left, shape))
    horns.sort()  # Left horn first.

    parts = {
        "spiral": "".join(spiral),
        "horn-left": horns[0][1],
        "horn-right": horns[1][1],
        "cup": "".join(s for _, s in cup),
    }
    paths = "\n".join(f'  <path id="{k}" d="{v}"/>' for k, v in parts.items())
    MASTER.write_text(
        "<!-- Igongo mark, master vector. Traced from the hotel's original by"
        " scripts/trace_mark.py. Do not edit by hand. -->\n"
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {VIEW_W} {VIEW_H}">\n'
        f"{paths}\n</svg>\n"
    )
    print(f"Wrote {MASTER.relative_to(BRAND)}")


if __name__ == "__main__":
    main()
