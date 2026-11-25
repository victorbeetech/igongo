# UI generator

Writes the screen catalogue for the Igongo app (Flutter) and the web portal (Next.js) from the approved screen inventory, so every one of the 637 screens and 175 dialogs is coded, routed and connected without typing each one by hand.

| Reads | Writes |
| --- | --- |
| `docs/ui/wireframes/screens.json` (the approved inventory) | `apps/igongo/lib/modules/mNN_<slug>/mNN_<slug>_screens.g.dart`, `apps/web/src/modules/mNN-<slug>/screens.g.ts` |
| `packages/design-tokens/tokens.json` (the one theme file) | `packages/design-tokens/lib/igongo_tokens.dart`, `packages/design-tokens/web/tokens.css`, `packages/design-tokens/web/tokens.ts` |
| `tools/ui-gen/src/mock.txt` (sample data, one line per module) | The sample records, statuses, numbers and form fields on each module's screens |

Each screen is drawn by a shared layout picked from its **kind** (list, detail, form, dashboard, scanner, map, settings, builder, result or home), using the same rules as the approved wireframes. A screen that needs more than its layout gets a hand-made screen in its own module folder (`mNN_<slug>_overrides.dart` in the app, `overrides.tsx` on the web); the generator finds those files and wires them in.

Run from the repository root after changing any of the inputs:

```bash
python3 tools/ui-gen/gen_ui.py .
```

**To change the theme or fonts:** edit `packages/design-tokens/tokens.json` and run the generator. The app and the web both update; no screen sets its own colour or size.
