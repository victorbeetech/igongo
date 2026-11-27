/**
 * The one list of request limits for every path that starts a sign-in or
 * sends a code, or that checks one. Better Auth reads it when the auth
 * instance is built (create-auth.ts) and keeps the counts in Postgres, so
 * every Worker instance shares them.
 *
 * Each rule is `window` seconds and `max` requests per caller in that window.
 * A path ending in `/*` matches every path below it; other paths match exactly.
 * Paths not listed here still get the global default, so nothing is unlimited.
 *
 * Pure data and one matcher, so the test suite can check every sign-in path
 * is covered without starting Better Auth.
 */

/** One limit: at most [max] requests in [window] seconds. */
export interface RateLimitRule {
  window: number;
  max: number;
}

/** Path pattern to its limit. Patterns ending in `/*` cover everything below them. */
export const RATE_LIMIT_RULES: Record<string, RateLimitRule> = {
  // Password, social and email-link sign-ins (and their callbacks' start).
  "/sign-in/*": { window: 60, max: 10 },
  // Google and Apple redirect back here (`/callback/google`, `/callback/apple`).
  "/callback/*": { window: 60, max: 10 },
  // Phone codes: SMS and WhatsApp cost money, so they are tight.
  "/phone-number/*": { window: 60, max: 5 },
  // Trusted-device PIN: the PIN itself also locks after five wrong tries.
  "/pin/sign-in": { window: 60, max: 10 },
  // Staff card taps and QR scans.
  "/card/sign-in/*": { window: 60, max: 10 },
  // The second step of sign-in (authenticator and backup codes): guessing targets.
  "/two-factor/*": { window: 60, max: 5 },
  // Email codes and magic links: each one sends an email.
  "/email-otp/*": { window: 60, max: 5 },
  "/magic-link/*": { window: 60, max: 5 },
  // Password reset: sends an email and changes a password.
  "/request-password-reset": { window: 60, max: 5 },
  "/reset-password": { window: 60, max: 5 },
};

/**
 * Every path a person can use to start a sign-in or prove a code. The test
 * suite requires each one to be covered by a rule above.
 */
export const SIGN_IN_PATHS = [
  "/sign-in/email",
  "/sign-in/social",
  "/callback/google",
  "/callback/apple",
  "/sign-in/magic-link",
  "/magic-link/verify",
  "/sign-in/email-otp",
  "/email-otp/send-verification-otp",
  "/phone-number/send-otp",
  "/phone-number/verify",
  "/pin/sign-in",
  "/card/sign-in/nfc",
  "/card/sign-in/qr",
  "/two-factor/verify-totp",
  "/two-factor/verify-backup-code",
  "/request-password-reset",
  "/reset-password",
];

/**
 * The rule that applies to [path], or null when none does. A rule with an
 * exact path wins over a `/*` pattern, and the longest `/*` pattern wins
 * over a shorter one.
 */
export function ruleFor(path: string, rules: Record<string, RateLimitRule> = RATE_LIMIT_RULES): RateLimitRule | null {
  if (rules[path]) return rules[path];
  let best: { length: number; rule: RateLimitRule } | null = null;
  for (const [pattern, rule] of Object.entries(rules)) {
    // Only `/*` patterns can match more than one path; the prefix keeps the slash.
    if (!pattern.endsWith("/*")) continue;
    const prefix = pattern.slice(0, -1);
    if (path.startsWith(prefix) && (!best || pattern.length > best.length)) best = { length: pattern.length, rule };
  }
  return best?.rule ?? null;
}
