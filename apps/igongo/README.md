# The Igongo app (Flutter)

One app for everyone: staff, managers, riders and guests. The home screen and menu are built from the person's role at run time. This is the **clickable UI with sample data** (build checklist Phases 4 and 6); there is no back end or real functionality yet.

## Run it

```bash
flutter pub get
flutter run            # a phone or emulator
flutter run -d chrome  # in the browser
```

Tap the **sliders icon** in the red bar to open the preview panel: pick the role (all 121), the screen state (normal, loading, empty, error, offline, permission denied, success), light or dark, and the text size.

## Push notifications

Push (module 10, in `lib/modules/m10_notifications/`) is **off until the build has Firebase settings**, and the app works the same without them. Fill `config/firebase-app.json` from `config/firebase-app.example.json` (the values are not secret) and build with:

```bash
flutter run --dart-define-from-file=config/firebase-app.json
```

Users & Login calls `PushModule.instance!.start(...)` after sign-in and `stop(...)` at sign-out. What is still needed from the hotel's accounts is in [docs/NEEDS-YOU.md](../../docs/NEEDS-YOU.md).

## Folders

| Folder | What it holds |
| --- | --- |
| `lib/app/` | The app root, router (one route per screen, from the catalogue), app frame (bar, menu, bottom bar), preview panel and navigation |
| `lib/modules/mNN_<slug>/` | One folder per module: its generated screen list and sample data, plus any hand-made screens under `presentation/` |
| `lib/shared/catalog/` | The models for screens, dialogs, modules and roles (one per file) |
| `lib/shared/theme/` | The light and dark themes, built only from the design tokens |
| `lib/shared/ui/<component>/` | One folder per reusable widget: button, card, list row, tile, number card, chip, field, chart, scanner ring, map, banner, toast, skeleton, staff card, logo, loader, search, message, module icons |
| `lib/shared/screens/<kind>/` | The ten shared layouts, one per screen kind, and the parts they share |
| `lib/shared/dialogs/` | The one dialog and one bottom sheet every inventory dialog uses |
| `lib/shared/states/` | The screen states and how each is drawn |
| `lib/shared/preferences/` | Theme, text size and preview choices (moves to Riverpod in Phase 7) |

The logo, card and fonts come from `packages/brand` (as the `igongo_brand` package) and the colours and sizes from `packages/design-tokens` (as `igongo_tokens`). Nothing is copied.

## Checks

```bash
flutter analyze   # zero issues, strict mode
flutter test      # every screen in light, dark, Compact and Extra large text, plus component tests
flutter test --tags golden                   # key screens and the design system in light and dark
flutter test --tags golden --update-goldens  # redraw them after an approved design change
```

- `test/golden/` compares key screens (one per layout, the six screen states and the design system) with the pictures in `test/golden/goldens/`.
- `test/store/` draws the Play Store and App Store screenshots into `packages/brand/store/screenshots/`.
- `test/accessibility/` checks tap targets (48 px) and labels on every screen in both modes.
- The design system screen opens from the preview panel ("Open the design system") or at `/design-system`.
