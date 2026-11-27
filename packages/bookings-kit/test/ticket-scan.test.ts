// The door's scan: forged, used (scanned twice), valid, cancelled and unpaid,
// and a second check-in of the same booking is refused.

import { describe, expect, it } from "vitest";
import type { BookingsDeps } from "../src/application/bookings-deps";
import { checkIn } from "../src/application/use-cases/change-booking";
import { verifyTicket } from "../src/application/use-cases/verify-ticket";
import type { Booking, BookingStatus } from "../src/domain/booking";
import { issueTicket } from "../src/domain/ticket-signature";
import { verdictOf } from "../src/domain/ticket-verdict";

const KEY = "test-signing-key-for-unit-tests";

/** A booking with [status]; the other fields are not used by the scan. */
function booking(status: BookingStatus, id = "bk-1", code = "RB-7KQ2MX"): Booking {
  return {
    id,
    code,
    offeringId: "o",
    offeringName: "Standard Room",
    kind: "nights",
    userId: "u",
    guestName: "Guest",
    guestPhone: null,
    date: "2026-12-01",
    endDate: "2026-12-02",
    slot: null,
    units: 1,
    total: 180000,
    paid: 180000,
    status,
    notes: null,
    createdBy: null,
    cancelReason: null,
    checkedInAt: null,
    createdAt: new Date("2026-11-26T00:00:00Z"),
    updatedAt: new Date("2026-11-26T00:00:00Z"),
  };
}

/** Minimal deps: one booking in the store, looked up by code. */
function depsWith(b: Booking | null, ticketKey: string | null = KEY): BookingsDeps {
  return {
    ticketKey,
    bookings: { byCode: async (code: string) => (b && b.code === code ? b : null) },
  } as unknown as BookingsDeps;
}

describe("verdicts", () => {
  it("a bad signature is forged whatever the booking says", () => {
    expect(verdictOf(booking("confirmed"), false)).toBe("forged");
  });
  it("a confirmed booking is valid; a checked-in one is used", () => {
    expect(verdictOf(booking("confirmed"), true)).toBe("valid");
    expect(verdictOf(booking("checked_in"), true)).toBe("used");
  });
  it("cancelled and unpaid bookings are not let in", () => {
    expect(verdictOf(booking("cancelled"), true)).toBe("cancelled");
    expect(verdictOf(booking("awaiting_payment"), true)).toBe("unpaid");
    expect(verdictOf(booking("requested"), true)).toBe("unpaid");
  });
});

describe("scanning a ticket", () => {
  it("a forged code is refused and reveals no booking", async () => {
    const real = await issueTicket(KEY, "bk-1", "RB-7KQ2MX");
    const forged = real.replace(/\..*$/, ".forgedsignature");
    const scan = await verifyTicket(depsWith(booking("confirmed")), forged);
    expect(scan.verdict).toBe("forged");
    expect(scan.booking).toBeNull();
  });

  it("a code made for a different booking is forged", async () => {
    const copied = await issueTicket(KEY, "bk-OTHER", "RB-7KQ2MX");
    const scan = await verifyTicket(depsWith(booking("confirmed")), copied);
    expect(scan.verdict).toBe("forged");
    expect(scan.booking).toBeNull();
  });

  it("an unknown code is forged", async () => {
    const ticket = await issueTicket(KEY, "bk-1", "RB-ZZZZZZ");
    expect((await verifyTicket(depsWith(booking("confirmed")), ticket)).verdict).toBe("forged");
  });

  it("a genuine confirmed ticket is valid and returns the booking", async () => {
    const ticket = await issueTicket(KEY, "bk-1", "RB-7KQ2MX");
    const scan = await verifyTicket(depsWith(booking("confirmed")), ticket);
    expect(scan.verdict).toBe("valid");
    expect(scan.booking?.code).toBe("RB-7KQ2MX");
  });

  it("a ticket scanned after check-in is used the second time", async () => {
    const ticket = await issueTicket(KEY, "bk-1", "RB-7KQ2MX");
    const scan = await verifyTicket(depsWith(booking("checked_in")), ticket);
    expect(scan.verdict).toBe("used");
  });

  it("without the signing key, ticket checks refuse to run", async () => {
    const ticket = await issueTicket(KEY, "bk-1", "RB-7KQ2MX");
    await expect(verifyTicket(depsWith(booking("confirmed"), null), ticket)).rejects.toThrow(/not set up/);
  });

  it("a checked-in booking cannot be checked in twice", async () => {
    // The write is refused before anything is saved, so no store is needed.
    const deps = { ticketKey: KEY } as unknown as BookingsDeps;
    await expect(checkIn(deps, booking("checked_in"))).rejects.toThrow(/already used/);
  });
});
