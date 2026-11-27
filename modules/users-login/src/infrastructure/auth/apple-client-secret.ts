/**
 * Makes the "client secret" Sign in with Apple needs: a short JWT signed with
 * the Apple .p8 key (ES256). Apple allows at most six months; we make a new
 * one for 30 days whenever the auth instance is built, so it never expires
 * in use. The .p8 key itself comes from the super admin's encrypted keys.
 */

import { importPKCS8, SignJWT } from "jose";

/** The Apple values the super admin pastes in Integrations > Apple sign-in. */
export interface AppleKeys {
  teamId: string;
  keyId: string;
  /** The Services ID, such as `com.victorbee.igongo.web`. */
  clientId: string;
  /** The full text of the .p8 file. */
  privateKey: string;
}

/** How long one signed secret is reused before a new one is made (Apple allows 30 days). */
const REUSE_SECONDS = 12 * 3600;

/**
 * The last secret made, kept for this Worker instance. Signing costs CPU, and
 * the auth instance is built on every signed-in request, so reusing it saves work.
 */
let cached: { keys: AppleKeys; value: string; madeAt: number } | null = null;

/** Whether [keys] are the same keys the cached secret was made with. */
function sameKeys(a: AppleKeys, b: AppleKeys): boolean {
  return a.teamId === b.teamId && a.keyId === b.keyId && a.clientId === b.clientId && a.privateKey === b.privateKey;
}

/** A signed client secret valid for 30 days, reused for up to 12 hours per instance. */
export async function appleClientSecret(keys: AppleKeys, now = new Date()): Promise<string> {
  const nowSeconds = Math.floor(now.getTime() / 1000);
  if (cached && sameKeys(cached.keys, keys) && nowSeconds - cached.madeAt < REUSE_SECONDS) return cached.value;
  const key = await importPKCS8(keys.privateKey, "ES256");
  const issuedAt = nowSeconds;
  const value = await new SignJWT({})
    .setProtectedHeader({ alg: "ES256", kid: keys.keyId })
    .setIssuer(keys.teamId)
    .setIssuedAt(issuedAt)
    .setExpirationTime(issuedAt + 30 * 24 * 3600)
    .setAudience("https://appleid.apple.com")
    .setSubject(keys.clientId)
    .sign(key);
  cached = { keys: { ...keys }, value, madeAt: nowSeconds };
  return value;
}
