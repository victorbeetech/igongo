# App Layout & Navigation (module 3)

Per-role menus, bottom tabs and home tiles, set by the super admin with no
code. Every publish keeps the old version for roll back. Also holds the
screens guests see before signing in and who may switch to the client view.

- `GET /api/layout/me` is the combined layout the app and web draw from
  (see `src/domain/resolve-layout.ts` for the rules).
- Layouts never grant access: the menu holds only modules the person's
  permissions open.

Tables: schema `app_builder` (one settings table). Run `pnpm db:generate`
after changing `src/infrastructure/db/schema.ts`.
