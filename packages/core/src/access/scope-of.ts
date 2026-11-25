/**
 * How far a permission reaches for one person. A person can hold the same
 * permission through several roles with different scopes (for example
 * `attendance.*.view` as `own` from the staff base role and as `team` from
 * a supervisor role); the widest one wins.
 */

import { DATA_SCOPES, type DataScope } from "@igongo/contracts/roles-permissions";
import type { Actor } from "@igongo/contracts/users-login";
import { permissionMatches } from "./permission-matches";

/**
 * The widest scope [actor] holds [permission] with, or null when they do not hold it.
 * @example scopeOf(supervisor, "attendance.records.view") === "team"
 */
export function scopeOf(actor: Actor, permission: string): DataScope | null {
  // DATA_SCOPES is ordered widest first, so the lowest index wins.
  let best: number | null = null;
  for (const granted of actor.access.permissions) {
    if (!permissionMatches(granted.key, permission)) continue;
    const rank = DATA_SCOPES.indexOf(granted.scope);
    if (best === null || rank < best) best = rank;
  }
  return best === null ? null : (DATA_SCOPES[best] ?? null);
}
