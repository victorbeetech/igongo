// The ways to sign in, each shown only when the super admin has it switched on.

/** One sign-in method: its words and the screen it opens. */
export const SIGN_IN_METHODS = [
  { label: "Continue with Google", screenId: "S00-06" },
  { label: "Continue with Apple", screenId: "S00-07" },
  { label: "Phone number (SMS or WhatsApp)", screenId: "S00-10" },
  { label: "Tap staff card", screenId: "S00-14" },
] as const;
