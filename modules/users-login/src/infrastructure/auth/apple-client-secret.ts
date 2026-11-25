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

/** A signed client secret valid for 30 days. */
export async function appleClientSecret(keys: AppleKeys, now = new Date()): Promise<string> {
  const key = await importPKCS8(keys.privateKey, "ES256");
  const issuedAt = Math.floor(now.getTime() / 1000);
  return new SignJWT({})
    .setProtectedHeader({ alg: "ES256", kid: keys.keyId })
    .setIssuer(keys.teamId)
    .setIssuedAt(issuedAt)
    .setExpirationTime(issuedAt + 30 * 24 * 3600)
    .setAudience("https://appleid.apple.com")
    .setSubject(keys.clientId)
    .sign(key);
}
