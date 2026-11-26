/**
 * Use cases: give a role to a person (optionally between two dates) and take
 * it away. One person can hold any number of roles.
 */

import { SUPER_ADMIN_ROLE_KEY, type StaffAccountCheck } from "@igongo/contracts/roles-permissions";
import { AppError } from "@igongo/core";
import { isActive } from "../../domain/role-assignment";
import { recordRoleChange, type ChangeContext } from "../change-context";
import type { AssignmentRepository } from "../ports/assignment-repository";
import type { RoleRepository } from "../ports/role-repository";

/**
 * The stores, plus the staff-account check: a staff role (such as Waiter)
 * can only go to a staff account, so a guest who signed up in the app can
 * never be given staff access without the super admin's staff match.
 */
type Deps = { roles: RoleRepository; assignments: AssignmentRepository; staffAccounts: StaffAccountCheck };

/** Input for giving a role. */
export interface AssignRoleInput {
  userId: string;
  roleId: string;
  startsAt?: Date | null;
  endsAt?: Date | null;
}

/** @throws AppError `not_found` for an unknown or archived role, `bad_request` for a reversed date range */
export async function assignRole(deps: Deps, ctx: ChangeContext, input: AssignRoleInput): Promise<void> {
  const role = await deps.roles.get(input.roleId);
  if (!role || role.archivedAt) throw new AppError("not_found", "Role not found or archived.");
  // A staff role needs a staff account (matched to a staff record).
  if (role.isStaff && !(await deps.staffAccounts.isStaffAccount(input.userId))) {
    throw new AppError("permission_denied", "Staff roles can only be given to staff accounts. Match the person to their staff record first.");
  }
  if (input.startsAt && input.endsAt && input.endsAt <= input.startsAt) throw new AppError("bad_request", "The end date must be after the start date.");
  await deps.assignments.upsert({
    userId: input.userId,
    roleId: role.id,
    startsAt: input.startsAt ?? null,
    endsAt: input.endsAt ?? null,
    assignedBy: ctx.actorId,
    assignedAt: ctx.now,
  });
  await recordRoleChange(ctx, { action: "role.assigned", recordType: "user", recordId: input.userId, summary: `Gave the role ${role.name}` });
}

/** @throws AppError `not_found` when the person does not hold the role, `bad_request` for the last super admin */
export async function unassignRole(deps: Deps, ctx: ChangeContext, userId: string, roleId: string): Promise<void> {
  const role = await deps.roles.get(roleId);
  // The last super admin can never be removed, or nobody could run the system.
  if (role?.key === SUPER_ADMIN_ROLE_KEY) {
    const holders = (await deps.assignments.ofRole(role.id)).filter((a) => isActive(a, ctx.now));
    if (holders.length <= 1 && holders.some((a) => a.userId === userId)) throw new AppError("bad_request", "This is the last super admin. Add a second super admin first.");
  }
  if (!(await deps.assignments.remove(userId, roleId))) throw new AppError("not_found", "This person does not hold that role.");
  await recordRoleChange(ctx, { action: "role.unassigned", recordType: "user", recordId: userId, summary: `Took away the role ${role?.name ?? roleId}` });
}
