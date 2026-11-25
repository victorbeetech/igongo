/**
 * Public contract of Users, Accounts & Login (module 4): who is calling, and
 * the login methods the super admin switches on and off.
 */

import type { AccessProfile } from "../roles-permissions";

/** Every sign-in method the system has. Each has its own switch. */
export const LOGIN_METHODS = [
  "email_password",
  "google",
  "apple",
  "phone_sms",
  "phone_whatsapp",
  "email_link",
  "email_code",
  "pin",
  "biometric",
  "card_nfc",
  "card_qr",
] as const;
export type LoginMethod = (typeof LOGIN_METHODS)[number];

/** The signed-in caller, put on every request by the gateway. */
export interface Actor {
  userId: string;
  sessionId: string;
  name: string;
  email: string;
  /** Roles, permissions and menu, combined from all active roles. */
  access: AccessProfile;
}

/** Events this module emits. */
export const LOGIN_EVENTS = {
  methodEnabled: "login_method.enabled",
  methodDisabled: "login_method.disabled",
  accountCreated: "account.created",
  accountLocked: "account.locked",
  accountUnlocked: "account.unlocked",
  loginSucceeded: "login.succeeded",
  loginFailed: "login.failed",
  sessionRevoked: "session.revoked",
} as const;
