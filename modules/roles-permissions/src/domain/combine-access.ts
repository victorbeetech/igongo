/**
 * Combines several roles into one access profile. Pure function, no I/O.
 *
 * Rules (roles spec, "One app, one entry point"):
 * - Permissions add together. When two roles give the same key, the widest
 *   data scope wins (everything beats own department, and so on).
 * - Home tiles add together in role order, without repeats.
 * - The menu is every module the person can view.
 * - A person is staff when any of their roles is a staff role.
 */

import { DATA_SCOPES, type AccessProfile, type DataScope, type GrantedPermission } from "@igongo/contracts/roles-permissions";
import type { Role } from "./role";

/** @param roles the person's active roles, with included roles already added */
export function combineAccess(userId: string, roles: Role[]): AccessProfile {
  const widest = new Map<string, DataScope>();
  for (const role of roles) {
    for (const p of role.permissions) {
      const current = widest.get(p.key);
      if (!current || rank(p.scope) < rank(current)) widest.set(p.key, p.scope);
    }
  }
  const permissions: GrantedPermission[] = [...widest].map(([key, scope]) => ({ key, scope }));
  return {
    userId,
    roles: roles.map((r) => ({ id: r.id, key: r.key, name: r.name, level: r.level, isStaff: r.isStaff })),
    permissions,
    homeTiles: [...new Set(roles.flatMap((r) => r.homeTiles))],
    menu: menuFrom(permissions),
    isStaff: roles.some((r) => r.isStaff),
  };
}

/** Lower is wider. `public` counts as narrowest. */
function rank(scope: DataScope): number {
  return DATA_SCOPES.indexOf(scope);
}

/** Module keys with any `view` (or `*`) permission. `*` alone means every module. */
function menuFrom(permissions: GrantedPermission[]): string[] {
  if (permissions.some((p) => p.key === "*")) return ["*"];
  const modules = permissions
    .map((p) => p.key.split("."))
    .filter(([, , action]) => action === "view" || action === "*")
    .map(([module]) => module as string);
  return [...new Set(modules)].sort();
}
