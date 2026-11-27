/**
 * Assembles Better Auth's settings from the Worker environment and the
 * super admin's stored keys.
 *
 * Google: the client ID is a public variable and the secret a Worker secret
 * (`GOOGLE_CLIENT_SECRET`); keys saved in the console (`google.client_id`,
 * `google.client_secret`) win, so the hotel can swap to its own account
 * without a deploy. Apple works the same way: Worker values (APPLE_TEAM_ID,
 * APPLE_KEY_ID, APPLE_SERVICES_ID, secret APPLE_PRIVATE_KEY) unless the
 * console's keys override them, and only when all four are set.
 */

import type { SecretReader } from "@igongo/contracts/super-admin";
import { AppError } from "@igongo/core";
import type { AuthConfig } from "@igongo/users-login";
import { readConfig, type Env } from "../shell/env";

export async function authConfigFrom(env: Env, secrets: SecretReader): Promise<AuthConfig> {
  const config = readConfig(env);
  if (!config.authSecret) throw new AppError("not_configured", "Sign-in is not set up (BETTER_AUTH_SECRET is missing).");
  // All the stored keys in one read (this runs on every signed-in request).
  const stored = await secrets.getMany(["google.client_id", "google.client_secret", "apple.team_id", "apple.key_id", "apple.client_id", "apple.private_key", "apple.app_bundle_id"]);
  const googleId = stored["google.client_id"] ?? env.GOOGLE_CLIENT_ID;
  const googleSecret = stored["google.client_secret"] ?? env.GOOGLE_CLIENT_SECRET;
  // The iPhone bundle ID: the console key first, then the Worker's own value.
  const appBundle = stored["apple.app_bundle_id"] ?? env.APPLE_APP_BUNDLE_ID;
  // The app's own client IDs come after the web one, so ID tokens from the phone apps verify too.
  const googleAppIds = splitList(env.GOOGLE_APP_CLIENT_IDS);
  const googleClientIds = googleId ? [googleId, ...googleAppIds.filter((id) => id !== googleId)] : googleId;
  // Apple: console keys first, then the Worker's own values.
  const apple = {
    teamId: stored["apple.team_id"] ?? env.APPLE_TEAM_ID,
    keyId: stored["apple.key_id"] ?? env.APPLE_KEY_ID,
    clientId: stored["apple.client_id"] ?? env.APPLE_SERVICES_ID,
    privateKey: stored["apple.private_key"] ?? env.APPLE_PRIVATE_KEY,
  };
  return {
    baseURL: config.baseURL,
    secret: config.authSecret,
    trustedOrigins: config.webOrigins,
    google: googleClientIds && googleSecret ? { clientId: googleClientIds, clientSecret: googleSecret } : null,
    apple:
      apple.teamId && apple.keyId && apple.clientId && apple.privateKey
        ? { teamId: apple.teamId, keyId: apple.keyId, clientId: apple.clientId, privateKey: apple.privateKey, ...(appBundle ? { appBundleIdentifier: appBundle } : {}) }
        : null,
  };
}

/** Splits a comma-separated variable into trimmed, non-empty entries. Unset gives none. */
function splitList(value: string | undefined): string[] {
  return (value ?? "").split(",").map((v) => v.trim()).filter((v) => v.length > 0);
}
