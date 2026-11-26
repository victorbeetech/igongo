/** Food Ordering's pure rules: option pricing, ready times, deposits and the status flow. */

import type { MenuItemRef } from "@igongo/contracts/menu-catalogue";
import { describe, expect, it } from "vitest";
import { nextStatuses } from "../src/domain/order-flow";
import { DEFAULT_ORDERING_RULES, paidBeforeKitchen, readyTime } from "../src/domain/ordering-rules";
import { priceLine } from "../src/domain/price-line";

const beef: MenuItemRef = {
  itemId: "itm_beef", outlet: "main", name: "Fried beef", price: 20000, prepMinutes: 40, available: true,
  options: [{ key: "portion", name: "Portion", required: true, multiple: false, choices: [{ key: "half", name: "Half kg", priceDelta: 0 }, { key: "1kg", name: "1 kg", priceDelta: 18000 }] }],
};

describe("pricing", () => {
  it("adds the options to the price, and needs the required ones", () => {
    expect(priceLine(beef, 2, ["portion:1kg"], null)).toMatchObject({ unitPrice: 38000, lineTotal: 76000 });
    expect(() => priceLine(beef, 1, [], null)).toThrow(/Choose portion/);
    expect(() => priceLine(beef, 1, ["portion:half", "portion:1kg"], null)).toThrow(/only one/);
  });
});

describe("timing and payment", () => {
  const now = new Date("2026-11-26T10:00:00Z");
  it("is ready after the slowest item plus the queue, or at a pre-order's arrival", () => {
    expect(readyTime({ now, prepMinutes: [10, 40], queued: 2, arriveAt: null, rules: DEFAULT_ORDERING_RULES }).toISOString()).toBe("2026-11-26T10:46:00.000Z");
    const arrive = new Date("2026-11-26T13:00:00Z");
    expect(readyTime({ now, prepMinutes: [40], queued: 5, arriveAt: arrive, rules: DEFAULT_ORDERING_RULES })).toEqual(arrive);
  });
  it("asks for the deposit on pre-orders and nothing up front at the table", () => {
    expect(paidBeforeKitchen(DEFAULT_ORDERING_RULES, "pre_order", 76001)).toBe(38001);
    expect(paidBeforeKitchen(DEFAULT_ORDERING_RULES, "dine_in", 76000)).toBe(0);
    expect(paidBeforeKitchen(DEFAULT_ORDERING_RULES, "delivery", 76000)).toBe(76000);
  });
  it("leaves ready deliveries to the riders", () => {
    expect(nextStatuses("ready", "delivery")).toEqual([]);
    expect(nextStatuses("ready", "takeaway")).toEqual(["delivered"]);
  });
});
