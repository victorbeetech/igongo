/**
 * Assembles Better Auth's settings from the Worker environment and the
 * super admin's stored keys.
 *
 * Google: the client ID is a public variable and the secret a Worker secret
 * (`GOOGLE_CLIENT_SECRET`); keys saved in the console (`google.client_id`,
 * `google.client_secret`) win, so the hotel can swap to its own account
 * without a deploy. Apple: only from the console's keys, and only when all
 * four are set (team ID, key ID, Services ID, .p8 key).
 */

import type { SecretReader } from "@igongo/contracts/super-admin";
import { AppError } from "@igongo/core";
import type { AuthConfig } from "@igongo/users-login";
import { readConfig, type Env } from "../shell/env";

export async function authConfigFrom(env: Env, secrets: SecretReader): Promise<AuthConfig> {
  const config = readConfig(env);
  if (!config.authSecret) throw new AppError("not_configured", "Sign-in is not set up (BETTER_AUTH_SECRET is missing).");
  const [gId, gSecret, teamId, keyId, clientId, privateKey, bundle] = await Promise.all(
    ["google.client_id", "google.client_secret", "apple.team_id", "apple.key_id", "apple.client_id", "apple.private_key", "apple.app_bundle_id"].map((k) => secrets.get(k)),
  );
  const googleId = gId ?? env.GOOGLE_CLIENT_ID;
  const googleSecret = gSecret ?? env.GOOGLE_CLIENT_SECRET;
  return {
    baseURL: config.baseURL,
    secret: config.authSecret,
    trustedOrigins: config.webOrigins,
    google: googleId && googleSecret ? { clientId: googleId, clientSecret: googleSecret } : null,
    apple: teamId && keyId && clientId && privateKey ? { teamId, keyId, clientId, privateKey, ...(bundle ? { appBundleIdentifier: bundle } : {}) } : null,
  };
}
