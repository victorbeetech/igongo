/** Safe uploads: the real content decides, never the name or claimed type. */

import { describe, expect, it } from "vitest";
import { checkContent, storedName } from "../src/domain/file-content";

/** A real 1 x 1 PNG. */
const PNG = Uint8Array.from(atob("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg=="), (c) => c.charCodeAt(0));
/** A small JPEG shape: start marker, some data, end marker. */
const JPEG = Uint8Array.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01, 0x01, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00, 0xff, 0xd9]);
/** Bytes of text. */
const bytes = (s: string) => Uint8Array.from(s, (c) => c.charCodeAt(0));

describe("safe uploads", () => {
  it("accepts a real photo of the claimed type", () => {
    expect(checkContent(PNG, "image/png")).toEqual({ type: "image/png" });
    expect(checkContent(JPEG, "image/jpeg")).toEqual({ type: "image/jpeg" });
    expect(checkContent(bytes("%PDF-1.7\n1 0 obj\n%%EOF\n"), "application/pdf")).toEqual({ type: "application/pdf" });
  });

  it("refuses a fake jpg that is really a script", () => {
    expect(checkContent(bytes("<?php system($_GET['c']); ?>"), "image/jpeg")).toEqual({ problem: expect.stringMatching(/not a photo/) });
  });

  it("refuses a real photo with code hidden inside it", () => {
    const polyglot = Uint8Array.from([...JPEG.subarray(0, 20), ...bytes("<script>alert(1)</script>"), 0xff, 0xd9]);
    expect(checkContent(polyglot, "image/jpeg")).toEqual({ problem: expect.stringMatching(/contains code/) });
  });

  it("refuses a file whose content does not match its type", () => {
    expect(checkContent(PNG, "image/jpeg")).toEqual({ problem: expect.stringMatching(/do not match/) });
  });

  it("refuses a cut-off photo", () => {
    expect(checkContent(PNG.subarray(0, PNG.length - 12), "image/png")).toEqual({ problem: expect.stringMatching(/cut off/) });
    expect(checkContent(JPEG.subarray(0, JPEG.length - 2), "image/jpeg")).toEqual({ problem: expect.stringMatching(/cut off/) });
  });

  it("refuses an oversized photo whatever the settings say", () => {
    const big = new Uint8Array(11 * 1024 * 1024);
    big.set(JPEG.subarray(0, 20));
    big.set([0xff, 0xd9], big.length - 2);
    expect(checkContent(big, "image/jpeg")).toEqual({ problem: expect.stringMatching(/at most 10 MB/) });
  });

  it("explains iPhone HEIC photos", () => {
    const heic = Uint8Array.from([0, 0, 0, 0x18, ...bytes("ftypheic"), 0, 0, 0, 0]);
    expect(checkContent(heic, "image/heic")).toEqual({ problem: expect.stringMatching(/HEIC/) });
  });

  it("names a stored file by its random ID and real extension, never the sender's name", () => {
    expect(storedName("fil_abc123", "image/jpeg")).toBe("fil_abc123.jpg");
  });
});
