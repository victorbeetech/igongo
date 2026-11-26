/**
 * Mobile money numbers. People type them many ways ("0772 123456",
 * "+256772123456"); providers want `256772123456` (MTN) or `772123456`
 * (Airtel).
 */

/**
 * The number in international form without `+`, or null when it is not a Ugandan mobile number.
 * @example toMsisdn("0772 123 456") === "256772123456"
 */
export function toMsisdn(input: string): string | null {
  const digits = input.replace(/\D/g, "");
  const local = digits.startsWith("256") ? digits.slice(3) : digits.startsWith("0") ? digits.slice(1) : digits;
  return /^7\d{8}$/.test(local) ? `256${local}` : null;
}
