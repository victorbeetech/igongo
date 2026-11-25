/**
 * Use cases: archive or restore a role, and delete one. Archiving keeps the
 * role and its history but stops it giving access. Deleting is only allowed
 * when nobody holds the role, so no one loses access by surprise.
 */

import { AppError } from "@igongo/core";
import { recordRoleChange, type ChangeContext } from "../change-context";
import type { AssignmentRepository } from "../ports/assignment-repository";
import type { RoleRepository } from "../ports/role-repository";

/** Archives ([archived] true) or restores a role. */
export async function setRoleArchived(repo: RoleRepository, ctx: ChangeContext, id: string, archived: boolean): Promise<void> {
  const role = await repo.get(id);
  if (!role) throw new AppError("not_found", "Role not found.");
  await repo.setArchived(id, archived ? ctx.now : null);
  await recordRoleChange(ctx, {
    action: archived ? "role.archived" : "role.restored",
    recordType: "role",
    recordId: id,
    summary: `${archived ? "Archived" : "Restored"} the role ${role.name}`,
  });
}

/** @throws AppError `conflict` while anyone holds the role */
export async function deleteRole(deps: { roles: RoleRepository; assignments: AssignmentRepository }, ctx: ChangeContext, id: string): Promise<void> {
  const role = await deps.roles.get(id);
  if (!role) throw new AppError("not_found", "Role not found.");
  const holders = await deps.assignments.countHolders(id);
  if (holders > 0) throw new AppError("conflict", `${holders} people hold this role. Remove it from them or archive it instead.`);
  // Record first: if recording fails, the role is not deleted.
  await recordRoleChange(ctx, { action: "role.deleted", recordType: "role", recordId: id, summary: `Deleted the role ${role.name}`, changes: { key: { old: role.key, new: null } } });
  await deps.roles.delete(id);
}
