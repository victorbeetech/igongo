/** Unit tests of resolveLayout: menu order, hiding, tabs, tiles and the client view switch. */

import type { AccessProfile } from "@igongo/contracts/roles-permissions";
import { describe, expect, it } from "vitest";
import { DEFAULT_LAYOUT_SETTINGS } from "../src/domain/layout-settings";
import { resolveLayout } from "../src/domain/resolve-layout";
import { emptyLayout } from "../src/domain/role-layout";

/** An access profile for roles [keys] reaching [menu]. */
const access = (keys: string[], menu: string[], isStaff = true): AccessProfile => ({
  userId: "u1",
  roles: keys.map((k) => ({ id: `role_${k}`, key: k, name: k, level: "Staff", isStaff })),
  permissions: [],
  homeTiles: ["Clock in"],
  menu,
  isStaff,
});

describe("resolveLayout", () => {
  it("orders, hides and filters the menu by what the person may open", () => {
    const pool = { ...emptyLayout("role_pool"), menu: ["pool", "tasks", "payroll"], hidden: ["notice-board"], tabs: ["S71-03"] };
    const museum = { ...emptyLayout("role_museum"), menu: ["museum"], tiles: ["Tours today"] };
    const me = resolveLayout(access(["pool", "museum"], ["attendance", "museum", "notice-board", "pool", "tasks"]), [pool, museum], DEFAULT_LAYOUT_SETTINGS);
    // payroll is listed but not allowed; notice-board is hidden; attendance follows A to Z.
    expect(me.menu).toEqual(["pool", "tasks", "museum", "attendance"]);
    expect(me.tabs).toEqual(["S71-03"]);
    expect(me.tiles).toEqual(["Tours today"]);
    expect(me.canSwitchToClient).toBe(true);
  });

  it("keeps the pre-made tiles and the whole menu when nothing is set", () => {
    const me = resolveLayout(access(["super-admin"], ["*"]), [], { ...DEFAULT_LAYOUT_SETTINGS, clientViewRoles: ["gm"] });
    expect(me).toMatchObject({ menu: ["*"], tabs: [], tiles: ["Clock in"], canSwitchToClient: false });
  });

  it("never shows the client view switch to guests", () => {
    expect(resolveLayout(access(["guest"], ["room-bookings"], false), [], DEFAULT_LAYOUT_SETTINGS).canSwitchToClient).toBe(false);
  });
});
