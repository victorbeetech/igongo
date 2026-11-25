/**
 * The `AccessReader` and `RoleAssigner` contracts that other modules and the
 * gateway are given. A thin wrapper over the use cases above.
 */

import type { AccessReader, RoleAssigner } from "@igongo/contracts/roles-permissions";
import { AppError } from "@igongo/core";
import { isActive } from "../../domain/role-assignment";
import type { ChangeContext } from "../change-context";
import type { AssignmentRepository } from "../ports/assignment-repository";
import type { RoleRepository } from "../ports/role-repository";
import { accessProfile } from "./access-profile";
import { assignRole } from "./assign-role";

/** Builds both contracts over the same repositories. */
export function accessService(
  deps: { roles: RoleRepository; assignments: AssignmentRepository },
  ctx: Omit<ChangeContext, "actorId">,
): AccessReader & RoleAssigner {
  return {
    profileFor: (userId) => accessProfile(deps, userId, ctx.now),
    async anyoneHolds(roleKey) {
      const role = await deps.roles.getByKey(roleKey);
      if (!role) return false;
      return (await deps.assignments.ofRole(role.id)).some((a) => isActive(a, ctx.now));
    },
    async holdersOf(roleKeys) {
      const roles = await Promise.all(roleKeys.map((k) => deps.roles.getByKey(k)));
      const ids = roles.filter((r) => r && !r.archivedAt).map((r) => (r as { id: string }).id);
      const active = (await deps.assignments.ofRoles(ids)).filter((a) => isActive(a, ctx.now));
      return [...new Set(active.map((a) => a.userId))];
    },
    async removeAllFor(userId) {
      for (const a of await deps.assignments.ofUser(userId)) await deps.assignments.remove(userId, a.roleId);
    },
    async assignByKey({ userId, roleKey, assignedBy }) {
      const role = await deps.roles.getByKey(roleKey);
      if (!role) throw new AppError("not_found", `The role ${roleKey} does not exist.`);
      await assignRole(deps, { ...ctx, actorId: assignedBy }, { userId, roleId: role.id });
    },
  };
}
