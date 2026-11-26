// Ticket signatures: a ticket made for one booking verifies only for that booking,
// with the right key, and only unchanged. A copied or edited code is forged.

import { describe, expect, it } from "vitest";
import { BOOKING_QR_PREFIX, issueTicket, parseTicket, signatureMatches, type ParsedTicket } from "../src/domain/ticket-signature";

/** The parts of a ticket; fails the test when the text has no signature part. */
function partsOf(ticket: string): ParsedTicket {
  const parsed = parseTicket(ticket);
  if (!parsed) throw new Error(`not a ticket: ${ticket}`);
  return parsed;
}

const KEY = "test-signing-key-for-unit-tests";

describe("ticket signatures", () => {
  it("a ticket verifies for its own booking and code", async () => {
    const ticket = await issueTicket(KEY, "bk-1", "RB-7KQ2MX");
    expect(await signatureMatches(KEY, "bk-1", "RB-7KQ2MX", partsOf(ticket).signature)).toBe(true);
  });

  it("a forged code fails: a made-up signature does not match", async () => {
    expect(await signatureMatches(KEY, "bk-1", "RB-7KQ2MX", "not-the-right-signature")).toBe(false);
  });

  it("an edited code fails: the same signature does not match another code", async () => {
    const parsed = partsOf(await issueTicket(KEY, "bk-1", "RB-7KQ2MX"));
    expect(await signatureMatches(KEY, "bk-1", "RB-7KQ2MY", parsed.signature)).toBe(false);
  });

  it("a copied code fails on another booking: the booking ID is signed too", async () => {
    const parsed = partsOf(await issueTicket(KEY, "bk-1", "RB-7KQ2MX"));
    expect(await signatureMatches(KEY, "bk-2", "RB-7KQ2MX", parsed.signature)).toBe(false);
  });

  it("a ticket made with another key fails", async () => {
    const parsed = partsOf(await issueTicket("someone-elses-key-123456789", "bk-1", "RB-7KQ2MX"));
    expect(await signatureMatches(KEY, "bk-1", "RB-7KQ2MX", parsed.signature)).toBe(false);
  });

  it("the QR prefix is optional when reading a ticket", async () => {
    const ticket = await issueTicket(KEY, "bk-1", "RB-7KQ2MX");
    expect(parseTicket(`${BOOKING_QR_PREFIX}${ticket}`)).toEqual(parseTicket(ticket));
  });

  it("text with no signature part is not a ticket", () => {
    expect(parseTicket("RB-7KQ2MX")).toBeNull();
    expect(parseTicket(".abc")).toBeNull();
    expect(parseTicket("RB-7KQ2MX.")).toBeNull();
  });
});
