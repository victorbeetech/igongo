/**
 * The short number a person sees on their profile (for example `00001`).
 *
 * It is separate from the internal sign-in ID (`user_<id>`), which the admin
 * screens and API use. The database hands out the number from a sequence when
 * an account is created (see migration 0002), so it grows as people join.
 */

/** The fewest digits shown. Numbers grow past this on their own (`1000000` has 7). */
export const MIN_DISPLAY_DIGITS = 5;

/**
 * Formats a display number with leading zeros, at least [MIN_DISPLAY_DIGITS] wide.
 * Only digits are ever produced. Throws on anything that is not a positive whole number.
 */
export function formatDisplayNumber(n: number): string {
  if (!Number.isSafeInteger(n) || n < 1) throw new RangeError(`Display number must be a positive whole number, got ${n}`);
  return String(n).padStart(MIN_DISPLAY_DIGITS, "0");
}
