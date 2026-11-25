/**
 * Loads roles plus every role they include, following includes down to any
 * depth (with a guard against loops), so a role such as Waiter that includes
 * the staff base role gives the base role's permissions too.
 */

import type { Role } from "../../domain/role";
import type { RoleRepository } from "../ports/role-repository";

/** At most this many include levels are followed. */
const MAX_DEPTH = 5;

/** The roles with [ids] and all roles they include, without repeats; archived roles are left out. */
export async function loadRolesWithIncludes(repo: RoleRepository, ids: string[]): Promise<Role[]> {
  const found = new Map<string, Role>();
  let next = ids;
  for (let depth = 0; depth <= MAX_DEPTH && next.length > 0; depth++) {
    const fresh = (await repo.getMany(next.filter((id) => !found.has(id)))).filter((r) => !r.archivedAt);
    for (const role of fresh) found.set(role.id, role);
    next = fresh.flatMap((r) => r.includedRoleIds).filter((id) => !found.has(id));
  }
  return [...found.values()];
}
