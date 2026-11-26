/**
 * One guest's or client's profile (S54-02, S54-05). There is one per
 * sign-in account; staff can also create one for a walk-in guest who has
 * no account yet (userId is then null until they sign up).
 */

import type { MarketingConsent } from "./marketing-consent";

export interface GuestProfile {
  /** The profile's ID, such as `gst_...`. */
  id: string;
  /** The guest's sign-in account, or null for a walk-in guest. */
  userId: string | null;
  name: string;
  email: string | null;
  phone: string | null;
  nationality: string | null;
  /** `YYYY-MM-DD`, for birthday reminders. */
  birthday: string | null;
  /** Free text, such as "quiet room, no onions". */
  preferences: string | null;
  allergies: string | null;
  /** Tags such as `vip`, `regular`, `wedding-client` (the list is the super admin's). */
  tags: string[];
  consent: MarketingConsent;
  createdAt: Date;
  updatedAt: Date;
}
