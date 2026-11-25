"""UI generator: writes the screen catalogue for the Flutter app and the web portal.

Reads the approved screen inventory (docs/ui/wireframes/screens.json), the
design tokens (packages/design-tokens/tokens.json) and the sample data
(tools/ui-gen/src/mock.txt), then writes:

  packages/design-tokens/lib/igongo_tokens.dart     Dart tokens
  packages/design-tokens/web/tokens.css             CSS variables (light and dark)
  packages/design-tokens/web/tokens.ts              TypeScript tokens
  apps/igongo/lib/modules/mNN_<slug>/mNN_<slug>_screens.g.dart
  apps/igongo/lib/app/catalog/catalog.g.dart
  apps/web/src/modules/mNN-<slug>/screens.g.ts
  apps/web/src/app/catalog/catalog.g.ts

Nothing is typed by hand per screen: each screen gets its kind (list, form,
scanner and so on) from its name, the same rule the wireframes used, so the
coded UI matches the approved sketches. Run from the repository root:

    python tools/ui-gen/gen_ui.py .
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

# Step 1: the screen kinds, in the same order and with the same rules as the
# approved wireframes (docs/ui/wireframes/index.html). The first match wins.
KINDS = [
    ("home", r"(home$|^role home|console home|client view home|explore as guest)"),
    ("dashboard", r"(dashboard|live$|board$|reports?$|results$|summary|status$|usage|spend|sla|health|position)"),
    ("scanner", r"(scan|tap card|clock in|claim meal|encode|test card|entry$|check$|zone check|who owns|band scanner|redeem voucher|sign out key|return key|event check-in|ticket scanner|panic)"),
    ("map", r"(map|navigate|zones$|floor plan|locations)"),
    ("settings", r"(settings|rules|types|policies|methods|limits|preferences|matrix|permissions|conditions|mapping|series|amounts|duties|templates$|cycles)"),
    ("builder", r"(builder|designer|editor|logic|layout|wizard)"),
    ("form", r"^(new|add|create|request|report|register|book|fill|edit|apply|pre-|walk-in|give|log|issue|assign|schedule|take|buy|pick|enter|forgot|verify|phone|otp|password|pin|two-factor|sign in|claim|open till|cash count|cash-up|record|run|start|answer|clean|proof|checkout|cart|order type|delivery address|digital check-in|health|pay$|mobile money|payment link|till|change|import)"),
    ("detail", r"(detail|profile|view$|payslip$|article$|card$|pass$|player|room$|entry$|contract$|post$|trip$|my event$|my account|everything about|timeline|about$|item detail|product detail|treatment detail)"),
    ("result", r"(result|confirmed|placed|pending approval|locked|denied|not found|went wrong|force update|maintenance|warning|unassigned|sent$)"),
]

# Step 2: how a dialog looks, from its name. Danger dialogs ask before a step
# that removes or stops something; warnings explain a problem; sheets collect
# a choice; everything else is a plain confirmation.
DIALOG_TONES = [
    ("danger", r"(delete|block|cancel|void|reverse|reset|lock|remove|refuse|sign out|revoke|dispose|discard|close account|deactivate|end |stop|reject|write off|panic)"),
    ("warning", r"(warning|busy|offline|failed|expired|unsaved|conflict|clash|limit|overdue|over |low |error|not |lost|missing|duplicate|session)"),
    ("sheet", r"(pick|choose|select|filter|share|download|print|edit|add|change|move|assign|send|upload|scan|rate|reply|split|transfer|swap|attach|invite|export|preview|switch)"),
]

SURFACES = {"A": "app", "W": "web", "K": "kiosk", "P": "public"}


def kind_of(name: str) -> str:
    """Return the screen kind for a screen name, or "list" when no rule matches."""
    for kind, pattern in KINDS:
        if re.search(pattern, name, re.I):
            return kind
    return "list"


def tone_of(name: str) -> str:
    """Return the dialog tone for a dialog name, or "confirm" when no rule matches."""
    for tone, pattern in DIALOG_TONES:
        if re.search(pattern, name, re.I):
            return tone
    return "confirm"


def fields_of(purpose: str) -> list[str]:
    """Pull form field labels from a purpose line such as "Guest sign-up with name, phone and consent".

    Only short phrases after "with" or a colon are taken, so a purpose that is
    a sentence gives no fields and the module's sample fields are used instead.
    """
    match = re.search(r"(?:\bwith\b|:)\s+(.+)$", purpose)
    if not match:
        return []
    parts = re.split(r",\s*|\s+and\s+|\s+or\s+", match.group(1))
    labels = [p.strip().rstrip(".") for p in parts if 0 < len(p.split()) <= 4]
    # Fewer than three phrases is usually prose, not a field list.
    if len(labels) < 3:
        return []
    return [label[0].upper() + label[1:] for label in labels][:6]


def load_mock(path: Path) -> dict[str, dict]:
    """Read tools/ui-gen/src/mock.txt into {module code: sample data}."""
    mock = {}
    for line in path.read_text(encoding="utf-8").splitlines():
        if not line.strip() or line.startswith("#"):
            continue
        code, items, statuses, kpis, fields = [p.strip() for p in line.split("|")]
        split = lambda text: [t.strip() for t in text.split(";") if t.strip()]  # noqa: E731
        mock[code] = {
            "items": split(items),
            "statuses": split(statuses),
            "kpis": [tuple(k.split("=", 1)) for k in split(kpis)],
            "fields": split(fields),
        }
    return mock


def module_slugs(root: Path) -> dict[str, str]:
    """Map each module code to its slug, taken from the screen inventory file names."""
    slugs = {}
    for file in (root / "docs/ui/screens").glob("[0-9][0-9]-*.md"):
        code, slug = file.stem.split("-", 1)
        slugs[code] = slug
    return slugs


# ---------- Step 3: literal writers ----------

def dart_str(text: str) -> str:
    """Quote text as a Dart string literal."""
    return "'" + text.replace("\\", "\\\\").replace("'", "\\'").replace("$", "\\$") + "'"


def dart_list(values: list[str]) -> str:
    """Write a const-friendly Dart list of strings."""
    return "[" + ", ".join(dart_str(v) for v in values) + "]"


def ts_str(text: str) -> str:
    """Quote text as a TypeScript string literal."""
    return json.dumps(text, ensure_ascii=False)


def screen_record(s: dict) -> dict:
    """Turn one inventory screen into the fields both platforms need."""
    return {
        "id": s["id"],
        "name": s["name"],
        "purpose": s["purpose"],
        "route": s["route"],
        "kind": kind_of(s["name"]),
        "surfaces": [SURFACES[c] for c in s["where"]],
        "opens": [o for o in s["opens"] if o == "home" or o.startswith("S")],
        "dialogs": [o for o in s["opens"] if o.startswith("D")],
        "fields": fields_of(s["purpose"]) if kind_of(s["name"]) == "form" else [],
    }


def dialog_record(s: dict) -> dict:
    """Turn one inventory dialog into the fields both platforms need."""
    return {
        "id": s["id"],
        "name": s["name"],
        "purpose": s["purpose"],
        "slug": s["route"].split("=", 1)[1],
        "tone": tone_of(s["name"]),
        "opens": [o for o in s["opens"] if o == "home" or o.startswith("S")],
    }


# ---------- Step 4: Dart output ----------

def dart_module(code: str, slug: str, name: str, screens: list, dialogs: list, mock: dict, overrides: bool) -> str:
    """Write one module's screen catalogue as a Dart file."""
    var = f"m{code}{''.join(w.title() for w in slug.split('-'))}"
    # A module with no hand-made screens is one constant; with them, only its lists are.
    lead = "const " if overrides else ""
    out = [
        f"// GENERATED by tools/ui-gen/gen_ui.py from the approved screen inventory. Do not edit.",
        f"// Module {code}: {name}. Screens, dialogs and sample data for the clickable UI.",
        "",
        "import '../../shared/catalog/catalog.dart';",
    ]
    if overrides:
        out.append(f"import 'm{code}_{slug.replace('-', '_')}_overrides.dart';")
    out += ["", f"/// Module {code}, {name}: every screen and dialog, with its sample data.", f"{'final' if overrides else 'const'} {var}Module = ModuleSpec(",
            f"  code: {dart_str(code)},", f"  name: {dart_str(name)},", f"  slug: {dart_str(slug)},",
            f"  screens: {lead}["]
    for s in screens:
        out.append(
            f"    ScreenSpec(id: {dart_str(s['id'])}, name: {dart_str(s['name'])}, purpose: {dart_str(s['purpose'])}, "
            f"route: {dart_str(s['route'])}, kind: ScreenKind.{s['kind']}, "
            f"surfaces: [{', '.join('Surface.' + x for x in s['surfaces'])}], "
            f"opens: {dart_list(s['opens'])}, dialogs: {dart_list(s['dialogs'])}, fields: {dart_list(s['fields'])}),"
        )
    out.append("  ],")
    if overrides:
        out.append(f"  overrides: m{code}Overrides,")
    out.append(f"  dialogs: {lead}[")
    for d in dialogs:
        out.append(
            f"    DialogSpec(id: {dart_str(d['id'])}, name: {dart_str(d['name'])}, purpose: {dart_str(d['purpose'])}, "
            f"slug: {dart_str(d['slug'])}, tone: DialogTone.{d['tone']}, opens: {dart_list(d['opens'])}),"
        )
    out.append("  ],")
    kpis = ", ".join(f"({dart_str(k)}, {dart_str(v)})" for k, v in mock["kpis"])
    out += [
        f"  mock: {lead}ModuleMock(",
        f"    items: {dart_list(mock['items'])},",
        f"    statuses: {dart_list(mock['statuses'])},",
        f"    kpis: [{kpis}],",
        f"    fields: {dart_list(mock['fields'])},",
        "  ),",
        ");",
        "",
    ]
    return "\n".join(out)


def dart_catalog(modules: list, roles: list) -> str:
    """Write the Dart catalogue that lists every module and every role."""
    out = [
        "// GENERATED by tools/ui-gen/gen_ui.py from the approved screen inventory. Do not edit.",
        "// Every module's screens and every pre-made role's home tiles, in one place for the router.",
        "",
        "import '../../shared/catalog/catalog.dart';",
    ]
    for code, slug, _ in modules:
        folder = f"m{code}_{slug.replace('-', '_')}"
        out.append(f"import '../../modules/{folder}/{folder}_screens.g.dart';")
    out += ["", "/// Every module, in the order of the screen inventory.", "final allModules = <ModuleSpec>["]
    for code, slug, _ in modules:
        out.append(f"  m{code}{''.join(w.title() for w in slug.split('-'))}Module,")
    out += ["];", "", "/// Every pre-made role with its home tiles. The super admin edits these later.", "const allRoles = <RoleSpec>["]
    for r in roles:
        tiles = ", ".join(f"RoleTile({dart_str(t)}, {dart_str(i)})" for t, i in r["tiles"])
        out.append(f"  RoleSpec(key: {dart_str(r['key'])}, name: {dart_str(r['name'])}, level: {dart_str(r['level'])}, tiles: [{tiles}]),")
    out += ["];", ""]
    return "\n".join(out)


# ---------- Step 5: TypeScript output ----------

def ts_module(code: str, slug: str, name: str, screens: list, dialogs: list, mock: dict) -> str:
    """Write one module's screen catalogue as a TypeScript file."""
    var = f"m{code}{''.join(w.title() for w in slug.split('-'))}"
    body = {
        "code": code, "name": name, "slug": slug, "screens": screens, "dialogs": dialogs,
        "mock": {"items": mock["items"], "statuses": mock["statuses"], "kpis": [list(k) for k in mock["kpis"]], "fields": mock["fields"]},
    }
    return (
        "// GENERATED by tools/ui-gen/gen_ui.py from the approved screen inventory. Do not edit.\n"
        f"// Module {code}: {name}. Screens, dialogs and sample data for the clickable UI.\n\n"
        'import type { ModuleSpec } from "@/shared/catalog/types";\n\n'
        f"/** Module {code}, {name}: every screen and dialog, with its sample data. */\n"
        f"export const {var}: ModuleSpec = {json.dumps(body, ensure_ascii=False, indent=2)};\n"
    )


def ts_catalog(modules: list, roles: list) -> str:
    """Write the TypeScript catalogue that lists every module and every role."""
    out = [
        "// GENERATED by tools/ui-gen/gen_ui.py from the approved screen inventory. Do not edit.",
        "// Every module's screens and every pre-made role's home tiles, in one place for the router.",
        "",
        'import type { ModuleSpec, RoleSpec } from "@/shared/catalog/types";',
    ]
    for code, slug, _ in modules:
        var = f"m{code}{''.join(w.title() for w in slug.split('-'))}"
        out.append(f'import {{ {var} }} from "@/modules/m{code}-{slug}/screens.g";')
    names = ", ".join(f"m{c}{''.join(w.title() for w in s.split('-'))}" for c, s, _ in modules)
    out += ["", "/** Every module, in the order of the screen inventory. */", f"export const allModules: ModuleSpec[] = [{names}];", "",
            "/** Every pre-made role with its home tiles. The super admin edits these later. */",
            f"export const allRoles: RoleSpec[] = {json.dumps(roles, ensure_ascii=False, indent=2)};", ""]
    return "\n".join(out)


def ts_overrides(root: Path, modules: list) -> str:
    """Write the list of hand-made web screens, from each module folder that has an overrides.tsx."""
    found = [(c, s) for c, s, _ in modules if (root / f"apps/web/src/modules/m{c}-{s}/overrides.tsx").exists()]
    out = [
        "// GENERATED by tools/ui-gen/gen_ui.py: every module's hand-made web screens. Do not edit.",
        "// A module adds hand-made screens by exporting them from its own overrides.tsx.",
        "",
        'import type { ScreenOverrides } from "@/shared/catalog/types";',
    ]
    out += [f'import {{ m{c}Overrides }} from "@/modules/m{c}-{s}/overrides";' for c, s in found]
    out += ["", "/** Hand-made screens by screen number. Every other screen uses a shared layout. */",
            "export const allOverrides: ScreenOverrides = {" + ", ".join(f"...m{c}Overrides" for c, _ in found) + "};", ""]
    return "\n".join(out)


# ---------- Step 6: design tokens ----------

def hex_to_dart(hex_colour: str) -> str:
    """#B8292F becomes Color(0xFFB8292F)."""
    return f"Color(0xFF{hex_colour.lstrip('#').upper()})"


def camel_to_kebab(name: str) -> str:
    """primaryContainer becomes primary-container."""
    return re.sub(r"(?<!^)(?=[A-Z])", "-", name).lower()


def dart_tokens(tokens: dict) -> str:
    """Write the design tokens as a Dart library."""
    out = [
        "// GENERATED by tools/ui-gen/gen_ui.py from packages/design-tokens/tokens.json. Do not edit.",
        "// The single source of Igongo colours, type, spacing and shape for the Flutter app.",
        "",
        "import 'dart:ui';",
        "",
    ]
    for mode in ("light", "dark"):
        out.append(f"/// Colours for {mode} mode. Igongo red and deep red are the same in both modes.")
        out.append(f"abstract final class IgongoColors{mode.title()} {{")
        for key, value in tokens["color"][mode].items():
            out.append(f"  static const {key} = {hex_to_dart(value)};")
        out += ["}", ""]
    out.append("/// Text styles at the Standard text size: size, line height and weight.")
    out.append("abstract final class IgongoType {")
    for key, v in tokens["type"].items():
        if isinstance(v, dict):
            out.append(f"  static const {key} = (size: {v['size']}.0, height: {v['lineHeight']}.0, weight: {v['weight']}, brand: {str(v['font'] == 'brand').lower()});")
    out.append(f"  static const minimum = {tokens['type']['minimum']}.0;")
    out += ["}", "", "/// The text size choices people pick in Settings."]
    out.append("abstract final class IgongoTextScale {")
    for key, v in tokens["textScale"].items():
        if isinstance(v, (int, float)):
            out.append(f"  static const {key} = {float(v)};")
    out += ["}", ""]
    for group, cls in (("space", "IgongoSpace"), ("radius", "IgongoRadius"), ("touchTarget", "IgongoTouch"), ("elevation", "IgongoElevation"), ("motion", "IgongoMotion")):
        out.append(f"/// {group} values from the tokens.")
        out.append(f"abstract final class {cls} {{")
        for key, v in tokens[group].items():
            if isinstance(v, (int, float)) and not isinstance(v, bool):
                out.append(f"  static const {key} = {float(v)};")
        out += ["}", ""]
    out.append(f"/// Font families from the brand package.\nabstract final class IgongoFonts {{\n  static const brand = '{tokens['font']['brand']}';\n  static const body = '{tokens['font']['body']}';\n}}\n")
    return "\n".join(out)


def css_tokens(tokens: dict) -> str:
    """Write the design tokens as CSS variables, with dark mode by class and by system setting."""
    def block(mode: str) -> str:
        return "\n".join(f"  --c-{camel_to_kebab(k)}: {v};" for k, v in tokens["color"][mode].items())
    sizes = "\n".join(
        f"  --t-{k}-size: calc({v['size']}px * var(--text-scale));\n  --t-{k}-line: calc({v['lineHeight']}px * var(--text-scale));"
        for k, v in tokens["type"].items() if isinstance(v, dict))
    space = "\n".join(f"  --s-{k}: {v}px;" for k, v in tokens["space"].items())
    radius = "\n".join(f"  --r-{k}: {v}px;" for k, v in tokens["radius"].items())
    motion = "\n".join(f"  --m-{k}: {v}ms;" for k, v in tokens["motion"].items() if isinstance(v, int) and not isinstance(v, bool))
    return (
        "/* GENERATED by tools/ui-gen/gen_ui.py from packages/design-tokens/tokens.json. Do not edit.\n"
        "   Igongo colours, type, spacing and shape as CSS variables. Igongo red is the same in both\n"
        "   modes; only backgrounds, text, borders and status colours change. */\n\n"
        f":root {{\n  color-scheme: light;\n  --text-scale: 1;\n{block('light')}\n{sizes}\n{space}\n{radius}\n{motion}\n"
        f"  --touch-min: {tokens['touchTarget']['minimum']}px;\n}}\n\n"
        f":root[data-theme=\"dark\"] {{\n  color-scheme: dark;\n{block('dark')}\n}}\n\n"
        f"@media (prefers-color-scheme: dark) {{\n  :root:not([data-theme=\"light\"]) {{\n    color-scheme: dark;\n"
        + "\n".join("  " + line for line in block("dark").splitlines()) + "\n  }\n}\n"
    )


def ts_tokens(tokens: dict) -> str:
    """Write the design tokens as a TypeScript module."""
    return (
        "// GENERATED by tools/ui-gen/gen_ui.py from packages/design-tokens/tokens.json. Do not edit.\n"
        "// Igongo design tokens for the web, for code that needs raw values (charts, meta tags).\n\n"
        f"export const tokens = {json.dumps({k: v for k, v in tokens.items() if not k.startswith('$')}, indent=2)} as const;\n"
    )


# ---------- Step 7: write everything ----------

def write(path: Path, text: str) -> None:
    """Write a file, creating its folder first."""
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8")


def main(root: Path) -> None:
    """Generate every output from the inventory, tokens and sample data."""
    data = json.loads((root / "docs/ui/wireframes/screens.json").read_text(encoding="utf-8"))
    tokens = json.loads((root / "packages/design-tokens/tokens.json").read_text(encoding="utf-8"))
    mock = load_mock(root / "tools/ui-gen/src/mock.txt")
    slugs = module_slugs(root)

    # 7a: design tokens for both platforms.
    write(root / "packages/design-tokens/lib/igongo_tokens.dart", dart_tokens(tokens))
    write(root / "packages/design-tokens/web/tokens.css", css_tokens(tokens))
    write(root / "packages/design-tokens/web/tokens.ts", ts_tokens(tokens))

    # 7b: one catalogue file per module, on each platform.
    modules = sorted(((c, slugs[c], n) for c, n in data["modules"].items()), key=lambda m: m[0])
    for code, slug, name in modules:
        screens = [screen_record(s) for s in data["screens"] if s["module"] == code and s["id"][0] == "S"]
        dialogs = [dialog_record(s) for s in data["screens"] if s["module"] == code and s["id"][0] == "D"]
        if code not in mock:
            raise SystemExit(f"tools/ui-gen/src/mock.txt has no sample data for module {code}")
        folder = f"m{code}_{slug.replace('-', '_')}"
        dart_dir = root / "apps/igongo/lib/modules" / folder
        overrides = (dart_dir / f"{folder}_overrides.dart").exists()
        write(dart_dir / f"{folder}_screens.g.dart", dart_module(code, slug, name, screens, dialogs, mock[code], overrides))
        write(root / f"apps/web/src/modules/m{code}-{slug}/screens.g.ts", ts_module(code, slug, name, screens, dialogs, mock[code]))

    # 7c: the catalogues that list every module and role.
    write(root / "apps/igongo/lib/app/catalog/catalog.g.dart", dart_catalog(modules, data["roles"]))
    write(root / "apps/web/src/app/catalog/catalog.g.ts", ts_catalog(modules, data["roles"]))
    write(root / "apps/web/src/app/catalog/overrides.g.ts", ts_overrides(root, modules))
    total = sum(1 for s in data["screens"])
    print(f"Wrote {len(modules)} modules, {total} screens and dialogs, {len(data['roles'])} roles.")


if __name__ == "__main__":
    main(Path(sys.argv[1] if len(sys.argv) > 1 else "."))
