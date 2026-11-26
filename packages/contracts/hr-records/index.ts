/**
 * Public contract of HR Records (module 22): the staff directory other
 * modules use to find who a person is (staff number, name, department).
 * Attendance, Staff Cards, Daily Reports and Staff Meals read staff only
 * through this, never through HR's tables.
 */

/** Where a staff member is in their working life. */
export const STAFF_STATUSES = ["active", "suspended", "left"] as const;
export type StaffStatus = (typeof STAFF_STATUSES)[number];

/** A staff member, as other modules see them. */
export interface StaffRef {
  /** The staff record's ID, such as `stf_3f9c...`. */
  staffId: string;
  /** The person's sign-in account, once they have one. */
  userId: string | null;
  /** The number printed on the card, such as `IGG-0042`. */
  staffNumber: string;
  name: string;
  /** The department key, such as `kitchen`. Locations & Departments will own this list. */
  department: string | null;
  jobTitle: string | null;
  /** The photo on the card and profile. */
  photoUrl: string | null;
  status: StaffStatus;
}

/** Looks staff up. The gateway builds it from HR Records for each request. */
export interface StaffDirectory {
  /** The staff record linked to a sign-in account, or null for clients. */
  byUserId(userId: string): Promise<StaffRef | null>;
  byId(staffId: string): Promise<StaffRef | null>;
  /** Several at once, for lists. Unknown IDs are left out. */
  byIds(staffIds: string[]): Promise<StaffRef[]>;
  /** Every active staff member, optionally in one department (for "missing" lists). */
  active(department?: string): Promise<StaffRef[]>;
}

/** Events this module emits. */
export const HR_EVENTS = {
  staffEnrolled: "staff.enrolled",
  staffUpdated: "staff.updated",
  staffLeft: "staff.left",
} as const;

/** A staff record as the super admin's staff match sees it (with the phone, never shown to the caller). */
export interface StaffMatchRecord {
  staffId: string;
  staffNumber: string;
  userId: string | null;
  name: string;
  phone: string | null;
  status: StaffStatus;
}

/**
 * Finds a staff record by number and links it to an account, for Users &
 * Login's staff match. Linking adds the staff base role, like HR's own link.
 */
export interface StaffRecordMatcher {
  byStaffNumber(staffNumber: string): Promise<StaffMatchRecord | null>;
  linkAccount(staffId: string, userId: string): Promise<void>;
}
