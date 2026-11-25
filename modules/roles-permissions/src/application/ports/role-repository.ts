/** Where roles, their permissions and included roles are stored. */

import type { Role, RoleDraft, RolePermission } from "../../domain/role";

export interface RoleRepository {
  /** All roles, archived ones only when asked. */
  list(includeArchived: boolean): Promise<Role[]>;
  get(id: string): Promise<Role | null>;
  getByKey(key: string): Promise<Role | null>;
  /** Several roles by ID, in any order. */
  getMany(ids: string[]): Promise<Role[]>;
  create(input: RoleDraft & { id: string; key: string }): Promise<void>;
  update(id: string, draft: Partial<RoleDraft>, now: Date): Promise<void>;
  /** Replaces all permissions of a role. */
  setPermissions(id: string, permissions: RolePermission[]): Promise<void>;
  /** Replaces the roles a role includes. */
  setIncludes(id: string, includedRoleIds: string[]): Promise<void>;
  setArchived(id: string, at: Date | null): Promise<void>;
  delete(id: string): Promise<void>;
}
