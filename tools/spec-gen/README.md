# Spec generator

Builds `docs/modules/` and `docs/roles/` from the short source files in `src/`, so every module and role file has the same layout.

| Source | What it holds |
| --- | --- |
| `src/modules-intro.md`, `src/roles-intro.md` | The top of each index page |
| `src/m*.txt` | Modules, one block per module: `@@ NN \| key \| Name \| Group`, then the summary, features and super admin options, then `DEPENDS:`, `EVENTS:` and `OFF:` lines |
| `src/r*.txt` | Roles, one block per role: `@@ key \| Name \| Level`, then `PURPOSE`, `REPORTS`, `APP`, `HOME`, `PERMS`, `LIMITS` and `RULES` lines |
| `src/s*.txt` | The screen inventory sources for Phase 3 (`Name \| surfaces \| purpose`, where A = app, W = web portal, K = kiosk, P = public; lines starting `!` are dialogs) |

Edit the sources, never the generated files, then run from the repository root:

```bash
python tools/spec-gen/gen.py .
```
