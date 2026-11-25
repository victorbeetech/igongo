/** What a staff directory search can narrow by. */

import type { StaffStatus } from "@igongo/contracts/hr-records";

export interface StaffFilter {
  /** Words in the name, staff number or job title. */
  q?: string;
  department?: string;
  status?: StaffStatus;
  /** Only this staff member (for people who may see only their own record). */
  staffId?: string;
  limit: number;
  offset: number;
}
