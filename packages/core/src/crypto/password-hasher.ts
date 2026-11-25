/**
 * Password and PIN hashing with PBKDF2-SHA256 from WebCrypto.
 *
 * Why not scrypt (Better Auth's default)? On Cloudflare Workers scrypt runs
 * in JavaScript and can pass the CPU limit per request; PBKDF2 runs natively.
 * 100,000 iterations is the most Workers allows. Each hash has its own
 * random 16-byte salt.
 *
 * Stored form: `pbkdf2-sha256$<iterations>$<salt base64>$<hash base64>`, so
 * the iteration count can be raised later and old hashes still verify.
 */

import { fromBase64, toBase64 } from "./base64";

const ITERATIONS = 100_000;
const SCHEME = "pbkdf2-sha256";

/** Derives 32 bytes from [secret] and [salt]. */
async function derive(secret: string, salt: Uint8Array<ArrayBuffer>, iterations: number): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt, iterations }, key, 256);
  return new Uint8Array(bits);
}

/** Hashes a password or PIN for storage. */
export async function hashPassword(secret: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = await derive(secret, salt, ITERATIONS);
  return [SCHEME, String(ITERATIONS), toBase64(salt), toBase64(hash)].join("$");
}

/** True when [secret] matches [stored]. Compares in constant time. */
export async function verifyPassword(stored: string, secret: string): Promise<boolean> {
  const [scheme, iterations, salt, hash] = stored.split("$");
  if (scheme !== SCHEME || !iterations || !salt || !hash) return false;
  const expected = fromBase64(hash);
  const actual = await derive(secret, fromBase64(salt), Number(iterations));
  // Constant-time compare: always look at every byte.
  let diff = expected.length ^ actual.length;
  for (let i = 0; i < expected.length; i++) diff |= (expected[i] ?? 0) ^ (actual[i] ?? 0);
  return diff === 0;
}
