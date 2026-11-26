/**
 * The `StaffRecordMatcher` contract for Users & Login's staff match: find a
 * record by staff number (with its phone, for the check) and link it to the
 * matched account. Linking goes through `updateStaff`, so it is recorded and
 * adds the staff base role exactly like HR's own link.
 */

import type { StaffRecordMatcher } from "@igongo/contracts/hr-records";
import type { RoleAssigner } from "@igongo/contracts/roles-permissions";
import type { ChangeContext } from "@igongo/core";
import type { StaffRepository } from "../ports/staff-repository";
import { updateStaff } from "./update-staff";

export function staffRecordMatcher(deps: { staff: StaffRepository; roles: RoleAssigner }, ctx: ChangeContext): StaffRecordMatcher {
  return {
    async byStaffNumber(staffNumber) {
      const row = await deps.staff.byStaffNumber(staffNumber);
      return row ? { staffId: row.staffId, staffNumber: row.staffNumber, userId: row.userId, name: row.name, phone: row.phone, status: row.status } : null;
    },
    async linkAccount(staffId, userId) {
      await updateStaff(deps, ctx, staffId, { userId });
    },
  };
}
