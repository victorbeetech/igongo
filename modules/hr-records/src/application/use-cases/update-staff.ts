/**
 * Use case: change a staff profile (department, job title, status, contacts,
 * or the linked account). Records old and new values of every changed field.
 */

import type { RoleAssigner } from "@igongo/contracts/roles-permissions";
import { AppError, type ChangeContext } from "@igongo/core";
import type { StaffDraft, StaffMember } from "../../domain/staff-member";
import type { StaffRepository } from "../ports/staff-repository";
import { recordHrChange } from "../record-hr-change";
import { STAFF_BASE_ROLE_KEY } from "./enrol-staff";

export type UpdateStaffInput = Partial<StaffDraft> & { userId?: string | null };

/** @throws AppError `not_found`, or `conflict` when the account is linked elsewhere */
export async function updateStaff(deps: { staff: StaffRepository; roles: RoleAssigner }, ctx: ChangeContext, staffId: string, input: UpdateStaffInput): Promise<StaffMember> {
  // 1. The record must exist.
  const before = await deps.staff.get(staffId);
  if (!before) throw new AppError("not_found", "Staff member not found.");
  // 2. A newly linked account must be free.
  const linking = input.userId !== undefined && input.userId !== null && input.userId !== before.userId;
  if (linking && (await deps.staff.byUserId(input.userId as string))) throw new AppError("conflict", "This account is already linked to a staff record.");
  // 3. Keep only fields that really change, for the record.
  const changes: Record<string, { old: unknown; new: unknown }> = {};
  for (const [field, value] of Object.entries(input)) {
    const old = before[field as keyof StaffMember];
    if (value !== undefined && value !== old) changes[field] = { old, new: value };
  }
  if (Object.keys(changes).length === 0) return before;
  await deps.staff.update(staffId, input, ctx.now);
  if (linking) await deps.roles.assignByKey({ userId: input.userId as string, roleKey: STAFF_BASE_ROLE_KEY, assignedBy: ctx.actorId });
  // 4. Record it.
  const action = input.status === "left" ? "staff.left" : "staff.updated";
  await recordHrChange(ctx, { action, recordId: staffId, summary: `Updated ${before.name}: ${Object.keys(changes).join(", ")}`, changes });
  return (await deps.staff.get(staffId)) as StaffMember;
}
