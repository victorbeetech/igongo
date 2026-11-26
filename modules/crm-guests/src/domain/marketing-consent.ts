/** A guest's marketing choices (S54-07): each channel is off until they say yes. */

export interface MarketingConsent {
  sms: boolean;
  whatsapp: boolean;
  email: boolean;
  /** When they last changed it, or null when never asked. */
  changedAt: string | null;
}

/** Nothing allowed until the guest opts in. */
export const NO_CONSENT: MarketingConsent = { sms: false, whatsapp: false, email: false, changedAt: null };
