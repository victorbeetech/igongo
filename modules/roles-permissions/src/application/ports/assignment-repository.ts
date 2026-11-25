/** Who holds which role. */

import type { RoleAssignment } from "../../domain/role-assignment";

export interface AssignmentRepository {
  /** Every assignment of a person, active or not. */
  ofUser(userId: string): Promise<RoleAssignment[]>;
  /** Every holder of a role. */
  ofRole(roleId: string): Promise<RoleAssignment[]>;
  /** Holders of any of several roles (for the permission report). */
  ofRoles(roleIds: string[]): Promise<RoleAssignment[]>;
  /** Adds or replaces one assignment. */
  upsert(a: RoleAssignment): Promise<void>;
  /** Removes one assignment; false when there was none. */
  remove(userId: string, roleId: string): Promise<boolean>;
  /** How many people hold a role now or later. */
  countHolders(roleId: string): Promise<number>;
}
