/** `RoleRepository` on Postgres, with Drizzle. */

import { asc, eq, inArray, isNull } from "drizzle-orm";
import type { Database } from "@igongo/core";
import type { RoleRepository } from "../../application/ports/role-repository";
import type { Role, RoleDraft, RolePermission } from "../../domain/role";
import { roleIncludes, rolePermissions, roles } from "./schema";

export class DrizzleRoleRepository implements RoleRepository {
  constructor(private readonly db: Database) {}

  async list(includeArchived: boolean): Promise<Role[]> {
    const rows = await this.db
      .select()
      .from(roles)
      .where(includeArchived ? undefined : isNull(roles.archivedAt))
      .orderBy(asc(roles.level), asc(roles.name));
    return this.withDetails(rows);
  }

  async get(id: string): Promise<Role | null> {
    return (await this.getMany([id]))[0] ?? null;
  }

  async getByKey(key: string): Promise<Role | null> {
    const rows = await this.db.select().from(roles).where(eq(roles.key, key));
    return (await this.withDetails(rows))[0] ?? null;
  }

  async getMany(ids: string[]): Promise<Role[]> {
    if (ids.length === 0) return [];
    return this.withDetails(await this.db.select().from(roles).where(inArray(roles.id, ids)));
  }

  async create(input: RoleDraft & { id: string; key: string }): Promise<void> {
    await this.db.insert(roles).values(input);
  }

  async update(id: string, draft: Partial<RoleDraft>, now: Date): Promise<void> {
    await this.db.update(roles).set({ ...draft, updatedAt: now }).where(eq(roles.id, id));
  }

  async setPermissions(id: string, permissions: RolePermission[]): Promise<void> {
    // Replace the whole list: delete, then insert the new one.
    await this.db.delete(rolePermissions).where(eq(rolePermissions.roleId, id));
    if (permissions.length) await this.db.insert(rolePermissions).values(permissions.map((p) => ({ roleId: id, permissionKey: p.key, scope: p.scope })));
  }

  async setIncludes(id: string, includedRoleIds: string[]): Promise<void> {
    await this.db.delete(roleIncludes).where(eq(roleIncludes.roleId, id));
    if (includedRoleIds.length) await this.db.insert(roleIncludes).values(includedRoleIds.map((includedRoleId) => ({ roleId: id, includedRoleId })));
  }

  async setArchived(id: string, at: Date | null): Promise<void> {
    await this.db.update(roles).set({ archivedAt: at }).where(eq(roles.id, id));
  }

  async delete(id: string): Promise<void> {
    // Permissions, includes and assignments go with it (ON DELETE CASCADE).
    await this.db.delete(roles).where(eq(roles.id, id));
  }

  /** Adds each role's permissions and included roles, in two queries for any number of roles. */
  private async withDetails(rows: (typeof roles.$inferSelect)[]): Promise<Role[]> {
    if (rows.length === 0) return [];
    const ids = rows.map((r) => r.id);
    const perms = await this.db.select().from(rolePermissions).where(inArray(rolePermissions.roleId, ids));
    const incs = await this.db.select().from(roleIncludes).where(inArray(roleIncludes.roleId, ids));
    return rows.map((r) => ({
      id: r.id,
      key: r.key,
      name: r.name,
      description: r.description,
      level: r.level,
      department: r.department,
      color: r.color,
      icon: r.icon,
      isStaff: r.isStaff,
      isPremade: r.isPremade,
      reportsToRoleId: r.reportsToRoleId,
      homeTiles: r.homeTiles,
      rules: r.rules,
      archivedAt: r.archivedAt,
      permissions: perms.filter((p) => p.roleId === r.id).map((p) => ({ key: p.permissionKey, scope: p.scope })),
      includedRoleIds: incs.filter((i) => i.roleId === r.id).map((i) => i.includedRoleId),
    }));
  }
}
