"""Logo animations, defined once and exported three ways.

Each animation is a list of tracks. A track moves one part of the logo
(spiral, horn-left, horn-right, cup or text) through keyframes. The same
tracks are:

  1. sampled frame by frame to render GIF and MP4 files,
  2. written as SMIL animation inside an SVG for the web, and
  3. written as a Lottie JSON file for the Flutter app.

So the GIF, the web SVG and the app animation always move the same way.
"""

from __future__ import annotations

import json
import re
from dataclasses import dataclass, field

from brand_kit import MARK_H, MARK_W, SPIRAL_POLE, mark_parts

# ---------------------------------------------------------------------------
# Easing curves, as CSS-style cubic-bezier control points. They stay within
# 0..1 because SMIL keySplines require it.
# ---------------------------------------------------------------------------

EASE_OUT = (0.22, 1.0, 0.36, 1.0)
EASE_IN_OUT = (0.45, 0.0, 0.55, 1.0)
LINEAR = (0.0, 0.0, 1.0, 1.0)

MARK_CENTRE = (MARK_W / 2, MARK_H / 2)


def bezier_ease(curve: tuple, x: float) -> float:
    """Return eased progress for linear progress `x`, for a cubic-bezier
    curve from (0,0) to (1,1). Solves for the curve parameter by bisection."""
    x1, y1, x2, y2 = curve

    def point(t: float, a: float, b: float) -> float:
        return 3 * a * t * (1 - t) ** 2 + 3 * b * t ** 2 * (1 - t) + t ** 3

    lo, hi = 0.0, 1.0
    for _ in range(40):
        mid = (lo + hi) / 2
        if point(mid, x1, x2) < x:
            lo = mid
        else:
            hi = mid
    return point((lo + hi) / 2, y1, y2)


# ---------------------------------------------------------------------------
# Tracks and animations
# ---------------------------------------------------------------------------

@dataclass
class Track:
    """One property of one part over time.

    prop is "rotate" (degrees), "scale" (1 = full size), "move" ((dx, dy) in
    master units) or "opacity" (0..1). keys are (seconds, value) pairs.
    """

    part: str
    prop: str
    keys: list
    ease: tuple = EASE_OUT
    pivot: tuple = SPIRAL_POLE

    def value(self, t: float):
        """Return the eased value at time `t` (held before the first key and
        after the last)."""
        if t <= self.keys[0][0]:
            return self.keys[0][1]
        for (t0, v0), (t1, v1) in zip(self.keys, self.keys[1:]):
            if t <= t1:
                e = bezier_ease(self.ease, (t - t0) / (t1 - t0))
                if isinstance(v0, tuple):
                    return tuple(a + (b - a) * e for a, b in zip(v0, v1))
                return v0 + (v1 - v0) * e
        return self.keys[-1][1]


@dataclass
class Animation:
    """A named set of tracks with a length, and whether it loops."""

    name: str
    duration: float
    loop: bool
    tracks: list[Track] = field(default_factory=list)
    use: str = ""

    def state(self, t: float) -> tuple[dict, dict]:
        """Return (SVG transforms, opacities) per part at time `t`."""
        transforms, opacity = {}, {}
        for part in {tr.part for tr in self.tracks}:
            move, rot, scale, pivot = (0.0, 0.0), 0.0, 1.0, SPIRAL_POLE
            for tr in (x for x in self.tracks if x.part == part):
                v = tr.value(t)
                if tr.prop == "move":
                    move = v
                elif tr.prop == "rotate":
                    rot, pivot = v, tr.pivot
                elif tr.prop == "scale":
                    scale, pivot = v, tr.pivot
                elif tr.prop == "opacity":
                    opacity[part] = v
            px, py = pivot
            transforms[part] = (f"translate({move[0]:.3f},{move[1]:.3f}) translate({px},{py}) "
                                f"rotate({rot:.3f}) scale({scale:.4f}) translate({-px},{-py})")
        return transforms, opacity


def _spin(part: str = "spiral", seconds: float = 1.2) -> Track:
    """One full clockwise turn of the spiral, at a steady speed."""
    return Track(part, "rotate", [(0, 0.0), (seconds, 360.0)], LINEAR)


def _assemble(offset: float = 0.0) -> list[Track]:
    """The mark builds itself: the spiral unwinds and grows, the horns slide
    in from the sides, then the cup rises into place."""
    o = offset
    return [
        Track("spiral", "scale", [(o, 0.15), (o + 1.0, 1.0)]),
        Track("spiral", "rotate", [(o, -270.0), (o + 1.0, 0.0)]),
        Track("spiral", "opacity", [(o, 0.0), (o + 0.3, 1.0)]),
        Track("horn-left", "move", [(o + 0.45, (-28.0, 0.0)), (o + 1.15, (0.0, 0.0))]),
        Track("horn-left", "opacity", [(o + 0.45, 0.0), (o + 1.0, 1.0)]),
        Track("horn-right", "move", [(o + 0.45, (28.0, 0.0)), (o + 1.15, (0.0, 0.0))]),
        Track("horn-right", "opacity", [(o + 0.45, 0.0), (o + 1.0, 1.0)]),
        Track("cup", "move", [(o + 0.75, (0.0, 22.0)), (o + 1.35, (0.0, 0.0))]),
        Track("cup", "opacity", [(o + 0.75, 0.0), (o + 1.25, 1.0)]),
    ]


def _pulse() -> list[Track]:
    """A gentle breath: every part grows 6% and back."""
    keys = [(0, 1.0), (0.8, 1.06), (1.6, 1.0)]
    return [Track(p, "scale", keys, EASE_IN_OUT, MARK_CENTRE)
            for p in ("spiral", "horn-left", "horn-right", "cup")]


ANIMATIONS = [
    Animation("intro-mark", 2.2, False, _assemble(),
              "Splash screen and app start: the mark builds itself once."),
    Animation("intro-stacked", 3.0, False, _assemble() + [
        Track("text", "move", [(1.4, (0.0, 40.0)), (2.1, (0.0, 0.0))]),
        Track("text", "opacity", [(1.4, 0.0), (2.0, 1.0)]),
    ], "Website intro and app launch with the full logo and name."),
    Animation("loader-spiral", 1.2, True, [_spin()],
              "The standard loading spinner in the app and on the web."),
    Animation("loader-mark", 1.2, True, [_spin()],
              "Full-screen loading: the whole mark, with the spiral turning."),
    Animation("pulse", 1.6, True, _pulse(),
              "Waiting states, pull to refresh, and the payment in progress screen."),
]


# ---------------------------------------------------------------------------
# SMIL export (animated SVG for the web)
# ---------------------------------------------------------------------------

def _smil_values(track: Track, duration: float, fmt) -> str:
    """Build the values, keyTimes and keySplines attributes for a track,
    padded with held keys so it spans the whole animation."""
    keys = list(track.keys)
    if keys[0][0] > 0:
        keys.insert(0, (0.0, keys[0][1]))
    if keys[-1][0] < duration:
        keys.append((duration, keys[-1][1]))
    values = ";".join(fmt(v) for _, v in keys)
    times = ";".join(f"{t / duration:.4f}" for t, _ in keys)
    splines = []
    for (t0, v0), (t1, v1) in zip(keys, keys[1:]):
        curve = track.ease if v0 != v1 else LINEAR
        splines.append(" ".join(f"{c:g}" for c in curve))
    return (f'values="{values}" keyTimes="{times}" calcMode="spline" '
            f'keySplines="{";".join(splines)}"')


def smil_wrap(anim: Animation, part: str, inner: str) -> str:
    """Wrap a part's SVG in groups that carry its SMIL animation."""
    timing = f'dur="{anim.duration}s" ' + ('repeatCount="indefinite"' if anim.loop else 'fill="freeze"')
    tracks = [t for t in anim.tracks if t.part == part]
    if not tracks:
        return inner
    pivot = next((t.pivot for t in tracks if t.prop in ("rotate", "scale")), SPIRAL_POLE)
    px, py = pivot

    # Step 1: rotation and scale around the pivot, in the innermost groups.
    spin = ""
    for t in tracks:
        if t.prop == "rotate":
            spin += (f'<animateTransform attributeName="transform" type="rotate" additive="sum" '
                     f'{_smil_values(t, anim.duration, lambda v: f"{v:g}")} {timing}/>')
        if t.prop == "scale":
            spin += (f'<animateTransform attributeName="transform" type="scale" additive="sum" '
                     f'{_smil_values(t, anim.duration, lambda v: f"{v:g}")} {timing}/>')
    body = (f'<g transform="translate({px},{py})"><g>{spin}'
            f'<g transform="translate({-px},{-py})">{inner}</g></g></g>')

    # Step 2: movement and fading on the outer group.
    outer = ""
    for t in tracks:
        if t.prop == "move":
            outer += (f'<animateTransform attributeName="transform" type="translate" '
                      f'{_smil_values(t, anim.duration, lambda v: f"{v[0]:g} {v[1]:g}")} {timing}/>')
        if t.prop == "opacity":
            outer += (f'<animate attributeName="opacity" '
                      f'{_smil_values(t, anim.duration, lambda v: f"{v:g}")} {timing}/>')
    return f"<g>{outer}{body}</g>"


# ---------------------------------------------------------------------------
# Lottie export (for the Flutter app, with the `lottie` package)
# ---------------------------------------------------------------------------

FPS = 60


def _lottie_shape(d: str) -> list[dict]:
    """Convert absolute M/C/L/Z path data into Lottie bezier shapes."""
    shapes = []
    for sub in re.findall(r"M[^M]+", d):
        tokens = re.findall(r"[MCLZ]|-?\d+\.?\d*", sub)
        verts, ins, outs, i = [], [], [], 0
        while i < len(tokens):
            cmd = tokens[i]
            if cmd == "M":
                verts.append([float(tokens[i + 1]), float(tokens[i + 2])])
                ins.append([0, 0]); outs.append([0, 0]); i += 3
            elif cmd == "L":
                verts.append([float(tokens[i + 1]), float(tokens[i + 2])])
                ins.append([0, 0]); outs.append([0, 0]); i += 3
            elif cmd == "C":
                c1 = [float(tokens[i + 1]), float(tokens[i + 2])]
                c2 = [float(tokens[i + 3]), float(tokens[i + 4])]
                end = [float(tokens[i + 5]), float(tokens[i + 6])]
                prev = verts[-1]
                outs[-1] = [c1[0] - prev[0], c1[1] - prev[1]]
                verts.append(end)
                ins.append([c2[0] - end[0], c2[1] - end[1]]); outs.append([0, 0]); i += 7
            else:
                i += 1
        # A closed curve ends on its start point: merge the two.
        if len(verts) > 1 and abs(verts[-1][0] - verts[0][0]) < 1e-3 and abs(verts[-1][1] - verts[0][1]) < 1e-3:
            ins[0] = ins[-1]
            verts.pop(); ins.pop(); outs.pop()
        shapes.append({"ty": "sh", "ks": {"a": 0, "k": {"i": ins, "o": outs, "v": verts, "c": True}}})
    return shapes


def _lottie_prop(tracks: list[Track], prop: str, static, conv) -> dict:
    """Return a Lottie animatable property for `prop`, or a static value."""
    track = next((t for t in tracks if t.prop == prop), None)
    if not track:
        return {"a": 0, "k": static}
    frames = []
    for (t0, v0), (t1, _) in zip(track.keys, track.keys[1:]):
        x1, y1, x2, y2 = track.ease
        frames.append({"t": round(t0 * FPS), "s": conv(v0),
                       "o": {"x": [x1], "y": [y1]}, "i": {"x": [x2], "y": [y2]}})
    frames.append({"t": round(track.keys[-1][0] * FPS), "s": conv(track.keys[-1][1])})
    return {"a": 1, "k": frames}


def lottie(anim: Animation, fills: dict[str, str], view: tuple) -> str:
    """Return Lottie JSON for an animation of the mark (or the spiral alone).

    `fills` maps each part to a colour. `view` is (x, y, w, h) of the area of
    the master to show.
    """
    vx, vy, vw, vh = view
    layers = []
    for idx, (part, d) in enumerate(mark_parts().items()):
        if part not in fills:
            continue
        tracks = [t for t in anim.tracks if t.part == part]
        px, py = next((t.pivot for t in tracks if t.prop in ("rotate", "scale")), SPIRAL_POLE)
        r, g, b = (int(fills[part][i:i + 2], 16) / 255 for i in (1, 3, 5))
        ks = {
            "a": {"a": 0, "k": [px, py, 0]},
            "p": _lottie_prop(tracks, "move", [px - vx, py - vy, 0],
                              lambda v: [px - vx + v[0], py - vy + v[1], 0]),
            "r": _lottie_prop(tracks, "rotate", 0, lambda v: [v]),
            "s": _lottie_prop(tracks, "scale", [100, 100, 100], lambda v: [v * 100, v * 100, 100]),
            "o": _lottie_prop(tracks, "opacity", 100, lambda v: [v * 100]),
        }
        layers.append({
            "ddd": 0, "ind": idx + 1, "ty": 4, "nm": part, "sr": 1, "ks": ks, "ao": 0,
            "shapes": [{"ty": "gr", "nm": part, "it": _lottie_shape(d) + [
                {"ty": "fl", "c": {"a": 0, "k": [r, g, b, 1]}, "o": {"a": 0, "k": 100}, "r": 2},
                {"ty": "tr", "p": {"a": 0, "k": [0, 0]}, "a": {"a": 0, "k": [0, 0]},
                 "s": {"a": 0, "k": [100, 100]}, "r": {"a": 0, "k": 0}, "o": {"a": 0, "k": 100}},
            ]}],
            "ip": 0, "op": round(anim.duration * FPS), "st": 0, "bm": 0,
        })
    doc = {"v": "5.7.4", "fr": FPS, "ip": 0, "op": round(anim.duration * FPS),
           "w": round(vw), "h": round(vh), "nm": f"igongo-{anim.name}", "ddd": 0,
           "assets": [], "layers": layers}
    return json.dumps(doc, separators=(",", ":"))
