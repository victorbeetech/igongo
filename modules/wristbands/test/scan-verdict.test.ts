/** Wristbands' pure rules: ranges, QR text and the door's verdict. */

import { describe, expect, it } from "vitest";
import { bandQrText, parseBandQr } from "../src/domain/band-codes";
import { checkRange, numbersIn } from "../src/domain/band-range";
import { scanVerdict } from "../src/domain/scan-verdict";
import type { Wristband } from "../src/domain/wristband";

const token = "0123456789abcdef0123456789abcdef";
const band = (over: Partial<Wristband>): Wristband => ({ bandNumber: 5, uid: null, qrToken: token, bandType: "event", status: "assigned", eventKey: "wedding", eventName: "Wedding", assignedAt: null, createdAt: new Date(), ...over });

describe("wristbands", () => {
  it("checks ranges", () => {
    expect(numbersIn({ from: 3, to: 5 })).toEqual([3, 4, 5]);
    expect(() => checkRange({ from: 5, to: 3 })).toThrow();
    expect(() => checkRange({ from: 1, to: 5001 })).toThrow();
  });
  it("parses only well-formed band QR codes", () => {
    expect(parseBandQr(bandQrText(5, token))).toEqual({ bandNumber: 5, qrToken: token });
    expect(parseBandQr("IGG-CARD:abc")).toBeNull();
  });
  it("tells the door what to do", () => {
    expect(scanVerdict(null, null)).toBe("unknown");
    expect(scanVerdict(band({}), "wedding")).toBe("ok");
    expect(scanVerdict(band({}), "conference")).toBe("wrong_event");
    expect(scanVerdict(band({ status: "in_stock", eventKey: null }), null)).toBe("not_assigned");
    expect(scanVerdict(band({ status: "missing" }), "wedding")).toBe("blocked");
  });
});
