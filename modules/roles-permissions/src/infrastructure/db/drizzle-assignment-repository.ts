/** `AssignmentRepository` on Postgres, with Drizzle. */

import { and, count, eq, inArray } from "drizzle-orm";
import type { Database } from "@igongo/core";
import type { AssignmentRepository } from "../../application/ports/assignment-repository";
import type { RoleAssignment } from "../../domain/role-assignment";
import { userRoles } from "./schema";

export class DrizzleAssignmentRepository implements AssignmentRepository {
  constructor(private readonly db: Database) {}

  ofUser(userId: string): Promise<RoleAssignment[]> {
    return this.db.select().from(userRoles).where(eq(userRoles.userId, userId)).orderBy(userRoles.assignedAt);
  }

  ofRole(roleId: string): Promise<RoleAssignment[]> {
    return this.db.select().from(userRoles).where(eq(userRoles.roleId, roleId));
  }

  async ofRoles(roleIds: string[]): Promise<RoleAssignment[]> {
    if (roleIds.length === 0) return [];
    return this.db.select().from(userRoles).where(inArray(userRoles.roleId, roleIds));
  }

  async upsert(a: RoleAssignment): Promise<void> {
    // Giving a role again just updates its dates.
    await this.db
      .insert(userRoles)
      .values(a)
      .onConflictDoUpdate({ target: [userRoles.userId, userRoles.roleId], set: { startsAt: a.startsAt, endsAt: a.endsAt, assignedBy: a.assignedBy, assignedAt: a.assignedAt } });
  }

  async remove(userId: string, roleId: string): Promise<boolean> {
    const gone = await this.db
      .delete(userRoles)
      .where(and(eq(userRoles.userId, userId), eq(userRoles.roleId, roleId)))
      .returning({ userId: userRoles.userId });
    return gone.length > 0;
  }

  async countHolders(roleId: string): Promise<number> {
    const [row] = await this.db.select({ n: count() }).from(userRoles).where(eq(userRoles.roleId, roleId));
    return row?.n ?? 0;
  }
}
