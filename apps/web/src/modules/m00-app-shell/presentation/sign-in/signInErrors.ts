// Plain words for the error codes Google and Apple sign-in bring back in the
// address (`?error=...`), and for the reasons the portal signs someone out.

const WORDS: Record<string, string> = {
  STAFF_ONLY: "The web portal is for hotel staff. Guests use the Igongo app.",
  staff_only: "The web portal is for hotel staff. Guests use the Igongo app.",
  PERMISSION_DENIED: "This account cannot sign in here. Guests use the Igongo app; staff, contact the super admin.",
  METHOD_DISABLED: "This sign-in method is not available for your account. Use your email and password.",
  account_not_linked: "This Google or Apple account is not linked to an Igongo account yet. Sign in with your email first, then link it.",
  EMAIL_DOES_NOT_MATCH: "This Google or Apple account uses a different email, so it cannot be linked.",
  session_expired: "Your session ended. Please sign in again.",
  idle: "You were signed out after a while with no activity, to keep this computer safe.",
};

/** The message for [code], or a general one. */
export function signInErrorText(code: string): string {
  return WORDS[code] ?? "Sign-in did not work. Please try again.";
}
