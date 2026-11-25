#!/usr/bin/env python3
"""Build the screen inventory, routes, role homes and flows in docs/ui/.

Sources, all in src/:

- s*.txt: screens. Each block starts with `@@ NN`, the module number (00
  is the app shell shared by every module). Each line after it is
      Screen name | surfaces | what it is for
      ! Dialog name | what it is for
  Surfaces are letters: A = the Igongo app, W = the web portal, K = a
  kiosk or shared device, P = public (no sign-in).
- r*.txt: roles. Their `HOME:` line lists the tiles on each role's home.
- tiles.txt: where each home tile goes, as `Tile = NN:Screen name`
  (or `role/Tile = ...` for one role only).
- flows.txt: start-to-end flows. `## Flow name`, then lines of steps
  joined by ` > `. A step is `NN:Screen name`, `NN!Dialog name` or `home`.

Every screen gets a number (S04-03), a route, the screens that open it and
the screens it opens. The script then checks coverage: every module has
screens, every tile goes to a real screen, every flow step exists, and
every screen and dialog can be reached from an entry point.

Run from the repository root:  python tools/spec-gen/gen_screens.py .
"""

from __future__ import annotations

import glob
import os
import re
import sys
from collections import defaultdict, deque
from dataclasses import dataclass, field
from itertools import pairwise
from pathlib import Path

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, "src")
SURFACES = {"A": "App", "W": "Web", "K": "Kiosk", "P": "Public"}

# Every screen needs these states designed, so each file lists them once.
STATES = ("Loading, empty, error, offline, permission denied and success. "
          "Every list also has its search, filter and no-results state.")

# Screens a person can land on without being sent there by another screen.
ENTRY_POINTS = ["00:Launch splash", "75:Website home"]

# Words that mean a screen shows one record, so its route takes an id.
ONE_RECORD = re.compile(r"\b(detail|profile|player|editor|result)\b|\b(view|room)$", re.IGNORECASE)


@dataclass
class Screen:
    """One screen or dialog in the inventory."""

    key: str            # "04:Accounts list" or "04!Lock account"
    sid: str            # "S04-01" or "D04-01"
    module: str         # "04"
    name: str
    surfaces: str       # "AW", empty for dialogs
    purpose: str
    route: str = ""
    file: str = ""      # the inventory file it is listed in
    opened_from: set = field(default_factory=set)
    opens: set = field(default_factory=set)


def slugify(text: str) -> str:
    """Lower-case words joined by hyphens, for routes and file names."""
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")


def read(path: str) -> str:
    """Read a source file as text."""
    return Path(path).read_text(encoding="utf-8")


def module_names() -> dict[str, tuple[str, str]]:
    """Return {number: (name, slug)} from the module sources."""
    names = {"00": ("App shell and shared screens", "app-shell")}
    for path in sorted(glob.glob(os.path.join(SRC, "m*.txt"))):
        for m in re.finditer(r"^@@ (\d+) \| ([\w-]+) \| ([^|]+) \|", read(path), re.MULTILINE):
            names[m[1]] = (m[3].strip(), m[2])
    return names


def read_screens(names: dict) -> dict[str, Screen]:
    """Return every screen and dialog by key, numbered in source order."""
    screens: dict[str, Screen] = {}
    counters: dict[tuple, int] = defaultdict(int)
    for path in sorted(glob.glob(os.path.join(SRC, "s*.txt"))):
        num = None
        for line in read(path).splitlines():
            line = line.strip()
            if line.startswith("@@"):
                num = line[2:].strip()
            elif line and num:
                # Step 1: tell dialogs from screens and split the fields.
                is_dialog = line.startswith("!")
                if is_dialog:
                    name, _, purpose = (p.strip() for p in line[1:].partition("|"))
                    surf = ""
                else:
                    name, surf, purpose = (p.strip() for p in line.split("|"))
                # Step 2: number it within its module.
                kind = "D" if is_dialog else "S"
                counters[(num, kind)] += 1
                key = f"{num}{'!' if is_dialog else ':'}{name}"
                if key in screens:
                    sys.exit(f"Duplicate screen: {key}")
                sc = Screen(key, f"{kind}{num}-{counters[(num, kind)]:02d}", num, name, surf, purpose,
                            file=f"{num}-{names[num][1]}.md")
                # Step 3: its route. Dialogs open over the screen that called them.
                base = "" if num == "00" else "/" + names[num][1]
                if is_dialog:
                    sc.route = f"?dialog={slugify(name)}"
                else:
                    sc.route = f"{base}/{slugify(name)}" + ("/:id" if ONE_RECORD.search(name) else "")
                screens[key] = sc
    return screens


def read_roles() -> list[dict]:
    """Return every role with its key, name, level and home tiles."""
    roles = []
    for path in sorted(glob.glob(os.path.join(SRC, "r*.txt"))):
        for block in re.split(r"^@@ ", read(path), flags=re.MULTILINE)[1:]:
            head, _, body = block.partition("\n")
            key, name, level = (h.strip() for h in head.split("|"))
            home = re.search(r"^HOME:\s*(.*)$", body, re.MULTILINE)
            tiles = [t.strip() for t in home[1].split(";") if t.strip()] if home else []
            roles.append({"key": key, "name": name, "level": level, "tiles": tiles})
    return roles


def read_tiles() -> dict[str, str]:
    """Return {tile or role/tile: screen key}."""
    tiles = {}
    for line in read(os.path.join(SRC, "tiles.txt")).splitlines():
        if line.strip() and not line.startswith("#"):
            tile, _, target = line.partition(" = ")
            tiles[tile.strip()] = target.strip()
    return tiles


def read_flows() -> list[tuple[str, list[list[str]]]]:
    """Return [(flow name, [steps per line])]."""
    flows: list = []
    path = os.path.join(SRC, "flows.txt")
    if not os.path.exists(path):
        return flows
    for line in read(path).splitlines():
        line = line.strip()
        if line.startswith("## "):
            flows.append((line[3:], []))
        elif line and not line.startswith("#") and flows:
            flows[-1][1].append([s.strip() for s in line.split(" > ")])
    return flows


def link(sc: Screen, here: str, prefix: str = "") -> str:
    """A link to a screen's row. Inside its own file it is plain text;
    `prefix` is the path to the screens folder from the linking file."""
    if sc.module == here:
        return f"{sc.sid} {sc.name}"
    return f"[{sc.sid} {sc.name}]({prefix}{sc.file}#{sc.sid.lower()})"


def main(root: str) -> None:
    """Read everything, connect it, check it and write the docs."""
    out = Path(root, "docs", "ui", "screens")
    out.mkdir(parents=True, exist_ok=True)
    names = module_names()
    screens = read_screens(names)
    roles, tiles, flows = read_roles(), read_tiles(), read_flows()
    problems: list[str] = []
    home = Screen("home", "H", "00", "Role home", "AW", "Each role's home")

    def find(step: str) -> Screen | None:
        """Turn a flow or tile step into a screen, or note a problem."""
        if step == "home":
            return home
        if step not in screens:
            problems.append(f"Unknown screen in a flow or tile: `{step}`")
            return None
        return screens[step]

    # Step 1: home tiles connect each role home to a screen.
    role_tiles: dict[str, list] = {}
    for role in roles:
        rows = []
        for tile in role["tiles"]:
            target = tiles.get(f"{role['key']}/{tile}") or tiles.get(tile)
            if not target:
                problems.append(f"Tile with no screen: `{tile}` on {role['name']}")
                continue
            sc = find(target)
            if sc:
                sc.opened_from.add("home")
                rows.append((tile, sc))
        role_tiles[role["key"]] = rows

    # Step 2: flows connect each step to the next.
    for _, lines in flows:
        for steps in lines:
            found = [find(s) for s in steps]
            for a, b in pairwise(found):
                if a and b:
                    a.opens.add(b.key)
                    b.opened_from.add(a.key)

    # Step 3: every screen and dialog must be reachable from an entry point.
    graph = {k: s.opens for k, s in screens.items()}
    graph["home"] = {sc.key for rows in role_tiles.values() for _, sc in rows} | home.opens
    seen, todo = set(ENTRY_POINTS) | {"home"}, deque([*ENTRY_POINTS, "home"])
    while todo:
        for nxt in graph.get(todo.popleft(), ()):
            if nxt not in seen:
                seen.add(nxt)
                todo.append(nxt)
    orphans = [s for k, s in screens.items() if k not in seen]

    # Step 4: every module must have screens.
    for num, (name, _) in names.items():
        if not any(s.module == num for s in screens.values()):
            problems.append(f"No screens for module {num} {name}")

    def label(key: str, here: str) -> str:
        """Readable link for a key in a screen's from or to list."""
        return "Role home" if key == "home" else link(screens[key], here)

    # Step 5: one file per module, with routes and connections.
    index_rows, total_s, total_d = [], 0, 0
    for num in sorted({s.module for s in screens.values()}, key=int):
        name, slug = names[num]
        items = [s for s in screens.values() if s.module == num]
        spec = "" if num == "00" else f" · [Module spec](../../modules/{num}-{slug}.md)"
        lines = [f"# S{num}. {name}", "", f"[All screens](README.md){spec}", "", "## Screens", "",
                 "| No. | Screen | Where | Route | What it is for | Opened from | Opens |",
                 "| --- | --- | --- | --- | --- | --- | --- |"]
        for s in (i for i in items if i.sid.startswith("S")):
            frm = ", ".join(sorted(label(k, num) for k in s.opened_from)) or "Not connected yet"
            to = ", ".join(sorted(label(k, num) for k in s.opens)) or "Back only"
            where = ", ".join(SURFACES[c] for c in s.surfaces)
            lines.append(f'| <a id="{s.sid.lower()}"></a>{s.sid} | {s.name} | {where} | `{s.route}` | '
                         f"{s.purpose} | {frm} | {to} |")
        dialogs = [i for i in items if i.sid.startswith("D")]
        if dialogs:
            lines += ["", "## Dialogs, sheets and confirmations", "",
                      "| No. | Dialog | What it is for | Opened from |", "| --- | --- | --- | --- |"]
            for d in dialogs:
                frm = ", ".join(sorted(label(k, num) for k in d.opened_from)) or "Not connected yet"
                lines.append(f'| <a id="{d.sid.lower()}"></a>{d.sid} | {d.name} | {d.purpose} | {frm} |')
        lines += ["", "## States on every screen", "", STATES, "",
                  ("Every screen has a back action to the screen that opened it, and every dialog returns to "
                   "the screen under it."), ""]
        (out / f"{num}-{slug}.md").write_text("\n".join(lines), encoding="utf-8")
        ns, nd = len(items) - len(dialogs), len(dialogs)
        index_rows.append(f"| {num} | [{name}]({num}-{slug}.md) | {ns} | {nd} |")
        total_s, total_d = total_s + ns, total_d + nd

    # Step 6: role homes, with every tile and where it goes.
    lines = ["# Role homes", "", "[All screens](README.md)", "",
             ("Every role's home screen is built from its tiles at run time (route `/home`). Each tile opens "
              "the screen shown. The super admin can change tiles in the layout editor."), ""]
    for role in roles:
        lines += [f"## {role['name']}", "", f"[Role spec](../../roles/{role['key']}.md)", "",
                  "| Tile | Opens |", "| --- | --- |"]
        lines += [f"| {t} | {link(sc, '')} |" for t, sc in role_tiles[role["key"]]]
        lines.append("")
    (out / "role-homes.md").write_text("\n".join(lines), encoding="utf-8")

    # Step 7: the flows, written out with screen numbers.
    lines = ["# Flows from start to end", "", "[All screens](screens/README.md)", ""]
    for title, steps in flows:
        lines += [f"## {title}", ""]
        for path in steps:
            parts = [("Role home" if s == "home" else link(screens[s], "", "screens/"))
                     for s in path if s == "home" or s in screens]
            lines.append("1. " + " → ".join(parts))
        lines.append("")
    Path(root, "docs", "ui", "flows.md").write_text("\n".join(lines), encoding="utf-8")

    # Step 8: the index, with totals and the coverage check.
    connected = total_s + total_d - len(orphans)
    index = ["# Screen inventory", "",
             ("Every screen and dialog of the Igongo app, web portal, kiosks and public pages, for every person: "
              "super admin, staff, managers, riders and guests. Each is numbered so sketches, designs, code and "
              "tests all refer to the same thing. Built from `tools/spec-gen/src/`; do not edit by hand."), "",
             f"**Totals:** {total_s} screens, {total_d} dialogs, {len(roles)} role homes and {len(flows)} flows.", "",
             (f"**Connected:** {connected} of {total_s + total_d} screens and dialogs can be reached from an entry "
              f"point. See [role homes](role-homes.md) and [flows](../flows.md)."), "",
             ("Where: App = the Igongo app (Android and iOS), Web = the web portal, Kiosk = a shared device or "
              "kiosk, Public = no sign-in needed. Routes are the same on the app and the web; `/:id` means the "
              "screen shows one record, and `?dialog=` opens a dialog over the current screen."), "",
             "| # | Section | Screens | Dialogs |", "| --- | --- | --- | --- |", *index_rows,
             f"| | **Total** | **{total_s}** | **{total_d}** |", "", "## Coverage check", ""]
    index += [f"- {p}" for p in problems] or ["- Every module has screens, and every tile and flow step exists."]
    if orphans:
        index += ["", f"**Not connected yet ({len(orphans)}):** "
                  + ", ".join(link(s, "") for s in orphans)]
    (out / "README.md").write_text("\n".join(index) + "\n", encoding="utf-8")
    print(f"{total_s} screens, {total_d} dialogs, {len(roles)} roles, {len(flows)} flows, "
          f"{len(problems)} problems, {len(orphans)} not connected")


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else ".")
