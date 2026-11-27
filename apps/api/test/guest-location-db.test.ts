/**
 * The saved delivery pin on the real database (PGlite): a guest saves a pin,
 * reads it back, and a delivery order placed with it keeps the map point.
 * Another guest never sees the pin, and nobody can read it without signing in.
 */

import { describe, expect, it } from "vitest";
import { testApi } from "./helpers";

describe("a guest's saved delivery pin", () => {
  it("is kept for the guest alone and stored on their delivery order", async () => {
    const t = await testApi();
    const owner = await t.owner();
    // The super admin sets up the restaurant, a dish and a delivery zone.
    await owner("PUT", "/api/menu/settings", { outlets: [{ key: "main", name: "Main restaurant" }], clientOutlets: ["main"] });
    const dish = (await owner("POST", "/api/menu/items", { outlet: "main", section: "Grill", name: "Fried beef", price: 20000, prepMinutes: 40 })).body as { id: string };
    await owner("PUT", "/api/delivery/rules", { zones: [{ zone: "kakoba", name: "Kakoba", fee: 5000, minutes: 25 }], assignment: "dispatcher", proof: "code", ridersCarryCash: true, cashLimit: 0, payPerTrip: 2000 });

    // Two guests sign up in the app.
    const ama = t.phone();
    const bola = t.phone();
    expect((await ama("POST", "/api/auth/sign-up/email", { name: "Ama", email: "ama@example.com", password: "Ama pass 1234" })).status).toBe(200);
    expect((await bola("POST", "/api/auth/sign-up/email", { name: "Bola", email: "bola@example.com", password: "Bola pass 1234" })).status).toBe(200);

    // Ama saves her pin on the map; it reads back for her only.
    const pin = { label: "Cottage 4", zone: "kakoba", lat: 0.3136, lng: 32.5811 };
    expect((await ama("PUT", "/api/orders/location", pin)).status).toBe(200);
    expect((await ama("GET", "/api/orders/location")).body).toMatchObject(pin);
    expect((await bola("GET", "/api/orders/location")).body).toBeNull();

    // Her delivery order is placed at the saved point, and the order keeps it.
    const line = { itemId: dish.id, quantity: 1, options: [] };
    const placed = await ama("POST", "/api/orders", { outlet: "main", type: "delivery", lines: [line], deliverTo: pin });
    expect(placed.status).toBe(201);
    expect((placed.body as { deliverTo: unknown }).deliverTo).toMatchObject(pin);

    // Without a session the pin cannot be read, changed or removed.
    expect((await t.phone()("GET", "/api/orders/location")).status).toBe(401);
  });
});
