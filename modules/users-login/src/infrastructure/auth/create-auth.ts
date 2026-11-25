/**
 * Builds the Better Auth instance for one request. Built per request because
 * the database connection (Hyperdrive) and the super admin's keys are per
 * request; building it is cheap.
 *
 * Every sign-in method is configured here. Whether each one may be used is
 * decided at runtime by the super admin's switches (see login-guard-hooks).
 */

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { bearer } from "better-auth/plugins/bearer";
import { emailOTP } from "better-auth/plugins/email-otp";
import { magicLink } from "better-auth/plugins/magic-link";
import { phoneNumber } from "better-auth/plugins/phone-number";
import { twoFactor } from "better-auth/plugins/two-factor";
import { hashPassword, verifyPassword } from "@igongo/core";
import * as schema from "../db/schema";
import { appleClientSecret } from "./apple-client-secret";
import type { AuthConfig, AuthDeps } from "./auth-deps";
import { deviceSignInPlugin } from "./device-sign-in-plugin";
import { loginGuardHooks } from "./login-guard-hooks";

/** The route prefix: Google's redirect URI is `<baseURL>/api/auth/callback/google`. */
export const AUTH_BASE_PATH = "/api/auth";

export async function createAuth(config: AuthConfig, deps: AuthDeps) {
  // Social providers are only added when their keys exist.
  const socialProviders = {
    ...(config.google ? { google: { clientId: config.google.clientId, clientSecret: config.google.clientSecret, prompt: "select_account" as const } } : {}),
    ...(config.apple
      ? { apple: { clientId: config.apple.clientId, clientSecret: await appleClientSecret(config.apple), ...(config.apple.appBundleIdentifier ? { appBundleIdentifier: config.apple.appBundleIdentifier } : {}) } }
      : {}),
  };
  const send = deps.codes.send.bind(deps.codes);
  const policy = await deps.settings.policy();

  return betterAuth({
    appName: "Igongo",
    baseURL: config.baseURL,
    basePath: AUTH_BASE_PATH,
    secret: config.secret,
    trustedOrigins: [...config.trustedOrigins, "https://appleid.apple.com"],
    database: drizzleAdapter(deps.db, {
      provider: "pg",
      schema: { user: schema.user, session: schema.session, account: schema.account, verification: schema.verification, twoFactor: schema.twoFactor, rateLimit: schema.rateLimit },
    }),
    user: {
      // Clients may delete their own account (Data Protection and Privacy Act).
      deleteUser: { enabled: true },
      additionalFields: {
        status: { type: "string", required: false, defaultValue: "active", input: false },
        kind: { type: "string", required: false, defaultValue: "client", input: false },
      },
    },
    session: { expiresIn: policy.sessionDays * 24 * 3600, updateAge: 24 * 3600 },
    emailAndPassword: {
      enabled: true,
      minPasswordLength: 8,
      // PBKDF2 (native on Workers) instead of scrypt; see @igongo/core password-hasher.
      password: { hash: hashPassword, verify: ({ hash, password }) => verifyPassword(hash, password) },
      // Reset links go out by email once the email service is set up (Phase 8).
      sendResetPassword: async ({ user, url }) => send("email", user.email, `Reset your Igongo password: ${url}`),
    },
    socialProviders,
    account: { accountLinking: { enabled: true, trustedProviders: ["google", "apple"] } },
    // Limits shared by every Worker instance, stored in Postgres.
    rateLimit: { enabled: true, storage: "database", window: 60, max: 60, customRules: { "/sign-in/*": { window: 60, max: 10 }, "/phone-number/*": { window: 60, max: 5 }, "/pin/sign-in": { window: 60, max: 10 } } },
    plugins: [
      twoFactor({ issuer: "Igongo" }),
      phoneNumber({
        sendOTP: ({ phoneNumber: to, code }, ctx) => send(ctx?.headers?.get("x-otp-channel") === "whatsapp" ? "whatsapp" : "sms", to, `Your Igongo code is ${code}`),
        // Phone-only clients get an account with a placeholder email.
        signUpOnVerification: { getTempEmail: (phone) => `${phone.replace(/\D/g, "")}@phone.igongo.invalid`, getTempName: (phone) => phone },
      }),
      magicLink({ sendMagicLink: ({ email, url }) => send("email", email, `Sign in to Igongo: ${url}`) }),
      emailOTP({ sendVerificationOTP: ({ email, otp }) => send("email", email, `Your Igongo code is ${otp}`) }),
      // Lets the app send `Authorization: Bearer <token>` instead of cookies.
      bearer(),
      deviceSignInPlugin({ pins: deps.pins, cards: deps.cards }),
    ],
    advanced: {
      // Text IDs with a prefix, like every other table.
      database: { generateId: ({ model }) => `${model.slice(0, 4)}_${crypto.randomUUID().replace(/-/g, "")}` },
      ipAddress: { ipAddressHeaders: ["cf-connecting-ip"] },
    },
    ...loginGuardHooks(deps),
    telemetry: { enabled: false },
  });
}

/** The Better Auth instance type. */
export type Auth = Awaited<ReturnType<typeof createAuth>>;
