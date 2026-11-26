/**
 * Public contract of CRM: Guest & Client Profiles (module 54): a guest's
 * name and phone, for staff screens in other modules.
 */

/** A guest as other modules see them. */
export interface GuestRef {
  userId: string;
  name: string;
  phone: string | null;
  tags: string[];
}

/** Looks guests up. */
export interface GuestDirectory {
  byUserIds(userIds: string[]): Promise<GuestRef[]>;
}

/** Events this module emits. */
export const GUEST_EVENTS = {
  created: "guest.created",
  updated: "guest.updated",
  tagged: "guest.tagged",
  consentChanged: "guest.consent_changed",
} as const;
