/** The kit's pure rules: nights, prices, starting statuses and codes. */

import { describe, expect, it } from "vitest";
import { bookingCode, nightsBetween, priceOf, startingStatus } from "../src/domain/booking-math";
import { DEFAULT_BOOKING_RULES } from "../src/domain/booking-rules";
import type { Offering } from "../src/domain/offering";

const room: Offering = { id: "ofr_1", kind: "nights", name: "Deluxe", description: null, price: 100, capacity: 5, slots: [], onDate: null, photoUrl: null, details: {}, active: true, visibleToClients: true, sortOrder: 0, updatedAt: new Date() };

describe("booking math", () => {
  it("counts nights and prices stays per room per night", () => {
    expect(nightsBetween("2026-12-24", "2026-12-27")).toBe(3);
    expect(priceOf(room, 2, 3)).toBe(600);
    expect(priceOf({ ...room, kind: "slot" }, 4, 0)).toBe(400);
    expect(priceOf({ ...room, kind: "enquiry" }, 300, 0)).toBe(0);
  });
  it("starts with approval, deposit or confirmed, by the rules", () => {
    expect(startingStatus(DEFAULT_BOOKING_RULES, "nights", 600, false)).toBe("confirmed");
    expect(startingStatus({ ...DEFAULT_BOOKING_RULES, depositPercent: 30 }, "nights", 600, false)).toBe("awaiting_payment");
    expect(startingStatus(DEFAULT_BOOKING_RULES, "enquiry", 0, false)).toBe("requested");
    expect(startingStatus({ ...DEFAULT_BOOKING_RULES, requireApproval: true }, "slot", 10, true)).toBe("confirmed");
  });
  it("makes readable codes", () => {
    expect(bookingCode("RB")).toMatch(/^RB-[A-HJ-NP-Z2-9]{6}$/);
  });
});
