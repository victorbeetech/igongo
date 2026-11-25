/**
 * What a staff card's QR code holds: `IGG-CARD:<token>`. The token is random
 * and unguessable, so a photocopied card stops working once it is reset.
 * (Chip UIDs are tidied by `normalizeUid` in @igongo/core.)
 */

/** The prefix of every staff card QR code. */
export const CARD_QR_PREFIX = "IGG-CARD:";

/** The text to print in a card's QR code. */
export function cardQrText(qrToken: string): string {
  return `${CARD_QR_PREFIX}${qrToken}`;
}

/** The token inside scanned QR text, or null when it is not a staff card. */
export function qrTokenFrom(text: string): string | null {
  return text.startsWith(CARD_QR_PREFIX) ? text.slice(CARD_QR_PREFIX.length).trim() || null : null;
}

/** A new random QR token (128 bits, hex). */
export function newQrToken(): string {
  return crypto.randomUUID().replace(/-/g, "");
}

/**
 * The printed number after [highest].
 * @example nextCardNumber(41) === "C-00042"
 */
export function nextCardNumber(highest: number): string {
  return `C-${String(highest + 1).padStart(5, "0")}`;
}
