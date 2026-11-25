/**
 * Use case: the permission report, "who can do X, and why". Lists every role
 * that gives [permission] (directly, by wildcard or through an included
 * role) and the people who hold those roles now.
 */

import type { DataScope } from "@igongo/contracts/roles-permissions";
import { AppError, permissionMatches } from "@igongo/core";
import { isValidPermissionKey } from "../../domain/permission-key";
import { isActive } from "../../domain/role-assignment";
import type { AssignmentRepository } from "../ports/assignment-repository";
import type { RoleRepository } from "../ports/role-repository";

/** One role that gives the permission, and through which grant. */
export interface WhoCanRow {
  roleId: string;
  roleName: string;
  grantedBy: string;
  scope: DataScope;
  holders: string[];
}

export async function whoCan(deps: { roles: RoleRepository; assignments: AssignmentRepository }, permission: string, now: Date): Promise<WhoCanRow[]> {
  if (!isValidPermissionKey(permission) || permission.includes("*")) throw new AppError("bad_request", "Ask about one exact permission, such as pool.passes.view.");
  // 1. Roles that grant it themselves.
  const all = (await deps.roles.list(false)).filter((r) => !r.archivedAt);
  const direct = new Map(all.flatMap((r) => r.permissions.filter((p) => permissionMatches(p.key, permission)).map((p) => [r.id, { role: r, p }] as const)));
  // 2. Roles that include one of those (one level is what the role builder shows).
  for (const r of all) {
    const via = r.includedRoleIds.map((id) => direct.get(id)).find(Boolean);
    if (via && !direct.has(r.id)) direct.set(r.id, { role: r, p: { ...via.p, key: `${via.p.key} (from ${via.role.name})` } });
  }
  // 3. Who holds each role now.
  const holders = (await deps.assignments.ofRoles([...direct.keys()])).filter((a) => isActive(a, now));
  return [...direct.values()].map(({ role, p }) => ({
    roleId: role.id,
    roleName: role.name,
    grantedBy: p.key,
    scope: p.scope,
    holders: holders.filter((h) => h.roleId === role.id).map((h) => h.userId),
  }));
}
