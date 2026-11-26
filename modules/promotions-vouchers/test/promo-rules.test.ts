/** The rules for promo and voucher codes at a checkout. */

import type { WorkRecord } from "@igongo/records-kit";
import { describe, expect, it } from "vitest";
import { promotionQuote, voucherQuote, worksHere } from "../src/domain/promo-rules";

/** A record with [fields] in [status]. */
const record = (type: string, status: string, fields: WorkRecord["fields"]): WorkRecord => ({
  id: "rec_1", code: "PV-0001", type, title: "Easter", status, fields, ownerId: null, ownerName: "", assigneeId: null, assigneeName: null,
  dueOn: null, location: null, createdBy: null, createdAt: new Date(), updatedAt: new Date(), closedAt: null,
});
const food = { module: "food-ordering", outlet: "main", subtotal: 50_000 };

describe("promo codes", () => {
  it("takes the percent off when live, not ended and for this place", () => {
    expect(promotionQuote(record("promotion", "live", { code: "easter10", discount: 10, where: "food", ends: "2026-12-01" }), food, "2026-11-26")).toMatchObject({ code: "EASTER10", discount: 5000, kind: "promotion" });
  });
  it("refuses drafts, ended promotions and other places", () => {
    expect(promotionQuote(record("promotion", "draft", { code: "X", discount: 10 }), food, "2026-11-26")).toBeNull();
    expect(promotionQuote(record("promotion", "live", { code: "X", discount: 10, ends: "2026-11-25" }), food, "2026-11-26")).toBeNull();
    expect(promotionQuote(record("promotion", "live", { code: "X", discount: 10, where: "spa" }), food, "2026-11-26")).toBeNull();
  });
  it("reads 'Where it works' as module words or outlet keys", () => {
    expect(worksHere("", food)).toBe(true);
    expect(worksHere("All", food)).toBe(true);
    expect(worksHere("pool, main", food)).toBe(true);
    expect(worksHere("museum", food)).toBe(false);
  });
});

describe("vouchers", () => {
  it("takes its value off, never more than the food", () => {
    expect(voucherQuote(record("voucher", "issued", { value: 20_000 }), food, "2026-11-26")).toMatchObject({ code: "PV-0001", discount: 20_000 });
    expect(voucherQuote(record("voucher", "issued", { value: 90_000 }), food, "2026-11-26")?.discount).toBe(50_000);
  });
  it("refuses used and expired vouchers", () => {
    expect(voucherQuote(record("voucher", "redeemed", { value: 20_000 }), food, "2026-11-26")).toBeNull();
    expect(voucherQuote(record("voucher", "issued", { value: 20_000, expires: "2026-11-01" }), food, "2026-11-26")).toBeNull();
  });
});
