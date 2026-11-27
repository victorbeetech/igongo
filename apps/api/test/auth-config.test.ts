// Tests the sign-in settings the API builds for Google and Apple: the phone
// apps' client IDs must be accepted next to the web client, and the iPhone
// bundle ID must be the Apple audience. Uses an empty secret store, so only
// the Worker's own variables are read.

import { describe, expect, it } from "vitest";
import type { SecretReader } from "@igongo/contracts/super-admin";
import { authConfigFrom } from "../src/wiring/auth-config";
import type { Env } from "../src/shell/env";

/** A secret store with nothing saved: every key reads as not set. */
const noSecrets: SecretReader = { get: async () => null };

/** The minimum Worker environment that passes the checks. */
const baseEnv: Env = {
  BETTER_AUTH_SECRET: "test-secret-at-least-thirty-two-characters-long",
  API_BASE_URL: "https://igongo-api.example.test",
  GOOGLE_CLIENT_ID: "web-client.apps.googleusercontent.com",
  GOOGLE_CLIENT_SECRET: "test-google-secret",
  GOOGLE_APP_CLIENT_IDS: "ios-client.apps.googleusercontent.com, android-client.apps.googleusercontent.com",
  APPLE_TEAM_ID: "TEAM123456",
  APPLE_KEY_ID: "KEY1234567",
  APPLE_SERVICES_ID: "com.example.web",
  APPLE_PRIVATE_KEY: "test-apple-key",
  APPLE_APP_BUNDLE_ID: "ug.co.igongo.igongo",
} as Env;

describe("authConfigFrom (social sign-in settings)", () => {
  it("puts the web client first and the phone apps' client IDs after it", async () => {
    const config = await authConfigFrom(baseEnv, noSecrets);
    expect(config.google?.clientId).toEqual([
      "web-client.apps.googleusercontent.com",
      "ios-client.apps.googleusercontent.com",
      "android-client.apps.googleusercontent.com",
    ]);
  });

  it("uses the iPhone bundle ID as the Apple app identifier", async () => {
    const config = await authConfigFrom(baseEnv, noSecrets);
    expect(config.apple?.appBundleIdentifier).toBe("ug.co.igongo.igongo");
  });

  it("leaves Google off when no app IDs are listed beyond the web one", async () => {
    const config = await authConfigFrom({ ...baseEnv, GOOGLE_APP_CLIENT_IDS: undefined } as Env, noSecrets);
    expect(config.google?.clientId).toEqual(["web-client.apps.googleusercontent.com"]);
  });

  it("turns Google off when the client secret is missing", async () => {
    const config = await authConfigFrom({ ...baseEnv, GOOGLE_CLIENT_SECRET: undefined } as Env, noSecrets);
    expect(config.google).toBeNull();
  });
});
