/**
 * The profile numbers on the real database (PGlite): a guest saves a dish,
 * places and gets a dine-in order delivered, and the profile shows the
 * order, the points at the super admin's rate, and the saved dish. A second
 * guest sees only their own numbers, and nobody sees them without signing in.
 */

import { describe, expect, it } from "vitest";
import { testApi } from "./helpers";

/** The stats shape the app reads. */
type Stats = { bookings: number; orders: number; points: number; savedDishes: number };

describe("the guest's profile numbers", () => {
  it("counts the guest's own orders, points and saved dishes, and nothing of anyone else's", async () => {
    const t = await testApi();
    const owner = await t.owner();
    // The super admin sets up the restaurant and a dish costing 20,000 UGX.
    await owner("PUT", "/api/menu/settings", { outlets: [{ key: "main", name: "Main restaurant" }], clientOutlets: ["main"] });
    const dish = (await owner("POST", "/api/menu/items", { outlet: "main", section: "Grill", name: "Fried beef", price: 20000, prepMinutes: 40 })).body as { id: string };
    // The super admin sets the points rate: 2 points for each 1,000 UGX of delivered food.
    const rules = (await owner("GET", "/api/orders/rules")).body;
    expect((await owner("PUT", "/api/orders/rules", { ...rules, pointsPer1000: 2 })).status).toBe(200);

    // Two guests sign up in the app.
    const ama = t.phone();
    const bola = t.phone();
    await ama("POST", "/api/auth/sign-up/email", { name: "Ama", email: "ama@example.com", password: "Ama pass 1234" });
    await bola("POST", "/api/auth/sign-up/email", { name: "Bola", email: "bola@example.com", password: "Bola pass 1234" });

    // Before anything, every number is zero (the app shows a dash).
    expect((await ama("GET", "/api/me/stats")).body).toEqual({ bookings: 0, orders: 0, points: 0, savedDishes: 0 });

    // Ama saves the dish; Bola's list stays empty.
    expect((await ama("PUT", `/api/orders/dishes/${dish.id}`)).status).toBe(204);
    expect(((await bola("GET", "/api/me/stats")).body as Stats).savedDishes).toBe(0);

    // Ama eats in: the order is placed, then the kitchen and staff deliver it.
    const placed = await ama("POST", "/api/orders", { outlet: "main", type: "dine_in", lines: [{ itemId: dish.id, quantity: 1, options: [] }] });
    expect(placed.status).toBe(201);
    const orderId = (placed.body as { id: string }).id;
    for (const status of ["preparing", "ready", "delivered"]) expect((await owner("POST", `/api/orders/${orderId}/status`, { status })).status).toBe(200);

    // Ama's profile: one order, 20,000 UGX delivered = 20 steps of 1,000 at 2 points, one saved dish.
    expect((await ama("GET", "/api/me/stats")).body).toEqual({ bookings: 0, orders: 1, points: 40, savedDishes: 1 });
    // Bola's profile is still at zero.
    expect((await bola("GET", "/api/me/stats")).body).toEqual({ bookings: 0, orders: 0, points: 0, savedDishes: 0 });

    // Ama removes the dish; the count goes back to zero.
    expect((await ama("DELETE", `/api/orders/dishes/${dish.id}`)).status).toBe(204);
    expect(((await ama("GET", "/api/me/stats")).body as Stats).savedDishes).toBe(0);

    // Without a session the numbers cannot be read.
    expect((await t.phone()("GET", "/api/me/stats")).status).toBe(401);
  });
});
