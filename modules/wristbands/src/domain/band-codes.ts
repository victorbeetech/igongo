/**
 * The QR code printed on a band holds `IGG-BAND:<number>:<token>`. The
 * token is random, so a band cannot be faked by printing a number.
 */

/** The prefix of every wristband QR code. */
export const BAND_QR_PREFIX = "IGG-BAND:";

/** The text to print in band [bandNumber]'s QR code. */
export function bandQrText(bandNumber: number, qrToken: string): string {
  return `${BAND_QR_PREFIX}${bandNumber}:${qrToken}`;
}

/** The number and token inside scanned QR text, or null when it is not a band. */
export function parseBandQr(text: string): { bandNumber: number; qrToken: string } | null {
  const match = /^IGG-BAND:(\d+):([0-9a-f]{32})$/.exec(text.trim());
  return match ? { bandNumber: Number(match[1]), qrToken: match[2] as string } : null;
}
