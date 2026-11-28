/**
 * The super admin's venues list, end to end on PGlite (S61-01, S62-01): the
 * super admin adds, renames, switches on and off, and removes venues; guests
 * see only the switched-on ones (the food carousel's list); a non-super-admin
 * staff member is refused on the server, even with the menu permission; and a
 * venue that still has dishes cannot be removed.
 */

import { describe, expect, it } from "vitest";
import { testApi } from "./helpers";

/** The hotel's owner (super admin) and an HR manager, who is staff but not the super admin. */
async function hotel() {
  const t = await testApi();
  const owner = await t.owner();
  const hrAccount = (await owner("POST", "/api/users", { name: "Hana", email: "hana@example.com", password: "Hana pass 1234" })).body as { id: string };
  expect((await owner("POST", `/api/access/users/${hrAccount.id}/roles`, { roleId: "role_hr-manager" })).status).toBe(204);
  const hr = t.browser();
  expect((await hr("POST", "/api/auth/sign-in/email", { email: "hana@example.com", password: "Hana pass 1234" })).status).toBe(200);
  return { ...t, owner, hr };
}

/** The names of the venues in the guest's list (what the food carousel shows). */
async function guestSees(guest: (m: string, p: string) => Promise<{ body: Record<string, unknown> }>) {
  const res = await guest("GET", "/api/menu/outlets");
  return (res.body["items"] as Array<{ key: string; name: string }>).map((o) => o.name);
}

describe("the super admin's venues list", () => {
  it("adds, renames, switches off and back on, and shows guests only the switched-on venues", async () => {
    const t = await hotel();
    const owner = t.owner;
    const guest = t.phone();
    // Step 1: add a venue that guests see straight away; the key comes from its name.
    const added = await owner("POST", "/api/menu/outlets", { name: "Pool Bar" });
    expect(added.status).toBe(201);
    expect(added.body).toEqual({ key: "pool-bar", name: "Pool Bar", clientVisible: true });
    expect(await guestSees(guest)).toEqual(["Pool Bar"]);
    // Step 2: a second venue added switched off stays hidden from guests.
    expect((await owner("POST", "/api/menu/outlets", { name: "Staff Canteen", clientVisible: false })).status).toBe(201);
    expect(await guestSees(guest)).toEqual(["Pool Bar"]);
    // Step 3: switch the pool bar off, then on again, and rename it.
    expect((await owner("PATCH", "/api/menu/outlets/pool-bar", { clientVisible: false })).body).toEqual({ key: "pool-bar", name: "Pool Bar", clientVisible: false });
    expect(await guestSees(guest)).toEqual([]);
    expect((await owner("PATCH", "/api/menu/outlets/pool-bar", { clientVisible: true, name: "Poolside Bar" })).body).toEqual({ key: "pool-bar", name: "Poolside Bar", clientVisible: true });
    expect(await guestSees(guest)).toEqual(["Poolside Bar"]);
    // Step 4: the super admin's list shows every venue with its switch.
    const settings = (await owner("GET", "/api/menu/settings")).body as { outlets: unknown[]; clientOutlets: string[] };
    expect(settings.outlets).toHaveLength(2);
    expect(settings.clientOutlets).toEqual(["pool-bar"]);
  });

  it("gives a new venue a fresh key when the name is already used", async () => {
    const t = await hotel();
    await t.owner("POST", "/api/menu/outlets", { name: "Main Restaurant" });
    const second = await t.owner("POST", "/api/menu/outlets", { name: "Main restaurant!" });
    expect((second.body as { key: string }).key).toBe("main-restaurant-2");
  });

  it("removes a venue with no dishes, but keeps one that still has dishes", async () => {
    const t = await hotel();
    const owner = t.owner;
    await owner("POST", "/api/menu/outlets", { name: "Old Kiosk" });
    await owner("POST", "/api/menu/outlets", { name: "Main Restaurant" });
    // A venue with a dish cannot go; the message says to switch it off instead.
    await owner("POST", "/api/menu/items", { outlet: "main-restaurant", section: "Grill", name: "Tilapia", price: 28000, prepMinutes: 20, options: [] });
    const blocked = await owner("DELETE", "/api/menu/outlets/main-restaurant");
    expect(blocked.status).toBe(400);
    expect(String(blocked.body["message"])).toContain("Switch it off");
    // An empty venue goes, and the guest list loses it.
    expect((await owner("DELETE", "/api/menu/outlets/old-kiosk")).status).toBe(200);
    const settings = (await owner("GET", "/api/menu/settings")).body as { outlets: Array<{ key: string }> };
    expect(settings.outlets.map((o) => o.key)).toEqual(["main-restaurant"]);
    expect((await owner("DELETE", "/api/menu/outlets/not-a-venue")).status).toBe(404);
  });

  it("refuses bad input: a short name, an empty change and an unknown venue", async () => {
    const t = await hotel();
    expect((await t.owner("POST", "/api/menu/outlets", { name: "A" })).status).toBe(400);
    expect((await t.owner("PATCH", "/api/menu/outlets/none", {})).status).toBe(400);
    expect((await t.owner("PATCH", "/api/menu/outlets/none", { clientVisible: true })).status).toBe(404);
  });

  it("lets only the super admin change venues: a staff member with the menu permission and a guest are refused", async () => {
    const t = await hotel();
    await t.owner("POST", "/api/menu/outlets", { name: "Pool Bar" });
    // Staff who are not the super admin, and guests, cannot add, change, remove or replace the list.
    for (const caller of [t.hr, t.phone()]) {
      expect((await caller("POST", "/api/menu/outlets", { name: "Rooftop" })).status).toBeGreaterThanOrEqual(401);
      expect((await caller("PATCH", "/api/menu/outlets/pool-bar", { clientVisible: false })).status).toBeGreaterThanOrEqual(401);
      expect((await caller("DELETE", "/api/menu/outlets/pool-bar")).status).toBeGreaterThanOrEqual(401);
      expect((await caller("PUT", "/api/menu/settings", { outlets: [], clientOutlets: [] })).status).toBeGreaterThanOrEqual(401);
    }
    // The venue is untouched by those attempts.
    expect(await guestSees(t.phone())).toEqual(["Pool Bar"]);
  });
});
