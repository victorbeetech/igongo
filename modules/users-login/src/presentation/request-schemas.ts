/** Zod schemas for Users & Login request bodies and queries. */

import { LOGIN_METHODS } from "@igongo/contracts/users-login";
import { z } from "zod";
import { ACCOUNT_STATUSES } from "../domain/account-status";

/** `GET /users`. */
export const searchQuery = z.object({
  q: z.string().max(100).optional(),
  status: z.enum(ACCOUNT_STATUSES).optional(),
  kind: z.enum(["staff", "client"]).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(25),
  offset: z.coerce.number().int().min(0).default(0),
});

/** `POST /users`: a staff account made by an admin. */
export const createAccountBody = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().toLowerCase().pipe(z.email().max(200)),
  /** Optional: staff can also sign in with Google, a PIN or a card. */
  password: z.string().min(8).max(128).optional(),
});

/** `PUT /users/me/photo`: the cropped photo as a base64 data URL (the type and size are checked in the domain). */
export const photoBody = z.object({ image: z.string().min(1).max(500_000) });

/** `PATCH /users/:id/status`. */
export const statusBody = z.object({ status: z.enum(ACCOUNT_STATUSES) });

/** `PATCH /login-methods/:method`. */
export const methodBody = z.object({
  enabled: z.boolean().optional(),
  allowedRoleKeys: z.array(z.string().max(60)).max(200).nullable().optional(),
  sortOrder: z.number().int().min(0).max(100).optional(),
});

/** The method in the path. */
export const methodParam = z.object({ method: z.enum(LOGIN_METHODS) });

/** `PATCH /login-methods/policy`. */
export const policyBody = z.object({
  allowSelfRegistration: z.boolean().optional(),
  allowSelfDelete: z.boolean().optional(),
  allowSignOut: z.boolean().optional(),
  newAccountsNeedApproval: z.boolean().optional(),
  sessionDays: z.number().int().min(1).max(365).optional(),
  firstMethod: z.enum(LOGIN_METHODS).optional(),
  passwordMinLength: z.number().int().min(8).max(64).optional(),
  passwordNeedsLetterAndNumber: z.boolean().optional(),
  maxFailedAttempts: z.number().int().min(3).max(20).optional(),
  lockoutMinutes: z.number().int().min(1).max(1440).optional(),
  staffWebSessionHours: z.number().int().min(1).max(72).optional(),
  webIdleMinutes: z.number().int().min(2).max(240).optional(),
  twoFactorForSensitiveRoles: z.boolean().optional(),
  sensitiveRoleKeys: z.array(z.string().max(60)).max(200).optional(),
  newDeviceAlerts: z.boolean().optional(),
});

/** `POST /security/staff-match`: the guest account, and what the person tells the super admin. */
export const staffMatchBody = z.object({
  userId: z.string().min(1).max(80),
  staffNumber: z.string().trim().min(3).max(20),
  phone: z.string().trim().min(9).max(20),
});

/** `POST /security/me/password`: the first password for an account made with Google or Apple. */
export const firstPasswordBody = z.object({ newPassword: z.string().min(8).max(128) });
