/**
 * Users & Login's own Postgres schema, `users_login`. No other module reads
 * these tables; they ask through the API or the `Actor` on each request.
 *
 * The first five tables are the ones Better Auth needs (with the two-factor
 * and phone-number plugins). Column names follow Better Auth's field names,
 * written in snake_case. The last three are ours: login method switches, the
 * login policy and PINs for trusted devices.
 */

import { bigint, boolean, index, integer, jsonb, pgSchema, primaryKey, text, timestamp } from "drizzle-orm/pg-core";
import type { LoginMethod } from "@igongo/contracts/users-login";

/** The `users_login` schema. */
export const usersLoginSchema = pgSchema("users_login");

const created = () => timestamp("created_at", { withTimezone: true }).notNull().defaultNow();
const updated = () => timestamp("updated_at", { withTimezone: true }).notNull().defaultNow();

/** One account: staff, rider, manager, board member or client. */
export const user = usersLoginSchema.table("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  createdAt: created(),
  updatedAt: updated(),
  twoFactorEnabled: boolean("two_factor_enabled").default(false),
  phoneNumber: text("phone_number").unique(),
  phoneNumberVerified: boolean("phone_number_verified"),
  /** `active`, `pending` (waiting for approval), `locked` or `suspended`. */
  status: text("status").notNull().default("active"),
  /** `staff` or `client`: who made the account and how. */
  kind: text("kind").notNull().default("client"),
});

/** One signed-in device. Deleting the row signs that device out. */
export const session = usersLoginSchema.table(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    token: text("token").notNull().unique(),
    createdAt: created(),
    updatedAt: updated(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  },
  (t) => [index("session_user_idx").on(t.userId)],
);

/** One way to sign in to an account: a password, Google, Apple and so on. */
export const account = usersLoginSchema.table(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at", { withTimezone: true }),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { withTimezone: true }),
    scope: text("scope"),
    password: text("password"),
    createdAt: created(),
    updatedAt: updated(),
  },
  (t) => [index("account_user_idx").on(t.userId)],
);

/** Short-lived codes and links (email codes, magic links, phone codes). */
export const verification = usersLoginSchema.table(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: created(),
    updatedAt: updated(),
  },
  (t) => [index("verification_identifier_idx").on(t.identifier)],
);

/** Two-factor secrets and backup codes (stored encrypted by Better Auth). */
export const twoFactor = usersLoginSchema.table(
  "two_factor",
  {
    id: text("id").primaryKey(),
    secret: text("secret").notNull(),
    backupCodes: text("backup_codes").notNull(),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    verified: boolean("verified").default(true),
    failedVerificationCount: integer("failed_verification_count").default(0),
    lockedUntil: timestamp("locked_until", { withTimezone: true }),
  },
  (t) => [index("two_factor_user_idx").on(t.userId), index("two_factor_secret_idx").on(t.secret)],
);

/** The super admin's switch for each sign-in method. */
export const loginMethods = usersLoginSchema.table("login_methods", {
  method: text("method").$type<LoginMethod>().primaryKey(),
  enabled: boolean("enabled").notNull(),
  /** Role keys allowed to use it; null means every role. */
  allowedRoleKeys: jsonb("allowed_role_keys").$type<string[] | null>(),
  /** Order on the login screen (lowest first). */
  sortOrder: integer("sort_order").notNull().default(0),
  updatedAt: updated(),
  updatedBy: text("updated_by"),
});

/** Login rules as key and value, such as `allowSelfRegistration`. */
export const loginPolicy = usersLoginSchema.table("login_policy", {
  key: text("key").primaryKey(),
  value: jsonb("value").notNull(),
  updatedAt: updated(),
});

/** A PIN for one person on one trusted device (phone or shared kiosk). */
export const pins = usersLoginSchema.table(
  "pins",
  {
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    deviceId: text("device_id").notNull(),
    pinHash: text("pin_hash").notNull(),
    failedCount: integer("failed_count").notNull().default(0),
    lockedUntil: timestamp("locked_until", { withTimezone: true }),
    createdAt: created(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.deviceId] })],
);

/** Better Auth's sign-in rate limits, kept in the database so every Worker instance shares them. */
export const rateLimit = usersLoginSchema.table("rate_limit", {
  id: text("id").primaryKey(),
  key: text("key").notNull().unique(),
  count: integer("count").notNull(),
  lastRequest: bigint("last_request", { mode: "number" }).notNull(),
});
