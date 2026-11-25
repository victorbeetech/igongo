/**
 * Use case: edit a role's details, permissions and included roles. Every
 * changed field is recorded with its old and new value.
 */

import { AppError } from "@igongo/core";
import { isValidPermissionKey } from "../../domain/permission-key";
import type { Role, RoleDraft, RolePermission } from "../../domain/role";
import { recordRoleChange, type ChangeContext } from "../change-context";
import type { RoleRepository } from "../ports/role-repository";

/** Input: any fields to change. Lists replace the old list. */
export interface UpdateRoleInput extends Partial<RoleDraft> {
  permissions?: RolePermission[];
  includedRoleIds?: string[];
}

/** @throws AppError `not_found`, or `bad_request` for a bad permission key or a role including itself */
export async function updateRole(repo: RoleRepository, ctx: ChangeContext, id: string, input: UpdateRoleInput): Promise<Role> {
  const before = await repo.get(id);
  if (!before) throw new AppError("not_found", "Role not found.");
  const { permissions, includedRoleIds, ...draft } = input;
  // 1. Check the lists before saving anything.
  const badKey = permissions?.find((p) => !isValidPermissionKey(p.key));
  if (badKey) throw new AppError("bad_request", `Not a valid permission key: ${badKey.key}`);
  if (includedRoleIds?.includes(id)) throw new AppError("bad_request", "A role cannot include itself.");
  // 2. Save each part that was sent.
  if (Object.keys(draft).length > 0) await repo.update(id, draft, ctx.now);
  if (permissions) await repo.setPermissions(id, dedupe(permissions));
  if (includedRoleIds) await repo.setIncludes(id, [...new Set(includedRoleIds)]);
  // 3. Record what changed, field by field.
  const changes = diff(before, input);
  if (Object.keys(changes).length > 0) {
    await recordRoleChange(ctx, { action: "role.updated", recordType: "role", recordId: id, summary: `Changed the role ${before.name}`, changes });
  }
  return (await repo.get(id)) as Role;
}

/** One entry per key; the last one sent wins. */
function dedupe(list: RolePermission[]): RolePermission[] {
  return [...new Map(list.map((p) => [p.key, p])).values()];
}

/** Old and new values of the fields that really changed. */
function diff(before: Role, input: UpdateRoleInput) {
  const changes: Record<string, { old: unknown; new: unknown }> = {};
  for (const [field, value] of Object.entries(input)) {
    const old = before[field as keyof Role];
    if (JSON.stringify(old) !== JSON.stringify(value)) changes[field] = { old, new: value };
  }
  return changes;
}
