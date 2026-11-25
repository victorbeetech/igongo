/** Staff Cards' pure rules: QR text and card numbers. */

import { normalizeUid } from "@igongo/core";
import { describe, expect, it } from "vitest";
import { cardQrText, nextCardNumber, qrTokenFrom } from "../src/domain/card-codes";

describe("card codes", () => {
  it("round-trips the QR text and refuses other codes", () => {
    expect(qrTokenFrom(cardQrText("abc123"))).toBe("abc123");
    expect(qrTokenFrom("IGG-BAND:5:abc")).toBeNull();
    expect(qrTokenFrom("IGG-CARD:")).toBeNull();
  });
  it("tidies chip UIDs and numbers cards", () => {
    expect(normalizeUid("04:a1:b2:c3 d4-e5-f6")).toBe("04A1B2C3D4E5F6");
    expect(() => normalizeUid("hello")).toThrow();
    expect(nextCardNumber(41)).toBe("C-00042");
  });
});
