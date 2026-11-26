/**
 * End-to-end test of App Layout & Navigation (module 3) on PGlite: the
 * super admin orders and hides a role's menu, sets its tabs and tiles,
 * rolls back, and changes who may switch to the client view; a person
 * with that role gets the combined layout from `/api/layout/me`. Also the
 * card designs: templates checked on save and the template chosen per role.
 */

import { describe, expect, it } from "vitest";
import { testApi } from "./helpers";

describe("app layout", () => {
  it("draws each person's menu from the role layouts the super admin publishes", async () => {
    // A hotel with a super admin and one pool attendant.
    const t = await testApi();
    // The owner: set-up claimed and 2-step on, as the console requires.
    const owner = await t.owner();
    const created = (await owner("POST", "/api/users", { name: "Leo", email: "leo@example.com", password: "Leo pass 1234" })).body as { id: string };
    expect((await owner("POST", `/api/access/users/${created.id}/roles`, { roleId: "role_pool-attendant" })).status).toBe(204);
    const leo = t.browser();
    expect((await leo("POST", "/api/auth/sign-in/email", { email: "leo@example.com", password: "Leo pass 1234" })).status).toBe(200);

    // Before any layout, Leo gets his permitted modules A to Z and the pre-made tiles.
    const before = (await leo("GET", "/api/layout/me")).body as { menu: string[]; tiles: string[]; canSwitchToClient: boolean };
    expect(before.menu).toContain("pool");
    expect(before.tiles).toContain("Scan pass or wristband");
    expect(before.canSwitchToClient).toBe(true);

    // The super admin puts the pool first, hides one module, sets two tabs, then changes the tiles.
    const hide = before.menu.find((k) => k !== "pool") as string;
    const v1 = { menu: ["pool"], hidden: [hide], tabs: ["S71-03", "S71-04"], tiles: ["Swimmers now"] };
    expect((await owner("PUT", "/api/layout/roles/role_pool-attendant", v1)).body).toMatchObject({ version: 1 });
    expect((await owner("PUT", "/api/layout/roles/role_pool-attendant", { ...v1, tiles: ["Water tests due"] })).body).toMatchObject({ version: 2 });
    // Leo cannot change layouts.
    expect((await leo("PUT", "/api/layout/roles/role_pool-attendant", v1)).status).toBe(403);
    const after = (await leo("GET", "/api/layout/me")).body as { menu: string[]; tabs: string[]; tiles: string[] };
    expect(after.menu[0]).toBe("pool");
    expect(after.menu).not.toContain(hide);
    expect(after).toMatchObject({ tabs: ["S71-03", "S71-04"], tiles: ["Water tests due"] });

    // Roll back to version 1: it comes back as version 3.
    expect((await owner("POST", "/api/layout/roles/role_pool-attendant/rollback", { version: 1 })).body).toMatchObject({ version: 3, tiles: ["Swimmers now"] });
    const history = (await owner("GET", "/api/layout/roles/role_pool-attendant/history")).body as { items: { version: number }[] };
    expect(history.items.map((v) => v.version)).toEqual([3, 2, 1]);

    // Only managers may switch to the client view now; the public list is open to all.
    const settings = (await owner("GET", "/api/layout/settings")).body as Record<string, unknown>;
    expect((await owner("PUT", "/api/layout/settings", { ...settings, clientViewRoles: ["general-manager"] })).status).toBe(200);
    expect(((await leo("GET", "/api/layout/me")).body as { canSwitchToClient: boolean }).canSwitchToClient).toBe(false);
    expect(((await t.browser()("GET", "/api/layout/public")).body as { modules: string[] }).modules).toContain("room-bookings");

    // Card designs: the black portrait card is everyone's until the super admin gives the pool its own.
    expect(((await leo("GET", "/api/cards/designs/mine")).body as { template: { key: string } }).template.key).toBe("portrait-black");
    const designs = (await owner("GET", "/api/cards/designs")).body as { byRole: Record<string, string> };
    expect((await owner("PUT", "/api/cards/designs", { ...designs, byRole: { "pool-attendant": "gone" } })).status).toBe(400);
    expect((await leo("PUT", "/api/cards/designs", { ...designs, byRole: { "pool-attendant": "landscape-red" } })).status).toBe(403);
    expect((await owner("PUT", "/api/cards/designs", { ...designs, byRole: { "pool-attendant": "landscape-red" } })).status).toBe(200);
    expect(((await leo("GET", "/api/cards/designs/mine")).body as { template: { key: string } }).template.key).toBe("landscape-red");
  });
});
