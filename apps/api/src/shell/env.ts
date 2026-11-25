/**
 * The Worker's environment: bindings, plain variables (wrangler.jsonc) and
 * secrets (Cloudflare dashboard). `readConfig` checks it once per request
 * and gives the rest of the code typed, validated values.
 */

import type { PushEnv } from "@igongo/notifications";

/** Everything Cloudflare passes to the Worker. */
export interface Env extends PushEnv {
  /** Neon Postgres through Hyperdrive (pooled, close to the Worker). */
  HYPERDRIVE?: Hyperdrive;
  /** Direct connection string, for local development only. */
  DATABASE_URL?: string;
  ENVIRONMENT?: string;
  /** Set by the deploy to the git commit, so Sentry knows the release. */
  RELEASE?: string;
  API_BASE_URL?: string;
  /** Comma-separated web addresses allowed to call with cookies. */
  WEB_ORIGINS?: string;
  GOOGLE_CLIENT_ID?: string;
  /** Apple push key ID and team ID (the key itself is APNS_PRIVATE_KEY). */
  APNS_KEY_ID?: string;
  APPLE_TEAM_ID?: string;
  /** Sign in with Apple: the login key's ID and the web Services ID. */
  APPLE_KEY_ID?: string;
  APPLE_SERVICES_ID?: string;
  // --- Secrets ---
  BETTER_AUTH_SECRET?: string;
  SETTINGS_ENCRYPTION_KEY?: string;
  GOOGLE_CLIENT_SECRET?: string;
  BOOTSTRAP_ADMIN_EMAIL?: string;
  SENTRY_DSN?: string;
  /** The Apple push .p8 key, for iPhone pushes. */
  APNS_PRIVATE_KEY?: string;
  /** The Sign in with Apple .p8 key. */
  APPLE_PRIVATE_KEY?: string;
}

/** The checked settings. */
export interface ApiConfig {
  environment: string;
  release: string;
  baseURL: string;
  webOrigins: string[];
  databaseUrl: string | null;
  authSecret: string | null;
}

/** Reads and checks the environment. Missing secrets become null, never a crash. */
export function readConfig(env: Env): ApiConfig {
  return {
    environment: env.ENVIRONMENT ?? "development",
    release: env.RELEASE ?? "dev",
    baseURL: env.API_BASE_URL ?? "http://localhost:8787",
    webOrigins: (env.WEB_ORIGINS ?? "http://localhost:3000").split(",").map((o) => o.trim()).filter(Boolean),
    databaseUrl: env.HYPERDRIVE?.connectionString ?? env.DATABASE_URL ?? null,
    // Better Auth needs at least 32 characters.
    authSecret: env.BETTER_AUTH_SECRET && env.BETTER_AUTH_SECRET.length >= 32 ? env.BETTER_AUTH_SECRET : null,
  };
}
