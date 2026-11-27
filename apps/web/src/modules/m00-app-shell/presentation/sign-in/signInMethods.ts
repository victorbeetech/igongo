// The ways to sign in on the web portal. Google and Apple are app only, so
// the portal lists just the methods it can offer: the phone and card ones.

/** One sign-in method: its words and the screen it opens. */
export const SIGN_IN_METHODS = [
  { label: "Phone number (SMS or WhatsApp)", screenId: "S00-10" },
  { label: "Tap staff card", screenId: "S00-14" },
] as const;
