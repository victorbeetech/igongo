/**
 * Use case: everything a person may do right now. The gateway calls this on
 * every signed-in request; the apps call it (`GET /me/access`) to build
 * their menus, home tiles and screens.
 */

import type { AccessProfile } from "@igongo/contracts/roles-permissions";
import { combineAccess } from "../../domain/combine-access";
import { isActive } from "../../domain/role-assignment";
import type { AssignmentRepository } from "../ports/assignment-repository";
import type { RoleRepository } from "../ports/role-repository";
import { loadRolesWithIncludes } from "./load-roles-with-includes";

/** The combined profile of [userId] at [now]. */
export async function accessProfile(deps: { roles: RoleRepository; assignments: AssignmentRepository }, userId: string, now: Date): Promise<AccessProfile> {
  // 1. Only assignments inside their time window count.
  const active = (await deps.assignments.ofUser(userId)).filter((a) => isActive(a, now));
  // 2. Add included roles, drop archived ones, then combine.
  const roles = await loadRolesWithIncludes(deps.roles, active.map((a) => a.roleId));
  // Keep the person's own roles first so their home tiles lead.
  const order = new Map(active.map((a, i) => [a.roleId, i]));
  roles.sort((a, b) => (order.get(a.id) ?? 99) - (order.get(b.id) ?? 99));
  return combineAccess(userId, roles);
}
