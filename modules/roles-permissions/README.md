# Roles & Permissions API (module 2)

The API side of [Roles & Permissions](../../docs/modules/02-roles-permissions.md). Roles are data: the super admin creates them at runtime.

- **Permission keys** are `module.feature.action` with `*` allowed in any part (`pool.*.view`, `*`). The matcher is in `@igongo/core`.
- **Data scope** per permission: `all`, `location`, `department`, `team`, `assigned`, `own`, `public`. When two roles give the same key, the widest scope wins.
- **Several roles per person**, each optionally between two dates (temporary roles). A role can **include** other roles (every staff role includes the staff base role).
- **The 121 pre-made roles** are seeded from `docs/roles` by migration `0001`, generated with `python3 tools/roles-seed/gen_roles_seed.py`. The seed never overwrites the super admin's edits.
- **Apps render menus from roles**: `GET /api/access/me` returns the person's roles, permissions, home tiles and menu (every module with a `view` grant).

## Routes (mounted at `/api/access`)

See the header of `src/presentation/roles-router.ts` for the full list: roles (list, create or clone, edit, archive, delete), assignments, the catalogue for the role builder, and the "who can do X" report. Every change is recorded in the Audit Trail.
