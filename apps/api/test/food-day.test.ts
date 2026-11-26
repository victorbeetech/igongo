/**
 * End-to-end test of the food side and the delivery tracker (phase A) on
 * PGlite: promo and voucher codes rechecked on the server, a scheduled
 * delivery, a double-tapped checkout, live tracking of food and of a parcel,
 * ratings and reviews, reorder at today's prices, payment preview mode,
 * and the 403 every person gets on someone else's order or delivery.
 */

import { describe, expect, it } from "vitest";
import { testApi } from "./helpers";

/** A hotel with a restaurant, a dish, a delivery zone, staff with pre-made roles, and two guests. */
async function hotel() {
  const t = await testApi();
  // The owner: set-up claimed and 2-step on, as the console requires.
  const owner = await t.owner();

  /** A signed-in staff account holding [roleIds]. */
  async function staff(name: string, roleIds: string[]) {
    const email = `${name.toLowerCase()}@example.com`;
    const created = (await owner("POST", "/api/users", { name, email, password: `${name} pass 1234` })).body as { id: string };
    for (const roleId of roleIds) expect((await owner("POST", `/api/access/users/${created.id}/roles`, { roleId })).status).toBe(204);
    const call = t.browser();
    expect((await call("POST", "/api/auth/sign-in/email", { email, password: `${name} pass 1234` })).status).toBe(200);
    return { call, userId: created.id };
  }

  /** A guest who signed up in the app. */
  async function guest(name: string) {
    // Guests use the app.
    const call = t.phone();
    const res = await call("POST", "/api/auth/sign-up/email", { name, email: `${name.toLowerCase()}@example.com`, password: `${name} pass 123` });
    expect(res.status).toBe(200);
    return { call, userId: String((res.body["user"] as { id: string }).id) };
  }

  // The restaurant, a dish with portions, a chapati, and the Kakoba zone.
  await owner("PUT", "/api/menu/settings", { outlets: [{ key: "main", name: "Main restaurant" }], clientOutlets: ["main"] });
  const beef = (await owner("POST", "/api/menu/items", {
    outlet: "main", section: "Grill", name: "Fried beef", price: 20000, prepMinutes: 30,
    options: [{ key: "portion", name: "Portion", required: true, multiple: false, choices: [{ key: "half", name: "Half kg", priceDelta: 0 }, { key: "1kg", name: "1 kg", priceDelta: 18000 }] }],
  })).body as { id: string };
  const chapati = (await owner("POST", "/api/menu/items", { outlet: "main", section: "Sides", name: "Chapati", price: 2000, prepMinutes: 10, options: [] })).body as { id: string };
  await owner("PUT", "/api/delivery/rules", { zones: [{ zone: "kakoba", name: "Kakoba", fee: 5000, minutes: 25 }], assignment: "dispatcher", proof: "code", ridersCarryCash: true, cashLimit: 0, payPerTrip: 2000 });
  return { ...t, owner, staff, guest, beef, chapati };
}

const kakoba = { label: "Plot 12, Kakoba", zone: "kakoba", lat: null, lng: null };

describe("the food side", () => {
  it("rechecks promos and vouchers on the server, schedules, and never orders twice", async () => {
    const { staff, guest, beef, chapati } = await hotel();
    const grace = await guest("Grace");
    const marketing = await staff("Mary", ["role_sales-marketing-manager"]);
    const line = { itemId: beef.id, quantity: 2, options: ["portion:half"] };

    // Marketing makes EASTER10 live for food, and issues a 15,000 voucher.
    const promo = (await marketing.call("POST", "/api/promotions/records", { type: "promotion", title: "Easter", fields: { name: "Easter", code: "easter10", discount: 10, where: "food" } })).body as { id: string };
    expect((await marketing.call("POST", `/api/promotions/records/${promo.id}/status`, { status: "live" })).status).toBe(200);
    const voucher = (await marketing.call("POST", "/api/promotions/records", { type: "voucher", title: "Gift for Grace", fields: { holder: "Grace", value: 15000 } })).body as { id: string; code: string };
    expect((await marketing.call("POST", `/api/promotions/records/${voucher.id}/status`, { status: "issued" })).status).toBe(200);

    // A guest's own voucher request never works until an approver issues it.
    const mine = (await grace.call("POST", "/api/promotions/records", { type: "voucher", title: "Mine", fields: { holder: "Grace", value: 900000 } })).body as { code: string; status: string };
    expect(mine.status).toBe("requested");
    expect((await grace.call("POST", "/api/orders/quote", { outlet: "main", type: "takeaway", lines: [line], promoCode: mine.code })).status).toBe(400);
    expect((await grace.call("POST", "/api/orders/quote", { outlet: "main", type: "takeaway", lines: [line], promoCode: "NOPE99" })).status).toBe(400);

    // The server prices it: 40,000 food, 10% off, plus the 5,000 delivery fee.
    const quote = (await grace.call("POST", "/api/orders/quote", { outlet: "main", type: "delivery", lines: [line], deliverTo: kakoba, promoCode: "Easter10" })).body;
    expect(quote).toMatchObject({ subtotal: 40000, discount: 4000, deliveryFee: 5000, total: 41000 });
    // A total sent by the app is ignored (it is not even part of the order).
    const placed = (await grace.call("POST", "/api/orders", { outlet: "main", type: "delivery", lines: [line], deliverTo: kakoba, promoCode: "EASTER10", total: 1, requestKey: "checkout-0001" })).body as { id: string; total: number; promoCode: string };
    expect(placed).toMatchObject({ total: 41000, promoCode: "EASTER10" });

    // A double tap with the same checkout key gets the same order back.
    const again = (await grace.call("POST", "/api/orders", { outlet: "main", type: "delivery", lines: [line], deliverTo: kakoba, promoCode: "EASTER10", requestKey: "checkout-0001" })).body as { id: string };
    expect(again.id).toBe(placed.id);
    expect(((await grace.call("GET", "/api/orders/mine")).body["items"] as unknown[]).length).toBe(1);

    // The voucher takes 15,000 off once; a second use is refused; cancelling gives it back.
    const withVoucher = (await grace.call("POST", "/api/orders", { outlet: "main", type: "takeaway", lines: [{ itemId: chapati.id, quantity: 10, options: [] }], promoCode: voucher.code.toLowerCase() })).body as { id: string; total: number; discount: number };
    expect(withVoucher).toMatchObject({ discount: 15000, total: 5000 });
    expect((await grace.call("POST", "/api/orders/quote", { outlet: "main", type: "takeaway", lines: [line], promoCode: voucher.code })).status).toBe(400);
    expect((await grace.call("POST", `/api/orders/${withVoucher.id}/cancel`, { reason: "Changed my mind" })).status).toBe(200);
    expect((await grace.call("POST", "/api/orders/quote", { outlet: "main", type: "takeaway", lines: [line], promoCode: voucher.code })).body).toMatchObject({ discount: 15000 });

    // Scheduled delivery: ready in time to travel; too soon, too far ahead, or for dine-in is refused.
    const at = new Date(Date.now() + 26 * 3_600_000);
    const later = (await grace.call("POST", "/api/orders", { outlet: "main", type: "delivery", lines: [line], deliverTo: kakoba, arriveAt: at.toISOString() })).body as { readyAt: string };
    expect(new Date(later.readyAt).getTime()).toBe(at.getTime() - 25 * 60_000);
    expect((await grace.call("POST", "/api/orders/quote", { outlet: "main", type: "delivery", lines: [line], deliverTo: kakoba, arriveAt: new Date(Date.now() + 20 * 60_000).toISOString() })).status).toBe(400);
    expect((await grace.call("POST", "/api/orders/quote", { outlet: "main", type: "delivery", lines: [line], deliverTo: kakoba, arriveAt: new Date(Date.now() + 9 * 86_400_000).toISOString() })).status).toBe(400);
    expect((await grace.call("POST", "/api/orders/quote", { outlet: "main", type: "dine_in", lines: [line], arriveAt: at.toISOString() })).status).toBe(400);

    // Another guest gets 403 on Grace's order, its tracker and its reorder.
    const tom = await guest("Tom");
    expect((await tom.call("GET", `/api/orders/${placed.id}`)).status).toBe(403);
    expect((await tom.call("GET", `/api/orders/${placed.id}/reorder`)).status).toBe(403);
    expect((await tom.call("POST", `/api/orders/${placed.id}/cancel`, { reason: "Not mine" })).status).toBe(403);
    // Quantities outside 1 to 100 are refused by the server.
    expect((await grace.call("POST", "/api/orders/quote", { outlet: "main", type: "takeaway", lines: [{ ...line, quantity: 0 }] })).status).toBe(400);
  });

  it("tracks food and a parcel, then takes ratings, reviews and a reorder", async () => {
    const { owner, staff, guest, beef, client } = await hotel();
    const grace = await guest("Grace");
    const tom = await guest("Tom");
    const cashier = await staff("Carol", ["role_cashier"]);
    const chef = await staff("Chris", ["role_chef"]);
    const rider = await staff("Ronald", ["role_delivery-rider"]);
    const dispatcher = await staff("Dina", ["role_dispatcher"]);
    // Grace's phone is registered, so every status change runs the push path.
    expect((await grace.call("POST", "/api/notifications/devices", { token: "grace-phone-token-0123456789", platform: "android" })).status).toBeLessThan(300);

    // A food delivery, paid, cooked and handed to the rider.
    const order = (await grace.call("POST", "/api/orders", { outlet: "main", type: "delivery", lines: [{ itemId: beef.id, quantity: 1, options: ["portion:1kg"] }], deliverTo: kakoba })).body as { id: string; total: number };
    await cashier.call("POST", "/api/payments/record", { module: "food-ordering", recordId: order.id, method: "cash" });
    await chef.call("POST", `/api/orders/${order.id}/status`, { status: "preparing" });
    await chef.call("POST", `/api/orders/${order.id}/status`, { status: "ready" });
    await rider.call("POST", "/api/delivery/rider/online", { online: true });

    // The dispatcher also sends Grace's laundry; a guest or rider cannot.
    const parcelBody = { source: "laundry", what: "2 bags of laundry", customer: { name: "Grace", userId: grace.userId }, place: { label: "Cottage 4", zone: null, lat: null, lng: null } };
    expect((await grace.call("POST", "/api/delivery/jobs", parcelBody)).status).toBe(403);
    expect((await rider.call("POST", "/api/delivery/jobs", parcelBody)).status).toBe(403);
    expect((await dispatcher.call("POST", "/api/delivery/jobs", { ...parcelBody, source: "food" })).status).toBe(400);
    const parcel = (await dispatcher.call("POST", "/api/delivery/jobs", parcelBody)).body as { id: string; orderNumber: string; source: string };
    expect(parcel).toMatchObject({ orderNumber: "D-0001", source: "laundry" });

    // Grace's tracker lists both, waiting.
    const mine = (await grace.call("GET", "/api/delivery/mine")).body as { active: { jobId: string; reference: string; status: string }[] };
    expect(mine.active.map((t) => t.reference).sort()).toEqual(["D-0001", "F-0001"]);
    const foodJob = mine.active.find((t) => t.reference === "F-0001")?.jobId ?? "";

    // Assigned, picked up, and the rider's location shows only while on the road.
    for (const id of [foodJob, parcel.id]) {
      await dispatcher.call("POST", `/api/delivery/jobs/${id}/assign`, { riderUserId: rider.userId });
      await rider.call("POST", `/api/delivery/jobs/${id}/accept`);
    }
    expect(((await grace.call("GET", `/api/delivery/track/job/${foodJob}`)).body as { rider: unknown }).rider).toBeNull();
    await rider.call("POST", `/api/delivery/jobs/${foodJob}/pickup`);
    await rider.call("POST", "/api/delivery/rider/location", { lat: -0.6072, lng: 30.6545 });
    const track = (await grace.call("GET", `/api/delivery/track/${order.id}`)).body as { code: string; rider: { lat: number }; eta: string; steps: { step: string; done: boolean }[] };
    expect(track.rider.lat).toBeCloseTo(-0.6072);
    expect(track.eta).toBeTruthy();
    expect(track.steps.map((s) => s.done)).toEqual([true, true, true, false]);
    expect((await grace.call("GET", `/api/orders/${order.id}`)).body).toMatchObject({ status: "on_the_way" });
    // Tom sees none of it.
    expect((await tom.call("GET", `/api/delivery/track/job/${foodJob}`)).status).toBe(403);
    expect((await tom.call("GET", `/api/delivery/track/${order.id}`)).status).toBe(403);
    expect(((await tom.call("GET", "/api/delivery/mine")).body as { active: unknown[] }).active).toEqual([]);

    // Both delivered with Grace's codes.
    await rider.call("POST", `/api/delivery/jobs/${foodJob}/deliver`, { code: track.code });
    await rider.call("POST", `/api/delivery/jobs/${parcel.id}/pickup`);
    const parcelCode = ((await grace.call("GET", `/api/delivery/track/job/${parcel.id}`)).body as { code: string }).code;
    expect((await rider.call("POST", `/api/delivery/jobs/${parcel.id}/deliver`, { code: parcelCode })).body).toMatchObject({ status: "delivered" });
    const finished = (await grace.call("GET", "/api/delivery/mine")).body as { active: unknown[]; done: unknown[] };
    expect(finished).toMatchObject({ active: [] });
    expect(finished.done).toHaveLength(2);

    // Ratings: only Grace, only once, only after delivery.
    expect((await tom.call("POST", `/api/orders/${order.id}/rating`, { food: 1 })).status).toBe(403);
    expect((await grace.call("POST", `/api/orders/${order.id}/rating`, { food: 6 })).status).toBe(400);
    expect((await grace.call("POST", `/api/orders/${order.id}/rating`, { food: 5, delivery: 4, comment: "<b>Lovely</b> beef" })).status).toBe(201);
    expect((await grace.call("POST", `/api/orders/${order.id}/rating`, { food: 5 })).status).toBe(409);
    expect(((await grace.call("GET", "/api/orders/mine")).body["items"] as { rated: boolean }[])[0]?.rated).toBe(true);

    // The menu shows the dish's stars and the review: first name only, the words kept as plain text.
    expect((await tom.call("GET", "/api/orders/stars")).body["items"]).toEqual([{ itemId: beef.id, average: 5, count: 1 }]);
    const reviews = (await tom.call("GET", "/api/orders/reviews?outlet=main")).body["items"] as Record<string, unknown>[];
    expect(reviews).toEqual([expect.objectContaining({ name: "Grace", food: 5, delivery: 4, comment: "<b>Lovely</b> beef" })]);
    expect(reviews[0]).not.toHaveProperty("userId");
    // Staff can hide a review; guests cannot see hidden ones or the staff list.
    expect((await tom.call("GET", "/api/orders/reviews?all=1")).status).toBe(403);
    expect((await tom.call("POST", `/api/orders/reviews/${order.id}/hide`, { hidden: true })).status).toBe(403);
    const manager = await staff("Fred", ["role_fnb-manager"]);
    expect((await manager.call("POST", `/api/orders/reviews/${order.id}/hide`, { hidden: true })).status).toBe(204);
    expect((await tom.call("GET", "/api/orders/reviews")).body["items"]).toEqual([]);

    // Reorder: today's price, and a dish that sold out is left out by name.
    await client.exec(`update menu.items set price = 25000`);
    const again = (await grace.call("GET", `/api/orders/${order.id}/reorder`)).body as { lines: unknown[]; missing: string[]; quote: { subtotal: number } };
    expect(again).toMatchObject({ missing: [], quote: { subtotal: 43000 } });
    expect(again.lines).toHaveLength(1);

    // Everything is in the Audit Trail.
    const audit = (await owner("GET", "/api/audit/entries?module=delivery-riders")).body["items"] as { action: string }[];
    expect(audit.map((e) => e.action)).toEqual(expect.arrayContaining(["delivery.opened", "delivery.picked_up", "delivery.delivered"]));
  });

  it("previews gateways without keys and never charges a double tap twice", async () => {
    const { owner, staff, guest, beef } = await hotel();
    const grace = await guest("Grace");
    const order = (await grace.call("POST", "/api/orders", { outlet: "main", type: "takeaway", lines: [{ itemId: beef.id, quantity: 1, options: ["portion:half"] }] })).body as { id: string };

    // No keys yet: MTN, Airtel and card show as preview only, never payable.
    const methods = (await grace.call("GET", "/api/payments/methods?module=food-ordering&outlet=main")).body as { items: unknown[]; preview: { method: string; preview: boolean }[] };
    expect(methods.items).toEqual([]);
    expect(methods.preview.map((m) => m.method)).toEqual(["mtn_momo", "airtel_money", "card"]);
    expect(methods.preview.every((m) => m.preview)).toBe(true);
    // The super admin sees which gateways are connected; a guest cannot.
    expect((await owner("GET", "/api/payments/connections")).body).toEqual({ mtn_momo: false, airtel_money: false, card: false });
    expect((await grace.call("GET", "/api/payments/connections")).status).toBe(403);

    // Switched on but still without keys: still a preview, and paying says what is missing.
    const settings = (await owner("GET", "/api/payments/settings")).body as { methods: Record<string, unknown>; showPreview: boolean };
    expect(settings.showPreview).toBe(true);
    settings.methods["mtn_momo"] = { enabled: true, outlets: [], modules: [] };
    expect((await owner("PUT", "/api/payments/settings", settings)).status).toBe(200);
    expect(((await grace.call("GET", "/api/payments/methods?module=food-ordering&outlet=main")).body as { items: unknown[] }).items).toEqual([]);
    expect((await grace.call("POST", "/api/payments/pay", { module: "food-ordering", recordId: order.id, method: "mtn_momo", phone: "0772123456" })).status).toBe(503);

    // Preview mode off (for the App Store build): nothing greyed out is shown.
    expect((await owner("PUT", "/api/payments/settings", { ...settings, showPreview: false })).status).toBe(200);
    expect(((await grace.call("GET", "/api/payments/methods?module=food-ordering&outlet=main")).body as { preview: unknown[] }).preview).toEqual([]);

    // Tom cannot pay for, or read the payments of, Grace's order.
    const tom = await guest("Tom");
    expect((await tom.call("POST", "/api/payments/pay", { module: "food-ordering", recordId: order.id, method: "mtn_momo", phone: "0772123456" })).status).toBe(403);
    // The till records cash once; the bill is then settled.
    const cashier = await staff("Carol", ["role_cashier"]);
    expect((await cashier.call("POST", "/api/payments/record", { module: "food-ordering", recordId: order.id, method: "cash" })).body).toMatchObject({ status: "succeeded" });
    expect((await cashier.call("POST", "/api/payments/record", { module: "food-ordering", recordId: order.id, method: "cash" })).status).toBe(409);
  });
});
