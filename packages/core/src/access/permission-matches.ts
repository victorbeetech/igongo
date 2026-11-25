/**
 * The permission matcher used everywhere a permission is checked.
 *
 * Permission keys have three parts, `module.feature.action`, such as
 * `roles-permissions.roles.edit` or `notifications.push.test`. A role can be
 * given a wildcard in any part: `room-bookings.*.view` (view every feature of
 * Room Bookings), `audit-trail.*.*` (everything in the Audit Trail) or `*`
 * (everything; only the Super Admin role has this).
 */

/**
 * True when [granted] (a key a role gives) covers [required] (the key a route needs).
 * @example permissionMatches("pool.*.view", "pool.passes.view") === true
 */
export function permissionMatches(granted: string, required: string): boolean {
  // `*` alone is every permission.
  if (granted === "*") return true;
  const have = granted.split(".");
  const need = required.split(".");
  if (have.length !== 3 || need.length !== 3) return false;
  // Each part must be equal, or the granted part must be `*`.
  return have.every((part, i) => part === "*" || part === need[i]);
}

/** True when any of [granted] covers [required]. */
export function hasPermission(granted: readonly string[], required: string): boolean {
  return granted.some((g) => permissionMatches(g, required));
}
