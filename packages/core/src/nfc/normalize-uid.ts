/**
 * NFC chip UIDs, as every module stores them. Readers send UIDs in many
 * forms ("04:a1:b2:c3", "04 A1 B2 C3", "04a1b2c3"), so they are tidied to
 * upper-case hex with no separators before saving or looking up.
 * Used by Staff Cards and Wristbands.
 */

import { AppError } from "../errors/app-error";

/**
 * [raw] as upper-case hex. @throws AppError `bad_request` when it is not a UID
 * @example normalizeUid("04:a1:b2:c3") === "04A1B2C3"
 */
export function normalizeUid(raw: string): string {
  const uid = raw.replace(/[\s:-]/g, "").toUpperCase();
  // NTAG213 UIDs are 7 bytes (14 hex digits); allow 4 to 16 bytes for other chips.
  if (!/^[0-9A-F]{8,32}$/.test(uid)) throw new AppError("bad_request", "That chip UID is not valid.");
  return uid;
}
