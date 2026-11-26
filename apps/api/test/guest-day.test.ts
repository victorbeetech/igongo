/**
 * End-to-end test of the guest and rider modules (build step 3) on PGlite:
 * the super admin sets up an outlet, a menu, delivery zones and things to
 * book; a guest signs up, pre-orders "1 kg fried beef, arriving later",
 * orders a delivery, follows the rider and gives the code; staff take cash,
 * the kitchen cooks, the dispatcher and rider deliver; and the guest books a
 * room, a pool pass and a shop item. Checks permission scopes (guests can
 * never reach staff tools), module switches and the Audit Trail.
 */

import { describe, expect, it } from "vitest";
import { testApi } from "./helpers";

/** A date [days] from now, `YYYY-MM-DD` in hotel time. */
const day = (days: number) => new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Kampala" }).format(new Date(Date.now() + days * 86_400_000));

/** A hotel with a super admin, a way to add staff with pre-made roles, and a self-registered guest. */
async function hotel() {
  const t = await testApi();
  const owner = t.browser();
  await owner("POST", "/api/auth/sign-up/email", { name: "Owner", email: "owner@example.com", password: "Owner pass 123" });
  await t.client.exec(`update users_login."user" set email_verified = true where email = 'owner@example.com'`);
  expect((await owner("POST", "/api/setup/claim")).status).toBe(200);

  /** A signed-in staff account holding [roleIds]. */
  async function staff(name: string, roleIds: string[]) {
    const email = `${name.toLowerCase()}@example.com`;
    const created = (await owner("POST", "/api/users", { name, email, password: `${name} pass 1234` })).body as { id: string };
    for (const roleId of roleIds) expect((await owner("POST", `/api/access/users/${created.id}/roles`, { roleId })).status).toBe(204);
    const call = t.browser();
    expect((await call("POST", "/api/auth/sign-in/email", { email, password: `${name} pass 1234` })).status).toBe(200);
    return { call, userId: created.id };
  }

  // A guest signs up in the app and gets the Guest role by themselves.
  const guest = t.browser();
  expect((await guest("POST", "/api/auth/sign-up/email", { name: "Grace", email: "grace@example.com", password: "Grace pass 123" })).status).toBe(200);
  return { ...t, owner, staff, guest };
}

describe("a guest's day", () => {
  it("orders food, pays, and gets it delivered by a rider", async () => {
    const { owner, staff, guest } = await hotel();
    // The super admin sets up the restaurant, a dish with portions, and a delivery zone.
    expect((await owner("PUT", "/api/menu/settings", { outlets: [{ key: "main", name: "Main restaurant" }], clientOutlets: ["main"] })).status).toBe(200);
    const beef = (await owner("POST", "/api/menu/items", {
      outlet: "main", section: "Grill", name: "Fried beef", price: 20000, prepMinutes: 40,
      options: [{ key: "portion", name: "Portion", required: true, multiple: false, choices: [{ key: "half", name: "Half kg", priceDelta: 0 }, { key: "1kg", name: "1 kg", priceDelta: 18000 }] }],
    })).body as { id: string };
    await owner("PUT", "/api/delivery/rules", { zones: [{ zone: "kakoba", name: "Kakoba", fee: 5000, minutes: 25 }], assignment: "dispatcher", proof: "code", ridersCarryCash: true, cashLimit: 0, payPerTrip: 2000 });

    // The guest sees the public menu and their own profile, never the staff tools.
    expect(((await guest("GET", "/api/menu/items")).body["items"] as unknown[]).length).toBe(1);
    expect((await guest("GET", "/api/crm/me")).body).toMatchObject({ name: "Grace", tags: [] });
    expect((await guest("GET", "/api/crm/guests")).status).toBe(403);
    expect((await guest("PUT", "/api/orders/rules", {})).status).toBe(403);
    expect((await guest("POST", "/api/menu/items", {})).status).toBe(403);

    // Pre-order: "1 kg of fried beef, we arrive later". Too soon is refused.
    const line = { itemId: beef.id, quantity: 1, options: ["portion:1kg"] };
    const soon = new Date(Date.now() + 10 * 60_000).toISOString();
    expect((await guest("POST", "/api/orders", { outlet: "main", type: "pre_order", lines: [line], arriveAt: soon })).status).toBe(400);
    const arrive = new Date(Date.now() + 3 * 3_600_000).toISOString();
    const pre = (await guest("POST", "/api/orders", { outlet: "main", type: "pre_order", lines: [line], arriveAt: arrive })).body as { id: string; total: number; status: string; number: string };
    expect(pre).toMatchObject({ total: 38000, status: "awaiting_payment", number: "F-0001" });

    // MoMo is built but off until the hotel agrees it; the cashier takes the 50% deposit in cash.
    const methods = (await guest("GET", "/api/payments/methods?module=food-ordering&outlet=main")).body["items"] as unknown[];
    expect(methods).toEqual([]);
    expect((await guest("POST", "/api/payments/pay", { module: "food-ordering", recordId: pre.id, method: "mtn_momo", phone: "0772123456" })).status).toBe(403);
    expect((await guest("POST", "/api/payments/record", { module: "food-ordering", recordId: pre.id, method: "cash" })).status).toBe(403);
    const cashier = await staff("Carol", ["role_cashier"]);
    expect((await cashier.call("POST", "/api/payments/record", { module: "food-ordering", recordId: pre.id, method: "cash", amount: 1000 })).status).toBe(400);
    expect((await cashier.call("POST", "/api/payments/record", { module: "food-ordering", recordId: pre.id, method: "cash", amount: 19000 })).body).toMatchObject({ status: "succeeded" });
    expect((await guest("GET", `/api/orders/${pre.id}`)).body).toMatchObject({ status: "received", paid: 19000 });
    // Turned on without keys, MoMo says exactly what is missing.
    const settings = (await owner("GET", "/api/payments/settings")).body as { methods: Record<string, { enabled: boolean }> };
    settings.methods["mtn_momo"] = { enabled: true, outlets: [], modules: [] } as never;
    expect((await owner("PUT", "/api/payments/settings", settings)).status).toBe(200);
    const momo = await guest("POST", "/api/payments/pay", { module: "food-ordering", recordId: pre.id, method: "mtn_momo", phone: "0772123456" });
    expect(momo.status).toBe(503);
    expect(String(momo.body["message"])).toMatch(/mtn_momo\.api_user/);

    // A delivery to Kakoba: paid in full first, delivery fee added.
    const order = (await guest("POST", "/api/orders", { outlet: "main", type: "delivery", lines: [{ ...line, options: ["portion:half"] }], deliverTo: { label: "Plot 12, Kakoba", zone: "kakoba", lat: null, lng: null } })).body as { id: string; total: number };
    expect(order.total).toBe(25000);
    await cashier.call("POST", "/api/payments/record", { module: "food-ordering", recordId: order.id, method: "cash" });

    // The kitchen cooks it; a guest cannot move orders.
    const chef = await staff("Chris", ["role_chef"]);
    expect((await guest("POST", `/api/orders/${order.id}/status`, { status: "preparing" })).status).toBe(403);
    expect((await chef.call("POST", `/api/orders/${order.id}/status`, { status: "preparing" })).body).toMatchObject({ status: "preparing" });
    expect((await chef.call("POST", `/api/orders/${order.id}/status`, { status: "ready" })).body).toMatchObject({ status: "ready", next: [] });

    // The rider goes online; the dispatcher assigns; the rider picks up.
    const rider = await staff("Ronald", ["role_delivery-rider"]);
    const dispatcher = await staff("Dina", ["role_dispatcher"]);
    expect((await rider.call("POST", "/api/delivery/rider/online", { online: true })).body).toMatchObject({ online: true });
    const board = (await dispatcher.call("GET", "/api/delivery/board")).body as { waiting: { id: string; code?: string }[] };
    expect(board.waiting).toHaveLength(1);
    expect(board.waiting[0]?.code).toBeUndefined();
    const jobId = board.waiting[0]?.id ?? "";
    expect((await rider.call("GET", "/api/delivery/board")).status).toBe(403);
    expect((await dispatcher.call("POST", `/api/delivery/jobs/${jobId}/assign`, { riderUserId: rider.userId })).body).toMatchObject({ status: "assigned", riderName: "Ronald" });
    await rider.call("POST", `/api/delivery/jobs/${jobId}/accept`);
    expect((await rider.call("POST", `/api/delivery/jobs/${jobId}/pickup`)).body).toMatchObject({ status: "picked_up" });
    expect((await guest("GET", `/api/orders/${order.id}`)).body).toMatchObject({ status: "on_the_way" });

    // The guest follows it and reads the code to the rider at the door.
    const track = (await guest("GET", `/api/delivery/track/${order.id}`)).body as { code: string; riderName: string };
    expect(track.riderName).toBe("Ronald");
    expect((await rider.call("POST", `/api/delivery/jobs/${jobId}/deliver`, { code: track.code === "0000" ? "1111" : "0000" })).status).toBe(400);
    expect((await rider.call("POST", `/api/delivery/jobs/${jobId}/deliver`, { code: track.code })).body).toMatchObject({ status: "delivered" });
    expect((await guest("GET", `/api/orders/${order.id}`)).body).toMatchObject({ status: "delivered" });
    expect((await rider.call("GET", "/api/delivery/rider/me")).body).toMatchObject({ tripsToday: 1, earningsToday: 2000 });

    // Everything is in the Audit Trail.
    const audit = (await owner("GET", "/api/audit/entries?module=food-ordering")).body["items"] as { action: string }[];
    expect(audit.map((e) => e.action)).toEqual(expect.arrayContaining(["order.placed", "order.received", "order.on_the_way", "order.delivered"]));
  });

  it("books a room, a pool pass and a shop item", async () => {
    const { owner, staff, guest } = await hotel();
    // The super admin adds one deluxe room, a morning pool session and a craft basket (2 in stock).
    const room = (await owner("POST", "/api/rooms/offerings", { kind: "nights", name: "Deluxe room", price: 150000, capacity: 1, details: { beds: "1 king" } })).body as { id: string };
    const pass = (await owner("POST", "/api/pool/offerings", { kind: "slot", name: "Morning swim", price: 10000, capacity: 30, slots: ["08:00", "10:00"] })).body as { id: string };
    const basket = (await owner("POST", "/api/shop/offerings", { kind: "stock", name: "Ankole basket", price: 45000, capacity: 2 })).body as { id: string };
    expect((await owner("POST", "/api/rooms/offerings", { kind: "slot", name: "Wrong", price: 1, capacity: 1 })).status).toBe(400);
    expect((await guest("POST", "/api/rooms/offerings", { kind: "nights", name: "Mine", price: 1, capacity: 1 })).status).toBe(403);

    // Two nights in the deluxe room; the same night again is full.
    const stay = (await guest("POST", "/api/rooms/bookings", { offeringId: room.id, units: 1, date: day(10), endDate: day(12) })).body as { code: string; total: number; status: string };
    expect(stay).toMatchObject({ total: 300000, status: "confirmed" });
    expect(stay.code).toMatch(/^RB-/);
    expect((await guest("POST", "/api/rooms/bookings", { offeringId: room.id, units: 1, date: day(11), endDate: day(13) })).status).toBe(409);
    expect((await guest("GET", `/api/rooms/offerings/${room.id}/availability?date=${day(12)}&endDate=${day(13)}`)).body).toEqual({ left: 1 });

    // A pool pass for 3 people at 10:00, scanned at the pool entry once.
    const ticket = (await guest("POST", "/api/pool/bookings", { offeringId: pass.id, units: 3, date: day(0), slot: "10:00" })).body as { qr: string; total: number };
    expect(ticket.total).toBe(30000);
    const lifeguard = await staff("Leo", ["role_pool-attendant"]);
    expect((await guest("POST", "/api/pool/check-in", { code: ticket.qr })).status).toBe(403);
    expect((await lifeguard.call("POST", "/api/pool/check-in", { code: ticket.qr })).body).toMatchObject({ status: "checked_in" });
    expect((await lifeguard.call("POST", "/api/pool/check-in", { code: ticket.qr })).status).toBe(409);

    // Two baskets leave the shelf; a third is refused; cancelling puts one back.
    const buy = (await guest("POST", "/api/shop/bookings", { offeringId: basket.id, units: 2 })).body as { id: string };
    expect((await guest("POST", "/api/shop/bookings", { offeringId: basket.id, units: 1 })).status).toBe(409);
    await guest("POST", `/api/shop/bookings/${buy.id}/cancel`, { reason: "Changed my mind" });
    expect(((await guest("GET", `/api/shop/offerings/${basket.id}`)).body as { capacity: number }).capacity).toBe(2);
    expect(((await guest("GET", "/api/rooms/bookings/mine")).body["items"] as unknown[]).length).toBe(1);

    // The super admin switches the pool off; rooms keep working.
    expect((await owner("PATCH", "/api/admin/modules/pool", { enabled: false })).status).toBe(200);
    expect((await guest("GET", "/api/pool/offerings")).status).toBe(503);
    expect((await guest("GET", "/api/rooms/offerings")).status).toBe(200);
  });
});
