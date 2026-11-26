/** Menus & Catalogue's pure rule: out of stock lasts only for the hotel day it was set. */

import { describe, expect, it } from "vitest";
import { isAvailable, type MenuItem } from "../src/domain/menu-item";

const item: MenuItem = { id: "itm_1", outlet: "main", section: "Grill", name: "Fried beef", description: null, price: 1, prepMinutes: 40, options: [], tags: [], allergens: [], photoUrl: null, active: true, visibleToClients: true, outOfStockOn: null, sortOrder: 0, updatedAt: new Date() };

describe("availability", () => {
  it("is off for the day it was marked out, and back the next hotel day", () => {
    const marked = { ...item, outOfStockOn: "2026-11-25" };
    expect(isAvailable(marked, new Date("2026-11-25T20:00:00Z"))).toBe(false); // 23:00 on the 25th
    expect(isAvailable(marked, new Date("2026-11-25T21:30:00Z"))).toBe(true); // 00:30 on the 26th
    expect(isAvailable({ ...item, active: false }, new Date())).toBe(false);
  });
});
