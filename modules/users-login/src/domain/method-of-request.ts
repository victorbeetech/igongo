/**
 * Works out which sign-in method a Better Auth request uses, from its path
 * and body, so the method switches can be checked. Pure function.
 *
 * Returns null for requests that don't start a sign-in (sign-out, session
 * reads, the second step of 2FA, which belongs to a method already checked).
 */

import type { LoginMethod } from "@igongo/contracts/users-login";

/** The request facts that matter. */
export interface AuthRequestFacts {
  path: string;
  /** `provider` for social sign-in, `channel` header for phone codes. */
  provider?: string | undefined;
  channel?: string | undefined;
  /** Route params, such as `id` in `/callback/:id`. */
  providerParam?: string | undefined;
}

/** Fixed paths and their method. */
const BY_PATH: Record<string, LoginMethod> = {
  "/sign-in/email": "email_password",
  "/sign-up/email": "email_password",
  "/sign-in/magic-link": "email_link",
  "/magic-link/verify": "email_link",
  "/email-otp/send-verification-otp": "email_code",
  "/sign-in/email-otp": "email_code",
  "/pin/sign-in": "pin",
  "/card/sign-in/nfc": "card_nfc",
  "/card/sign-in/qr": "card_qr",
};

export function methodOfRequest(req: AuthRequestFacts): LoginMethod | null {
  const fixed = BY_PATH[req.path];
  if (fixed) return fixed;
  // Google and Apple: the start of the redirect, the mobile ID-token sign-in, and the callback.
  const provider = req.path === "/sign-in/social" ? req.provider : req.path.startsWith("/callback/") ? req.providerParam : undefined;
  if (provider === "google" || provider === "apple") return provider;
  // Phone codes: the channel picks SMS or WhatsApp (SMS when not given).
  if (req.path === "/phone-number/send-otp" || req.path === "/phone-number/verify") {
    return req.channel === "whatsapp" ? "phone_whatsapp" : "phone_sms";
  }
  return null;
}
