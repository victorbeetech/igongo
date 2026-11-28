/**
 * End-to-end test of points at checkout on the real routes (PGlite): the
 * super admin turns the programme on and grants points, a guest spends them
 * on a takeaway order, cancels it and gets them back, and the switch off
 * hides everything and refuses spending.
 */

import { describe, expect, it } from "vitest";
import { testApi } from "./helpers";

const RULES = { enabled: true, pointsPer1000Ugx: 1, signupBonus: 0, minimumToRedeem: 5, ugxPerPoint: 10, expiryDays: 365 };

describe("points at checkout", () => {
  it("spends points on an order, returns them on cancel, and hides everything while off", async () => {
    const t = await testApi();
    const owner = await t.owner();

    // The restaurant and one dish, for a takeaway order.
    await owner("PUT", "/api/menu/settings", { outlets: [{ key: "main", name: "Main restaurant" }], clientOutlets: ["main"] });
    const dish = (await owner("POST", "/api/menu/items", { outlet: "main", section: "Grill", name: "Fried beef", price: 20000, prepMinutes: 30, options: [] })).body as { id: string };

    // The owner turns the programme on, then grants a guest 50 points by hand.
    expect((await owner("PUT", "/api/points/admin/rules", RULES)).status).toBe(200);
    const guest = t.phone();
    const signUp = await guest("POST", "/api/auth/sign-up/email", { name: "Grace", email: "grace@example.com", password: "Grace pass 123" });
    const guestId = String((signUp.body["user"] as { id: string }).id);
    expect((await owner("POST", "/api/points/admin/adjust", { guestId, points: 50, note: "Welcome gift", key: "welcome-grace-1" })).status).toBe(200);

    // The guest sees the balance and the public rules.
    expect(await guest("GET", "/api/points/rules")).toMatchObject({ status: 200, body: { enabled: true, minimumToRedeem: 5 } });
    expect((await guest("GET", "/api/points/me")).body).toMatchObject({ enabled: true, balance: 50, valueUgx: 500 });

    // Spend 10 points (100 UGX off) on a takeaway.
    const line = { itemId: dish.id, quantity: 1, options: [] };
    const placed = await guest("POST", "/api/orders", { outlet: "main", type: "takeaway", lines: [line], pointsToSpend: 10, requestKey: "checkout-key-001" });
    expect(placed.status).toBe(201);
    expect(placed.body).toMatchObject({ pointsSpent: 10, pointsDiscount: 100 });
    const orderId = String(placed.body["id"]);
    expect((await guest("GET", "/api/points/me")).body).toMatchObject({ balance: 40 });

    // Cancelling the order gives the points back, once.
    expect((await guest("POST", `/api/orders/${orderId}/cancel`, { reason: "Changed my mind" })).status).toBe(200);
    expect((await guest("GET", "/api/points/me")).body).toMatchObject({ balance: 50 });

    // Switch the programme off: guests see nothing, and spending is refused.
    expect((await owner("PUT", "/api/points/admin/rules", { ...RULES, enabled: false })).status).toBe(200);
    expect((await guest("GET", "/api/points/rules")).body).toEqual({ enabled: false });
    expect((await guest("GET", "/api/points/me")).body).toEqual({ enabled: false });
    const refused = await guest("POST", "/api/orders", { outlet: "main", type: "takeaway", lines: [line], pointsToSpend: 10, requestKey: "checkout-key-002" });
    expect(refused.status).toBe(503);
  });
});
