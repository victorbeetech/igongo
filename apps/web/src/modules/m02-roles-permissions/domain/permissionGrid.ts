// Turns a role's permission list into the matrix the super admin edits
// (module × action → scope or off) and back. Only module-wide grants
// (`module.*.action`) are in the grid; finer grants are kept as they are.

import type { RolePermission } from "../data/rolesApi";

/** `module|action` → scope. */
export type PermissionGrid = Map<string, string>;

const cell = (module: string, action: string) => `${module}|${action}`;

/** The grid from a permission list, and the grants that are not module-wide. */
export function toGrid(permissions: RolePermission[]): { grid: PermissionGrid; other: RolePermission[] } {
  const grid: PermissionGrid = new Map();
  const other: RolePermission[] = [];
  for (const p of permissions) {
    const [module, feature, action] = p.key.split(".");
    if (module && feature === "*" && action) grid.set(cell(module, action), p.scope);
    else other.push(p);
  }
  return { grid, other };
}

/** The permission list from a grid, plus the finer grants kept aside. */
export function fromGrid(grid: PermissionGrid, other: RolePermission[]): RolePermission[] {
  return [...[...grid].map(([k, scope]) => ({ key: `${k.split("|")[0]}.*.${k.split("|")[1]}`, scope })), ...other];
}

/** The cell key for a module and action. */
export { cell };
