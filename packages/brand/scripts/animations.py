"""Renders the logo animations defined in `motion.py` to animated SVG,
Lottie, GIF and MP4."""

from __future__ import annotations

import re
import subprocess
import tempfile
from pathlib import Path

from brand_kit import (
    BRAND,
    COLOURWAY,
    CREAM,
    MARK_H,
    MARK_W,
    NIGHT,
    SPIRAL_POLE,
    Colourway,
    mark,
    mark_parts,
    svg_doc,
    write_png,
    write_svg,
)
from lockups import horizontal, stacked
from motion import ANIMATIONS, Animation, intro_horizontal, intro_stacked, lottie, smil_wrap

TEXT_INTROS = {"intro-stacked": stacked, "intro-horizontal": horizontal}


def _letter_centres(lockup) -> dict:
    """Return the centre of every animated letter (and the divider) of a
    lockup. The layout is the same in every colourway."""
    centres: dict = {}
    lockup(COLOURWAY["color"], centres=centres)
    return centres


def _anim_scene(anim: Animation, cw: Colourway, t: float | None) -> tuple[str, float, float]:
    """Return (svg body, width, height) for an animation, either frozen at
    time `t` (for frames) or with SMIL animation (when t is None)."""
    parts = mark_parts()
    fills = {"spiral": cw.spiral, "horn-left": cw.ink, "horn-right": cw.ink, "cup": cw.ink}

    if anim.name in TEXT_INTROS:
        lockup = TEXT_INTROS[anim.name]
        if t is None:
            # Draw the lockup with an id on every part and letter, then wrap
            # each one in its SMIL animation.
            keys = {k: f'id="{k}"' for k in _letter_centres(lockup)}
            body, w, h = lockup(cw, letter_attrs=keys)
            body = re.sub(r'<path id="(spiral|horn-left|horn-right|cup)" ([^>]*)/>',
                          lambda m: smil_wrap(anim, m[1], f"<path {m[2]}/>"), body)
            body = re.sub(r'<g id="([\w-]+)">(<path [^>]*/>)</g>',
                          lambda m: smil_wrap(anim, m[1], m[2]), body)
            return body, w, h
        transforms, opacity = anim.state(t)
        letters = {k: f'transform="{transforms.get(k, "")}" opacity="{opacity.get(k, 1.0):.3f}"'
                   for k in _letter_centres(lockup)}
        return lockup(cw, transforms, opacity, letters)

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
    animations = ANIMATIONS + [intro_stacked(_letter_centres(stacked)),
                               intro_horizontal(_letter_centres(horizontal))]
    for anim in animations:
        folder = BRAND / "animation" / anim.name
        stem = f"igongo-{anim.name}"

        # Animated SVG (SMIL), transparent, in both colourways.
        for theme, cw in (("light", COLOURWAY["color"]), ("dark", COLOURWAY["reversed"])):
            body, w, h = _anim_scene(anim, cw, None)
            write_svg(folder / f"{stem}-{theme}.svg", svg_doc(body, w, h, title=f"Igongo {anim.name}"))

        # Lottie JSON for the Flutter app (not for the intros with text, which
        # use their GIF or video instead).
        if anim.name not in TEXT_INTROS:
            for theme, cw in (("light", COLOURWAY["color"]), ("dark", COLOURWAY["reversed"])):
                fills = {"spiral": cw.spiral, "horn-left": cw.ink, "horn-right": cw.ink, "cup": cw.ink}
                if anim.name == "loader-spiral":
                    px, py = SPIRAL_POLE
                    view, fills = (px - 64, py - 64, 128, 128), {"spiral": cw.spiral}
                else:
                    view = (-16, -16, MARK_W + 32, MARK_H + 32)
                (folder / f"{stem}-{theme}.json").write_text(lottie(anim, fills, view))

        # GIF and MP4 on light and dark backgrounds.
        width = {"intro-horizontal": 720, "intro-stacked": 480, "intro-mark": 480}.get(anim.name, 240)
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
