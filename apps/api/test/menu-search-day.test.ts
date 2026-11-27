/**
 * Global search over the menu (S00-25), end to end on PGlite: a guest finds
 * dishes and outlets the client view shows, out-of-stock dishes show as
 * unavailable, and switched-off, hidden and staff-only dishes never appear.
 * Bad or missing search text is refused with a 400.
 */

import { describe, expect, it } from "vitest";
import { testApi } from "./helpers";

/** The hotel: one client outlet and one hidden outlet, with a few dishes. */
async function hotel() {
  const t = await testApi();
  const owner = await t.owner();
  // Step 1: outlets. The pool bar exists but guests do not see it.
  await owner("PUT", "/api/menu/settings", {
    outlets: [{ key: "main", name: "Main restaurant" }, { key: "pool-bar", name: "Pool bar" }],
    clientOutlets: ["main"],
  });
  // Step 2: dishes. Each one tests a different rule.
  const add = async (body: Record<string, unknown>) => (await owner("POST", "/api/menu/items", { section: "Grill", prepMinutes: 20, options: [], ...body })).body as { id: string };
  const beef = await add({ outlet: "main", name: "Fried beef", price: 20000 });
  const tikka = await add({ outlet: "main", name: "Beef tikka", price: 18000 });
  await add({ outlet: "main", name: "Beef hidden", price: 9000, visibleToClients: false });
  await add({ outlet: "main", name: "Beef switched off", price: 9000, active: false });
  await add({ outlet: "pool-bar", name: "Beef at the pool", price: 12000 });
  // Step 3: tikka is out of stock today.
  expect((await owner("POST", `/api/menu/items/${tikka.id}/stock`, { inStock: false })).status).toBe(200);
  return { ...t, beef, tikka };
}

describe("menu search for guests", () => {
  it("finds only the dishes the client view shows, with today's availability", async () => {
    const h = await hotel();
    const guest = h.phone();
    const res = await guest("GET", "/api/menu/search?q=beef");
    expect(res.status).toBe(200);
    const items = res.body["items"] as Array<{ name: string; available: boolean; price: number }>;
    // Fried beef and Beef tikka only: the hidden, switched-off and pool-bar dishes stay out.
    expect(items.map((i) => i.name).sort()).toEqual(["Beef tikka", "Fried beef"]);
    expect(items.find((i) => i.name === "Beef tikka")?.available).toBe(false);
    expect(items.find((i) => i.name === "Fried beef")?.available).toBe(true);
  });

  it("finds client outlets by name and leaves out the hidden one", async () => {
    const h = await hotel();
    const guest = h.phone();
    expect(((await guest("GET", "/api/menu/search?q=restaurant")).body["outlets"] as unknown[])).toEqual([{ key: "main", name: "Main restaurant" }]);
    expect((await guest("GET", "/api/menu/search?q=pool")).body).toEqual({ items: [], outlets: [] });
  });

  it("refuses search text that is too short, too long or missing", async () => {
    const h = await hotel();
    const guest = h.phone();
    expect((await guest("GET", "/api/menu/search?q=b")).status).toBe(400);
    expect((await guest("GET", "/api/menu/search?q=%20%20")).status).toBe(400);
    expect((await guest("GET", `/api/menu/search?q=${"x".repeat(61)}`)).status).toBe(400);
    expect((await guest("GET", "/api/menu/search")).status).toBe(400);
  });
});
