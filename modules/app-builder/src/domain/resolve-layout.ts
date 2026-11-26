/**
 * Combines a person's role layouts into their own layout. Pure function, no I/O.
 *
 * Rules:
 * - The menu holds only modules the person may open (their access menu).
 * - Modules come in the order the roles list them (first role first), then
 *   the rest A to Z. A module hidden by one role stays if another role lists it.
 * - The bottom tabs come from the first role that has any; at most five.
 * - Tiles add together in role order without repeats; when no role has
 *   layout tiles, the roles' pre-made tiles are used.
 * - The client view switch shows for staff whose roles are allowed.
 */

import type { AccessProfile } from "@igongo/contracts/roles-permissions";
import type { LayoutSettings } from "./layout-settings";
import type { MyLayout } from "./my-layout";
import type { RoleLayout } from "./role-layout";

export function resolveLayout(access: AccessProfile, layouts: RoleLayout[], settings: LayoutSettings): MyLayout {
  // Step 1: the role layouts in the person's role order.
  const byRole = new Map(layouts.map((l) => [l.roleId, l]));
  const ordered = access.roles.map((r) => byRole.get(r.id)).filter((l): l is RoleLayout => !!l);
  // Step 2: the menu, unless the person reaches everything.
  const everything = access.menu.includes("*");
  const allowed = new Set(access.menu);
  const listed = unique(ordered.flatMap((l) => l.menu));
  const hidden = new Set(ordered.flatMap((l) => l.hidden).filter((k) => !listed.includes(k)));
  const menu = everything
    ? listed.length ? [...listed.filter((k) => !hidden.has(k)), "*"] : ["*"]
    : [...listed.filter((k) => allowed.has(k)), ...[...allowed].filter((k) => !listed.includes(k)).sort()].filter((k) => !hidden.has(k));
  // Step 3: tabs and tiles.
  const tabs = (ordered.find((l) => l.tabs.length)?.tabs ?? []).slice(0, 5);
  const layoutTiles = unique(ordered.flatMap((l) => l.tiles));
  const tiles = layoutTiles.length ? layoutTiles : access.homeTiles;
  // Step 4: the client view switch.
  const allowedRole = settings.clientViewRoles.includes("*") || access.roles.some((r) => settings.clientViewRoles.includes(r.key));
  return { menu, tabs, tiles, canSwitchToClient: access.isStaff && allowedRole, markTestOrders: settings.markTestOrders };
}

/** [list] without repeats, first one kept. */
const unique = (list: string[]) => [...new Set(list)];
