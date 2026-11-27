/**
 * One sign-in method's settings, and the defaults from the spec
 * (docs/modules/04-users-login.md, "Login methods").
 */

import type { LoginMethod } from "@igongo/contracts/users-login";

/** Where a method can be used. */
export type MethodPlatform = "all" | "app";

/** The super admin's settings for one method. */
export interface LoginMethodSetting {
  method: LoginMethod;
  enabled: boolean;
  /** Role keys allowed to use it; null means every role. */
  allowedRoleKeys: string[] | null;
  sortOrder: number;
}

/** Facts about each method that are code, not settings. */
export const METHOD_INFO: Record<LoginMethod, { label: string; platform: MethodPlatform; defaultOn: boolean }> = {
  email_password: { label: "Email and password", platform: "all", defaultOn: true },
  google: { label: "Sign in with Google", platform: "all", defaultOn: true },
  // On by default now that the Apple keys are set; it is listed only when
  // those keys exist (see isProviderReady), so it never shows without them.
  apple: { label: "Sign in with Apple", platform: "all", defaultOn: true },
  // Off until the hotel agrees the SMS and WhatsApp providers and cost.
  phone_sms: { label: "Phone code by SMS", platform: "all", defaultOn: false },
  phone_whatsapp: { label: "Phone code by WhatsApp", platform: "all", defaultOn: false },
  email_link: { label: "Email sign-in link", platform: "all", defaultOn: false },
  email_code: { label: "Email one-time code", platform: "all", defaultOn: false },
  pin: { label: "PIN on a trusted device", platform: "app", defaultOn: true },
  biometric: { label: "Fingerprint or face unlock", platform: "app", defaultOn: true },
  // Off until the Staff Cards module (16) is live; the endpoint is ready.
  card_nfc: { label: "Tap a staff card", platform: "app", defaultOn: false },
  card_qr: { label: "Scan a staff card QR code", platform: "app", defaultOn: false },
};

/**
 * Which social sign-in providers have their keys set up on the server.
 * Email and the other methods need no outside keys, so they are always ready.
 */
export interface ProviderReadiness {
  google: boolean;
  apple: boolean;
}

/** The methods that need a provider's keys before they can be used. */
const NEEDS_PROVIDER: ReadonlySet<LoginMethod> = new Set<LoginMethod>(["google", "apple"]);

/** True when [method] can be offered: it needs no keys, or its keys are set up. */
export function isProviderReady(method: LoginMethod, ready: ProviderReadiness): boolean {
  if (!NEEDS_PROVIDER.has(method)) return true;
  return method === "google" ? ready.google : ready.apple;
}

/** True when a person holding [roleKeys] may use [setting]. */
export function methodAllowedFor(setting: LoginMethodSetting, roleKeys: string[]): boolean {
  if (!setting.enabled) return false;
  // No list means every role; a new account with no roles yet is allowed too.
  if (!setting.allowedRoleKeys || roleKeys.length === 0) return true;
  return roleKeys.some((k) => setting.allowedRoleKeys?.includes(k));
}
