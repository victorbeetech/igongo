/**
 * A staff member's full profile at work. Other modules only see the smaller
 * `StaffRef` (packages/contracts/hr-records); HR sees all of this.
 */

import type { StaffRef } from "@igongo/contracts/hr-records";

export interface StaffMember extends StaffRef {
  phone: string | null;
  email: string | null;
  /** The first working day, as `YYYY-MM-DD`. */
  hireDate: string | null;
  /** Who to call in an emergency, as free text ("Jane, sister, 0772..."). */
  emergencyContact: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/** The fields HR fills in or changes. */
export type StaffDraft = Pick<StaffMember, "name" | "department" | "jobTitle" | "photoUrl" | "phone" | "email" | "hireDate" | "emergencyContact" | "status">;
