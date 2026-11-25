/**
 * Use case: create a role, from blank or by cloning another role (its
 * permissions, includes and tiles are copied). Recorded in the Audit Trail.
 */

import { AppError, newId } from "@igongo/core";
import type { Role, RoleDraft } from "../../domain/role";
import type { ChangeContext } from "../change-context";
import { recordRoleChange } from "../change-context";
import type { RoleRepository } from "../ports/role-repository";

/** Input: the new role's key and fields, and optionally a role to clone. */
export interface CreateRoleInput extends Partial<RoleDraft> {
  key: string;
  name: string;
  cloneFromRoleId?: string;
}

/** @throws AppError `conflict` when the key is taken, `not_found` when the clone source is missing */
export async function createRole(repo: RoleRepository, ctx: ChangeContext, input: CreateRoleInput): Promise<Role> {
  // 1. Keys are unique and never reused.
  if (await repo.getByKey(input.key)) throw new AppError("conflict", `A role with the key ${input.key} already exists.`);
  // 2. Start from the clone source, or from blank.
  const source = input.cloneFromRoleId ? await repo.get(input.cloneFromRoleId) : null;
  if (input.cloneFromRoleId && !source) throw new AppError("not_found", "The role to copy was not found.");
  const id = newId("role");
  const draft: RoleDraft = {
    name: input.name,
    description: input.description ?? source?.description ?? "",
    level: input.level ?? source?.level ?? "Custom",
    department: input.department ?? source?.department ?? null,
    color: input.color ?? source?.color ?? null,
    icon: input.icon ?? source?.icon ?? null,
    isStaff: input.isStaff ?? source?.isStaff ?? true,
    reportsToRoleId: input.reportsToRoleId ?? source?.reportsToRoleId ?? null,
    homeTiles: input.homeTiles ?? source?.homeTiles ?? [],
    rules: input.rules ?? source?.rules ?? { approvalLimits: [], extraRules: [] },
  };
  // 3. Save, copying the source's permissions and includes.
  await repo.create({ ...draft, id, key: input.key });
  if (source) {
    await repo.setPermissions(id, source.permissions);
    await repo.setIncludes(id, source.includedRoleIds);
  }
  // 4. Record it.
  await recordRoleChange(ctx, {
    action: "role.created",
    recordType: "role",
    recordId: id,
    summary: source ? `Created the role ${input.name} as a copy of ${source.name}` : `Created the role ${input.name}`,
  });
  return (await repo.get(id)) as Role;
}
