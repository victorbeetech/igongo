#!/usr/bin/env python3
"""Render docs/modules and docs/roles from the short source files in src/.

Run from the repository root:  python tools/spec-gen/gen.py .
"""
import glob
import os
import re
import sys
from pathlib import Path


def read(path):
    """Read a source file as text."""
    return Path(path).read_text(encoding="utf-8")


def write(path, text):
    """Write a generated file."""
    Path(path).write_text(text, encoding="utf-8")


SRC = os.path.join(os.path.dirname(__file__), "src")
OUT = sys.argv[1]
MOD_DIR = os.path.join(OUT, "docs", "modules")
ROLE_DIR = os.path.join(OUT, "docs", "roles")
os.makedirs(MOD_DIR, exist_ok=True)
os.makedirs(ROLE_DIR, exist_ok=True)

ACTIONS = {"V": "view", "C": "create", "E": "edit", "A": "approve", "D": "delete",
           "X": "export", "M": "comment", "L": "like"}
SCOPES = {"all": "Everything", "dept": "Own department", "own": "Own records",
          "team": "Own team", "assigned": "Assigned to them", "public": "Public items"}


def read_blocks(pattern):
    blocks = []
    for path in sorted(glob.glob(os.path.join(SRC, pattern))):
        text = read(path)
        for chunk in re.split(r"^@@ ", text, flags=re.MULTILINE)[1:]:
            head, _, body = chunk.partition("\n")
            blocks.append(([h.strip() for h in head.split("|")], body.strip("\n")))
    return blocks


# ---------------------------------------------------------------- modules
modules = {}
order = []
for head, body in read_blocks("m*.txt"):
    num, slug, name, group = head
    modules[num] = {"num": num, "slug": slug, "name": name, "group": group, "body": body,
                    "file": f"{num}-{slug}.md"}
    order.append(num)


def mlink(num, rel=""):
    m = modules[num]
    return f"[{m['name']}]({rel}{m['file']})"


for num in order:
    m = modules[num]
    lines = m["body"].split("\n")
    summary, rest, deps, events, off = [], [], [], [], ""
    for ln in lines:
        if ln.startswith("DEPENDS:"):
            deps = ln[8:].split()
        elif ln.startswith("EVENTS:"):
            events = [e.strip() for e in ln[7:].split(",") if e.strip()]
        elif ln.startswith("OFF:"):
            off = ln[4:].strip()
        elif not rest and not ln.startswith("#"):
            summary.append(ln)
        else:
            rest.append(ln)
    m["summary"] = " ".join(s for s in summary if s.strip())
    out = [f"# {int(num)}. {m['name']}", "",
           f"**Group:** {m['group']} · **Module key:** `{m['slug']}` · [All modules](README.md)", "",
           "## Summary", "", m["summary"], ""]
    out += rest
    out += ["", "## Depends on", ""]
    if deps:
        out += [f"- {mlink(d)}" for d in deps]
    else:
        out += ["- Only the core platform services that every module uses (login, permissions and the audit trail)."]
    out += ["", "Every link above is through a published API or event. This module never reads another module's tables directly.", ""]
    out += ["## Events it emits", ""]
    out += [f"- `{e}`" for e in events] or ["- None"]
    out += ["", "## If this module is switched off or fails", "", off or
            "Its menu items and home tiles disappear from every app. Other modules keep working and skip anything they would have sent to it.", ""]
    write(os.path.join(MOD_DIR, m["file"]), "\n".join(out))

# module index
groups = []
for num in order:
    g = modules[num]["group"]
    if g not in groups:
        groups.append(g)
idx = read(os.path.join(SRC, "modules-intro.md")).rstrip() + "\n\n"
idx += f"## The {len(order)} modules\n\n"
for g in groups:
    idx += f"### {g}\n\n| # | Module | What it does |\n| --- | --- | --- |\n"
    for num in order:
        m = modules[num]
        if m["group"] == g:
            parts = m["summary"].split(". ")
            s = parts[0].rstrip(".") + "."
            if len(s) < 40 and len(parts) > 1:
                s = s + " " + parts[1].rstrip(".") + "."
            idx += f"| {int(num)} | {mlink(num)} | {s} |\n"
    idx += "\n"
write(os.path.join(MOD_DIR, "README.md"), idx)

# ---------------------------------------------------------------- roles
roles = []
for head, body in read_blocks("r*.txt"):
    slug, name, level = head
    fields, cur = {}, None
    for ln in body.split("\n"):
        mm = re.match(r"^([A-Z]+):\s?(.*)$", ln)
        if mm:
            cur = mm.group(1)
            fields[cur] = mm.group(2)
        elif cur and ln.strip():
            fields[cur] += "\n" + ln
    roles.append({"slug": slug, "name": name, "level": level, "f": fields})
role_by_slug = {r["slug"]: r for r in roles}


def rlink(slug, rel=""):
    r = role_by_slug.get(slug)
    return f"[{r['name']}]({rel}{slug}.md)" if r else slug


def dot(t):
    return t if t.endswith((".", "!", "?")) else t + "."


def perms_table(spec):
    rows = ["| Module | Actions | Data scope |", "| --- | --- | --- |"]
    for item in spec.split(";"):
        item = item.strip()
        if not item:
            continue
        parts = item.split()
        num, acts = parts[0], parts[1]
        scope = parts[2] if len(parts) > 2 else "own"
        if num not in modules:
            raise SystemExit(f"unknown module {num} in perms")
        names = ", ".join(ACTIONS[a] for a in "VCEADXML" if a in acts)
        rows.append(f"| {mlink(num, '../modules/')} | {names} | {SCOPES[scope]} |")
    return rows


for r in roles:
    f = r["f"]
    out = [f"# {r['name']}", "",
           f"**Level:** {r['level']} · **Role key:** `{r['slug']}` · [All roles](README.md)", "",
           "> A pre-made role. The super admin can rename it, change every permission, tile and limit below, clone it, or delete it, all without code.", "",
           "## Purpose", "", f.get("PURPOSE", ""), ""]
    rep = f.get("REPORTS", "").strip()
    if rep:
        out += [f"**Reports to:** {', '.join(rlink(s.strip()) for s in rep.split(','))}", ""]
    out += [f"**Uses:** {f.get('APP', 'The Igongo app on a phone')}", ""]
    out += ["## Home screen tiles", ""]
    out += [f"- {t.strip()}" for t in f.get("HOME", "").split(";") if t.strip()]
    out += ["", "## Modules, screens and default permissions", ""]
    if r["slug"] != "staff-base" and r["level"] not in ("Guests and clients", "System", "Partners and suppliers"):
        out += ["Includes everything in the " + rlink("staff-base") + " role, plus:", ""]
    out += perms_table(f.get("PERMS", ""))
    scr = f.get("SCREENS", "").strip()
    if scr:
        out += ["", "**Main screens:** " + scr]
    out += ["", "## Approval limits", ""]
    out += [f"- {dot(t.strip())}" for t in f.get("LIMITS", "None. This role does not approve anything.").split(";") if t.strip()]
    out += ["", "## Extra rules", ""]
    rules = f.get("RULES", "").strip()
    out += [f"- {dot(t.strip())}" for t in rules.split(";") if t.strip()] if rules else []
    if r["level"] not in ("Guests and clients", "Partners and suppliers"):
        out += ["- Can switch to the client view at any time to see the app exactly as a guest sees it."]
    out.append("")
    write(os.path.join(ROLE_DIR, f"{r['slug']}.md"), "\n".join(out))

levels = []
for r in roles:
    if r["level"] not in levels:
        levels.append(r["level"])
idx = read(os.path.join(SRC, "roles-intro.md")).rstrip() + "\n\n"
idx += f"## The {len(roles)} pre-made roles\n\n"
for lv in levels:
    idx += f"### {lv}\n\n| Role | Purpose |\n| --- | --- |\n"
    for r in roles:
        if r["level"] == lv:
            p = r["f"].get("PURPOSE", "").split(". ")[0].rstrip(".") + "."
            idx += f"| {rlink(r['slug'])} | {p} |\n"
    idx += "\n"
write(os.path.join(ROLE_DIR, "README.md"), idx)
print(len(order), "modules,", len(roles), "roles")
