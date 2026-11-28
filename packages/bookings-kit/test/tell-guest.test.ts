/**
 * Tests for tellGuest: a guest with an account is told about their booking;
 * a walk-in (no account) and a module with no notifier are not.
 */

import { describe, expect, it } from "vitest";
import { tellGuest } from "../src/application/tell-guest";
import type { Booking } from "../src/domain/booking";

/** A booking with only the fields tellGuest reads. */
function booking(userId: string | null): Booking {
  return { id: "bkg_1", code: "AB-1", offeringName: "Pool pass", guestName: "Ann", userId } as unknown as Booking;
}

describe("tellGuest", () => {
  it("sends the message to the guest's account on the bookings channel", async () => {
    const sent: unknown[] = [];
    await tellGuest({ notify: async (ids, msg) => { sent.push({ ids, msg }); } }, booking("user_ann"), { title: "T", body: "B" });
    expect(sent).toEqual([{ ids: ["user_ann"], msg: { title: "T", body: "B", channel: "bookings", link: "/bookings" } }]);
  });

  it("sends nothing for a walk-in with no account", async () => {
    let called = false;
    await tellGuest({ notify: async () => { called = true; } }, booking(null), { title: "T", body: "B" });
    expect(called).toBe(false);
  });

  it("sends nothing when the module has no notifier", async () => {
    await expect(tellGuest({}, booking("user_ann"), { title: "T", body: "B" })).resolves.toBeUndefined();
  });
});
