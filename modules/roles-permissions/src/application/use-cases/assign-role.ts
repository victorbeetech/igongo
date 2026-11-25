/**
 * Use cases: give a role to a person (optionally between two dates) and take
 * it away. One person can hold any number of roles.
 */

import { AppError } from "@igongo/core";
import { recordRoleChange, type ChangeContext } from "../change-context";
import type { AssignmentRepository } from "../ports/assignment-repository";
import type { RoleRepository } from "../ports/role-repository";

type Deps = { roles: RoleRepository; assignments: AssignmentRepository };

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

/** @throws AppError `not_found` when the person does not hold the role */
export async function unassignRole(deps: Deps, ctx: ChangeContext, userId: string, roleId: string): Promise<void> {
  const role = await deps.roles.get(roleId);
  if (!(await deps.assignments.remove(userId, roleId))) throw new AppError("not_found", "This person does not hold that role.");
  await recordRoleChange(ctx, { action: "role.unassigned", recordType: "user", recordId: userId, summary: `Took away the role ${role?.name ?? roleId}` });
}
