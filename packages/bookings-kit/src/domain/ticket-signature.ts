/**
 * Booking tickets are signed on the server. A ticket is `<code>.<signature>`,
 * where the signature is HMAC-SHA256 over the booking's ID and code, keyed
 * with the TICKET_SIGNING_KEY secret. A code copied from another booking, or
 * an edited code, does not match its signature, so it shows as forged.
 * Web Crypto is used, so the same code runs in the Worker and in tests.
 */

/** The text every ticket QR starts with, so the app and the door know what it is. */
export const BOOKING_QR_PREFIX = "IGG-BK:";

const encoder = new TextEncoder();

/** Base64url (no padding) of [bytes], as used in URLs and QR text. */
function base64url(bytes: ArrayBuffer): string {
  let binary = "";
  for (const b of new Uint8Array(bytes)) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** The HMAC key for [secret]. */
function hmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
}

/** The signature for [code] of booking [bookingId]. */
export async function signatureFor(secret: string, bookingId: string, code: string): Promise<string> {
  const mac = await crypto.subtle.sign("HMAC", await hmacKey(secret), encoder.encode(`${bookingId}|${code}`));
  return base64url(mac);
}

/** The ticket text for a booking: its code and signature. */
export async function issueTicket(secret: string, bookingId: string, code: string): Promise<string> {
  return `${code}.${await signatureFor(secret, bookingId, code)}`;
}

/** A ticket's parts, as read from scanned or typed text. */
export interface ParsedTicket {
  code: string;
  signature: string;
}

/** Splits ticket text (with or without the QR prefix) into code and signature; null when it has no signature part. */
export function parseTicket(text: string): ParsedTicket | null {
  // Step 1: drop the QR prefix and surrounding spaces.
  const body = text.trim().replace(BOOKING_QR_PREFIX, "");
  // Step 2: the signature follows the last dot; both sides must be present.
  const dot = body.lastIndexOf(".");
  if (dot <= 0 || dot === body.length - 1) return null;
  return { code: body.slice(0, dot), signature: body.slice(dot + 1) };
}

/** Compares two strings in time that depends only on their length, so timing reveals nothing. */
function sameText(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/** True when [signature] is the right one for [code] of booking [bookingId]. */
export async function signatureMatches(secret: string, bookingId: string, code: string, signature: string): Promise<boolean> {
  return sameText(await signatureFor(secret, bookingId, code), signature);
}
