/**
 * End-to-end test of Stock & Inventory and the spa, venue and table
 * bookings (build step 5b) on PGlite: the super admin sets up a store and an
 * item, the store keeper receives and issues stock, the chef reads
 * the stock, a count corrects the balance, a cook raises a
 * requisition on the stock desk, and a guest books a spa slot and a table.
 */

import { describe, expect, it } from "vitest";
import { testApi } from "./helpers";

/** A hotel with a super admin, HR, and a way to add enrolled staff with pre-made roles. */
async function hotel() {
  const t = await testApi();
  const owner = t.browser();
  await owner("POST", "/api/auth/sign-up/email", { name: "Owner", email: "owner@example.com", password: "Owner pass 123" });
  await t.client.exec(`update users_login."user" set email_verified = true where email = 'owner@example.com'`);
  expect((await owner("POST", "/api/setup/claim")).status).toBe(200);

  /** A signed-in account holding [roleIds]. */
  async function account(name: string, roleIds: string[]) {
    const email = `${name.toLowerCase()}@example.com`;
    const created = (await owner("POST", "/api/users", { name, email, password: `${name} pass 1234` })).body as { id: string };
    for (const roleId of roleIds) expect((await owner("POST", `/api/access/users/${created.id}/roles`, { roleId })).status).toBe(204);
    const call = t.browser();
    expect((await call("POST", "/api/auth/sign-in/email", { email, password: `${name} pass 1234` })).status).toBe(200);
    return { call, userId: created.id };
  }
  const hr = await account("Hana", ["role_hr-manager"]);

  /** Like [account], and enrolled by HR in [department]. */
  async function person(name: string, department: string, roleIds: string[] = []) {
    const { call, userId } = await account(name, ["role_staff-base", ...roleIds]);
    const staff = (await hr.call("POST", "/api/hr/staff", { name, department, jobTitle: "Staff", userId })).body as { staffId: string };
    return { call, userId, staffId: staff.staffId };
  }
  const guest = t.browser();
  expect((await guest("POST", "/api/auth/sign-up/email", { name: "Grace", email: "grace@example.com", password: "Grace pass 123" })).status).toBe(200);
  return { owner, person, guest };
}

/** The date [days] from today, as YYYY-MM-DD. */
const day = (days: number) => new Date(Date.now() + days * 86_400_000).toISOString().slice(0, 10);

describe("stock and the new booking modules", () => {
  it("moves stock through the ledger with store reach and hidden costs", async () => {
    const { owner, person } = await hotel();
    const keeper = await person("Kim", "stores", ["role_store-keeper"]);
    const chef = await person("Chris", "kitchen", ["role_executive-chef"]);
    const cook = await person("Sam", "kitchen");

    // The super admin opens the main store (kept by Kim) and adds beef, bought in kilograms.
    const store = (await owner("POST", "/api/stock/stores", { name: "Main store", kind: "dry", keeperStaffId: keeper.staffId })).body as { id: string };
    const kitchen = (await owner("POST", "/api/stock/stores", { name: "Kitchen", kind: "kitchen", department: "kitchen" })).body as { id: string };
    // "Meat" is not a category until the super admin adds it in the stock settings (no code).
    const item = { code: "BEEF", name: "Beef", category: "Meat", unit: "kg", reorderLevel: 5 };
    expect((await owner("POST", "/api/stock/items", item)).status).toBe(400);
    const settings = (await owner("GET", "/api/stock/settings")).body as { categories: string[] };
    expect((await owner("PUT", "/api/stock/settings", { ...settings, categories: [...settings.categories, "Meat"] })).status).toBe(200);
    const beef = (await owner("POST", "/api/stock/items", item)).body as { id: string };

    // Kim receives 20 kg at UGX 18,000 a kilogram, then moves 8 kg to the kitchen.
    expect((await keeper.call("POST", "/api/stock/movements", { kind: "receive", itemId: beef.id, qty: 20, toStoreId: store.id, unitCost: 18000 })).status).toBe(201);
    expect((await keeper.call("POST", "/api/stock/movements", { kind: "transfer", itemId: beef.id, qty: 8, fromStoreId: store.id, toStoreId: kitchen.id })).status).toBe(201);
    // A cook cannot move stock.
    expect((await cook.call("POST", "/api/stock/movements", { kind: "issue", itemId: beef.id, qty: 1, fromStoreId: kitchen.id })).status).toBe(403);

    // The chef reads the kitchen's stock; a cook without stock permissions cannot.
    expect((await chef.call("GET", `/api/stock/items/${beef.id}`)).status).toBe(200);
    expect((await cook.call("GET", "/api/stock/items")).status).toBe(403);
    const ownerItems = (await owner("GET", "/api/stock/items")).body as { items: { onHand: number; avgCost: number }[] };
    expect(ownerItems.items[0]).toMatchObject({ onHand: 20, avgCost: 18000 });

    // Kim counts 11.5 kg in the main store (12 expected); the ledger books the half kilo.
    expect((await keeper.call("POST", "/api/stock/counts", { itemId: beef.id, storeId: store.id, counted: 11.5 })).status).toBe(200);
    const balances = (await owner("GET", `/api/stock/balances?storeId=${store.id}`)).body as { items: { qty: number }[] };
    expect(balances.items[0]?.qty).toBe(11.5);

    // Sam raises a requisition on the stock desk and sees only his own.
    const req = (await cook.call("POST", "/api/stock/desk/records", { type: "requisition", fields: { store: "Main store", items: "Beef 2 kg" } })).body as { code: string };
    expect(req.code).toBe("SD-0001");
    expect(((await cook.call("GET", "/api/stock/desk/records")).body as { items: unknown[] }).items).toHaveLength(1);

    // The super admin switches stock off; the API answers 503 for it.
    expect((await owner("PATCH", "/api/admin/modules/stock-inventory", { enabled: false })).status).toBe(200);
    expect((await keeper.call("GET", "/api/stock/items")).status).toBe(503);
  });

  it("books a spa slot and a table", async () => {
    const { owner, guest } = await hotel();
    const massage = (await owner("POST", "/api/spa/offerings", { kind: "slot", name: "Massage", price: 80000, capacity: 2, slots: ["10:00", "14:00"] })).body as { id: string };
    const table = (await owner("POST", "/api/tables/offerings", { kind: "slot", name: "Table for 4", price: 0, capacity: 1, slots: ["19:00"] })).body as { id: string };
    expect((await guest("POST", "/api/spa/bookings", { offeringId: massage.id, units: 1, date: day(1), slot: "10:00" })).status).toBe(201);
    expect((await guest("POST", "/api/tables/bookings", { offeringId: table.id, units: 1, date: day(1), slot: "19:00" })).status).toBe(201);
    expect((await guest("POST", "/api/tables/bookings", { offeringId: table.id, units: 1, date: day(1), slot: "19:00" })).status).toBe(409);
    expect(((await guest("GET", "/api/spa/bookings/mine")).body as { items: unknown[] }).items).toHaveLength(1);
  });
});
