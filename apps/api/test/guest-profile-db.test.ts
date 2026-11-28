/**
 * The profile numbers on the real database (PGlite): a guest places and gets
 * a dine-in order delivered, and the profile shows the order and the points
 * from Points rewards. A second guest sees only their own numbers, and nobody
 * sees them without signing in.
 */

import { describe, expect, it } from "vitest";
import { testApi } from "./helpers";

/** The stats shape the app reads. */
type Stats = { bookings: number; orders: number; points: number };

describe("the guest's profile numbers", () => {
  it("counts the guest's own orders and points, and nothing of anyone else's", async () => {
    const t = await testApi();
    const owner = await t.owner();
    // The super admin sets up the restaurant and a dish costing 20,000 UGX (the dish is ordered below).
    await owner("PUT", "/api/menu/settings", { outlets: [{ key: "main", name: "Main restaurant" }], clientOutlets: ["main"] });
    const dish = (await owner("POST", "/api/menu/items", { outlet: "main", section: "Grill", name: "Fried beef", price: 20000, prepMinutes: 40 })).body as { id: string };
    // The super admin switches Points rewards on at 2 points per 1,000 UGX, with no sign-up bonus.
    const RULES = { enabled: true, pointsPer1000Ugx: 2, signupBonus: 0, minimumToRedeem: 1, ugxPerPoint: 10, expiryDays: 365 };
    expect((await owner("PUT", "/api/points/admin/rules", RULES)).status).toBe(200);

    // Two guests sign up in the app.
    const ama = t.phone();
    const bola = t.phone();
    const amaSignUp = await ama("POST", "/api/auth/sign-up/email", { name: "Ama", email: "ama@example.com", password: "Ama pass 1234" });
    const amaId = String((amaSignUp.body["user"] as { id: string }).id);
    await bola("POST", "/api/auth/sign-up/email", { name: "Bola", email: "bola@example.com", password: "Bola pass 1234" });

    // Before anything, every number is zero (the app shows a dash).
    expect((await ama("GET", "/api/me/stats")).body).toEqual({ bookings: 0, orders: 0, points: 0 });

    // Ama eats in: the order is placed, then the kitchen and staff deliver it.
    const placed = await ama("POST", "/api/orders", { outlet: "main", type: "dine_in", lines: [{ itemId: dish.id, quantity: 1, options: [] }] });
    expect(placed.status).toBe(201);
    const orderId = (placed.body as { id: string }).id;
    for (const status of ["preparing", "ready", "delivered"]) expect((await owner("POST", `/api/orders/${orderId}/status`, { status })).status).toBe(200);

    // Ama's profile: one order. Her points come from the wallet; the super admin credits 40 here.
    expect(((await ama("GET", "/api/me/stats")).body as Stats)).toMatchObject({ bookings: 0, orders: 1, points: 0 });
    expect((await owner("POST", "/api/points/admin/adjust", { guestId: amaId, points: 40, note: "Test credit", key: "test-credit-1" })).status).toBe(200);
    expect(((await ama("GET", "/api/me/stats")).body as Stats).points).toBe(40);
    // Bola's profile is still at zero.
    expect((await bola("GET", "/api/me/stats")).body).toEqual({ bookings: 0, orders: 0, points: 0 });

    // Without a session the numbers cannot be read.
    expect((await t.phone()("GET", "/api/me/stats")).status).toBe(401);
  });
});
