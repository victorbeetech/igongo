/**
 * Use case: enrol a new staff member. Gives the next staff number, links the
 * sign-in account when one is given (and gives it the "Every Staff Member"
 * base role, so self-service works at once), and records it.
 */

import type { RoleAssigner } from "@igongo/contracts/roles-permissions";
import { AppError, newId, type ChangeContext } from "@igongo/core";
import type { StaffDraft, StaffMember } from "../../domain/staff-member";
import { nextStaffNumber } from "../../domain/staff-number";
import type { StaffRepository } from "../ports/staff-repository";
import { recordHrChange } from "../record-hr-change";

/** The role every staff account gets (docs/roles/staff-base.md). */
export const STAFF_BASE_ROLE_KEY = "staff-base";

export interface EnrolStaffInput extends Partial<StaffDraft> {
  name: string;
  /** The person's sign-in account, if they already have one. */
  userId?: string | null;
}

/** @throws AppError `conflict` when the account is already linked to another staff record */
export async function enrolStaff(deps: { staff: StaffRepository; roles: RoleAssigner }, ctx: ChangeContext, input: EnrolStaffInput): Promise<StaffMember> {
  // 1. One staff record per account.
  if (input.userId && (await deps.staff.byUserId(input.userId))) throw new AppError("conflict", "This account is already linked to a staff record.");
  // 2. The next number, and the record.
  const staffId = newId("stf");
  const staffNumber = nextStaffNumber(await deps.staff.highestStaffNumber());
  await deps.staff.create({
    staffId,
    staffNumber,
    userId: input.userId ?? null,
    name: input.name,
    department: input.department ?? null,
    jobTitle: input.jobTitle ?? null,
    photoUrl: input.photoUrl ?? null,
    phone: input.phone ?? null,
    email: input.email ?? null,
    hireDate: input.hireDate ?? null,
    emergencyContact: input.emergencyContact ?? null,
    status: input.status ?? "active",
    now: ctx.now,
  });
  // 3. Self-service for the linked account.
  if (input.userId) await deps.roles.assignByKey({ userId: input.userId, roleKey: STAFF_BASE_ROLE_KEY, assignedBy: ctx.actorId });
  // 4. Record it.
  await recordHrChange(ctx, { action: "staff.enrolled", recordId: staffId, summary: `Enrolled ${input.name} as ${staffNumber}` });
  return (await deps.staff.get(staffId)) as StaffMember;
}
