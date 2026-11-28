/**
 * Profile photo rules: only JPG and PNG data URLs, and no photo over the size limit.
 * Pure checks, no database.
 */

import { describe, expect, it } from "vitest";
import { checkProfilePhoto, MAX_PROFILE_PHOTO_BYTES } from "../src/domain/profile-photo";

/** A data URL whose payload decodes to about [bytes] bytes. */
function dataUrl(type: string, bytes: number): string {
  return `data:${type};base64,${"A".repeat(Math.ceil((bytes * 4) / 3))}`;
}

describe("checkProfilePhoto", () => {
  it("accepts a small JPG and a small PNG", () => {
    const jpg = dataUrl("image/jpeg", 1000);
    const png = dataUrl("image/png", 1000);
    expect(checkProfilePhoto(jpg)).toBe(jpg);
    expect(checkProfilePhoto(png)).toBe(png);
  });

  it("refuses other picture types and plain text", () => {
    expect(() => checkProfilePhoto(dataUrl("image/gif", 100))).toThrow("Choose a JPG or PNG photo.");
    expect(() => checkProfilePhoto("not an image")).toThrow("Choose a JPG or PNG photo.");
  });

  it("refuses a photo over the size limit", () => {
    expect(() => checkProfilePhoto(dataUrl("image/jpeg", MAX_PROFILE_PHOTO_BYTES * 2))).toThrow("too large");
  });

  it("refuses a payload that is not base64", () => {
    expect(() => checkProfilePhoto("data:image/png;base64,<script>alert(1)</script>")).toThrow("Choose a JPG or PNG photo.");
  });

  it("refuses an empty photo", () => {
    expect(() => checkProfilePhoto("data:image/jpeg;base64,")).toThrow("empty");
  });
});
