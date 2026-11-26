/** Where staff profiles are kept. The Drizzle version is in infrastructure/db. */

import type { StaffDirectory } from "@igongo/contracts/hr-records";
import type { StaffDraft, StaffMember } from "../../domain/staff-member";
import type { StaffFilter } from "../../domain/staff-filter";

export interface StaffRepository extends StaffDirectory {
  /** The full profile, or null. */
  get(staffId: string): Promise<StaffMember | null>;
  /** The full profile for a staff number such as `IGG-0042`, or null. */
  byStaffNumber(staffNumber: string): Promise<StaffMember | null>;
  search(filter: StaffFilter): Promise<StaffMember[]>;
  /** The highest running number given so far (0 when none). */
  highestStaffNumber(): Promise<number>;
  create(input: StaffDraft & { staffId: string; staffNumber: string; userId: string | null; now: Date }): Promise<void>;
  update(staffId: string, changes: Partial<StaffDraft> & { userId?: string | null }, now: Date): Promise<void>;
}
