# Code standards

These rules apply to **all code in this repository**, in every app, module and package, whether or not a task repeats them. Code that breaks them does not merge.

[Back to README](../../README.md)

## 1. Clean architecture

Every module, in the API, the app and the web, has the same four layers. Each layer only depends on the layers inside it.

```
presentation  →  application  →  domain  ←  infrastructure
(screens, routes) (use cases)    (entities,   (database, HTTP,
                                  rules)       queues, NFC)
```

- **domain**: entities, value objects and business rules. Pure code, no framework, no database, no HTTP.
- **application**: use cases, such as `ClockIn` or `ResetWristbandRange`. One use case per file. Talks to the outside world only through interfaces (ports) defined here.
- **infrastructure**: the adapters behind those interfaces: Drizzle repositories, queue publishers, API clients, NFC readers.
- **presentation**: Hono routes, Flutter screens and widgets, and Next.js pages. Thin: validate input, call a use case, show the result.

## 2. One folder per module, nothing mixed

- Every module in the [modules spec](../modules/README.md), however small, has **its own folder** in each place it appears: `modules/<module>/` for the API, `apps/igongo/lib/modules/<module>/` for the app, and `apps/web/src/modules/<module>/` for the web.
- A module never imports another module's internals. It uses the other module's **public contract** (its published API types and events) from `packages/contracts/<module>/`.
- A module owns its own Postgres schema. No module reads another module's tables.

## 3. Reuse, kept separate

- Shared code lives in its own clean, separate folders and is **reused, never copied**:
  - `packages/core/`: result types, errors, IDs, money, dates, logging.
  - `packages/contracts/`: one folder per module with its public API types and event schemas.
  - `packages/design-tokens/` and `packages/brand/`: the theme and logo assets.
  - `packages/ui-web/` and `apps/igongo/lib/shared/ui/`: one folder per reusable component (button, card, list tile, form field, dialog, toast, empty state, loader).
- If the same code is needed in two places, it moves to a shared package first.
- Shared packages never import a module.

## 4. Small and clear

- As little code as the job needs. No dead code, no commented-out code, no unused imports.
- One responsibility per file. Files stay short (about 200 lines). Functions stay short (about 30 lines).
- Clear names that say what a thing is or does. No abbreviations except well-known ones (ID, QR, NFC, API).

## 5. Comments on every process

- Every file starts with a short comment saying what it is for.
- Every public class, function and use case has a doc comment (`///` in Dart, `/** */` in TypeScript) saying what it does, its inputs, its result and the errors it can return.
- Every step of a process is commented: each stage of a use case, each branch of a business rule, and why a choice was made where it is not obvious.
- Comments explain **why** as well as what, and are kept up to date when the code changes.

## 6. Zero warnings

- Lint and type checks run with **warnings as errors**: `flutter analyze` with strict `analysis_options.yaml`, ESLint and `tsc --noEmit` with strict mode.
- Every loading, empty, error, offline and permission-denied state is handled on every screen. Every dialog, toast and pop-up is designed and tested, never left at a default.
- No `print` or `console.log` in committed code. Use the shared logger.

## 7. Tests

- Domain and application code has unit tests. Each use case has at least one success and one failure test.
- Each API route has an integration test. Each screen has a widget or golden test, including at 1.5× text size.
- Tests sit in each module's own `test/` folder.

## 8. Consistency

- The theme, text sizes and logo come only from the design tokens and the brand package. No hard-coded colours, sizes or images in screens.
- Formatting is automatic (`dart format`, Prettier) and checked in CI.
- Commits are small and describe one change.
