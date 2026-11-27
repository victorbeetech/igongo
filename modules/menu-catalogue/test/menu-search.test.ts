/** Menu search's pure rules: word splitting, matching, ranking and the result limits. */

import { describe, expect, it } from "vitest";
import { matchItems, matchOutlets, menuSearchResult, SEARCH_LIMITS, searchWords } from "../src/domain/menu-search";
import type { MenuItem } from "../src/domain/menu-item";

/** A dish with defaults; [over] changes what a test needs. */
const dish = (over: Partial<MenuItem>): MenuItem => ({
  id: "itm_1", outlet: "main", section: "Grill", name: "Fried beef", description: null, price: 20000, prepMinutes: 30,
  options: [], tags: [], allergens: [], photoUrl: null, active: true, visibleToClients: true, outOfStockOn: null, sortOrder: 0,
  updatedAt: new Date("2026-11-27T10:00:00Z"), ...over,
});
const now = new Date("2026-11-27T10:00:00Z");

describe("searchWords", () => {
  it("lower-cases, trims and squeezes spaces", () => {
    expect(searchWords("  Fried   BEEF ")).toEqual(["fried", "beef"]);
    expect(searchWords("   ")).toEqual([]);
  });
});

describe("matchItems", () => {
  it("needs every word, found in the name, section, description or tags", () => {
    const items = [dish({ id: "a" }), dish({ id: "b", name: "Chapati", section: "Sides", description: "Soft, with beef stew", tags: ["halal"] }), dish({ id: "c", name: "Juice", section: "Drinks" })];
    expect(matchItems(items, ["beef"], now).map((i) => i.id)).toEqual(["a", "b"]);
    expect(matchItems(items, ["beef", "halal"], now).map((i) => i.id)).toEqual(["b"]);
    expect(matchItems(items, ["grill"], now).map((i) => i.id)).toEqual(["a"]);
    expect(matchItems(items, ["pizza"], now)).toEqual([]);
  });

  it("puts names that start with the first word first, then names that contain the phrase", () => {
    const items = [dish({ id: "tail", name: "Grilled fried beef" }), dish({ id: "start", name: "Fried beef" }), dish({ id: "mid", name: "Beef fried rice" })];
    expect(matchItems(items, ["fried", "beef"], now).map((i) => i.id)).toEqual(["start", "tail", "mid"]);
  });

  it("reports availability for today and never leaks extra fields", () => {
    const [off] = matchItems([dish({ outOfStockOn: "2026-11-27" })], ["beef"], now);
    expect(off?.available).toBe(false);
    expect(Object.keys(off ?? {}).sort()).toEqual(["available", "id", "name", "outlet", "photoUrl", "price", "section"]);
  });
});

describe("matchOutlets and limits", () => {
  it("matches outlet names and keys, every word needed", () => {
    const outlets = [{ key: "main", name: "Main restaurant" }, { key: "pool-bar", name: "Pool bar" }];
    expect(matchOutlets(outlets, ["pool"])).toEqual([{ key: "pool-bar", name: "Pool bar" }]);
    expect(matchOutlets(outlets, ["main", "bar"])).toEqual([]);
  });

  it("cuts each list to its limit", () => {
    const many = Array.from({ length: 30 }, (_, n) => dish({ id: `i${n}`, name: `Beef ${n}` }));
    const outlets = Array.from({ length: 15 }, (_, n) => ({ key: `o${n}`, name: `Outlet ${n}` }));
    const result = menuSearchResult(matchItems(many, ["beef"], now), matchOutlets(outlets, ["outlet"]));
    expect(result.items).toHaveLength(SEARCH_LIMITS.items);
    expect(result.outlets).toHaveLength(SEARCH_LIMITS.outlets);
  });
});
