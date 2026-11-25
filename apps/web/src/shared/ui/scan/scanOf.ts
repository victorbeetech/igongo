// Turns what a reader typed into a card or band scan. USB NFC readers type
// the chip UID like a keyboard; QR scanners type the QR text. Igongo QR
// codes start with "IGG-", so anything else is taken as a chip UID.

/** A scan to send to the API: a chip UID or QR text. */
export type Scan = { uid: string } | { qr: string };

/** The scan for [text], or null when it is empty. */
export function scanOf(text: string): Scan | null {
  const value = text.trim();
  if (!value) return null;
  return value.startsWith("IGG-") ? { qr: value } : { uid: value };
}
