/** A role and what it gives, as the use cases see it. */

import type { DataScope } from "@igongo/contracts/roles-permissions";

/** One permission a role gives. */
export interface RolePermission {
  /** `module.feature.action`, `*` allowed in any part. */
  key: string;
  scope: DataScope;
}

/** A role with its permissions and the roles it includes. */
export interface Role {
  id: string;
  key: string;
  name: string;
  description: string;
  level: string;
  department: string | null;
  color: string | null;
  icon: string | null;
  isStaff: boolean;
  isPremade: boolean;
  reportsToRoleId: string | null;
  homeTiles: string[];
  rules: { approvalLimits: string[]; extraRules: string[] };
  archivedAt: Date | null;
  permissions: RolePermission[];
  includedRoleIds: string[];
}

/** The fields the super admin can edit. */
export type RoleDraft = Pick<Role, "name" | "description" | "level" | "department" | "color" | "icon" | "isStaff" | "reportsToRoleId" | "homeTiles" | "rules">;
