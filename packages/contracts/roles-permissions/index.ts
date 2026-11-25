/**
 * Public contract of Roles & Permissions (module 2). The API gateway asks it
 * what a person may do; other modules only ever see the result.
 */

/** How much data a permission reaches, widest first. */
export const DATA_SCOPES = ["all", "location", "department", "team", "assigned", "own", "public"] as const;
export type DataScope = (typeof DATA_SCOPES)[number];

/** One permission a person holds, and how far it reaches. */
export interface GrantedPermission {
  /** `module.feature.action`, with `*` allowed in any part. */
  key: string;
  scope: DataScope;
}

/** A role, as other modules and the apps see it. */
export interface RoleSummary {
  id: string;
  key: string;
  name: string;
  level: string;
  isStaff: boolean;
}

/** Everything a signed-in person may do, combined from all their active roles. */
export interface AccessProfile {
  userId: string;
  roles: RoleSummary[];
  permissions: GrantedPermission[];
  /** Home tiles, in role order, without repeats. */
  homeTiles: string[];
  /** Module keys the person can open (any `view` permission), for the sidebar and app menu. */
  menu: string[];
  /** True when any role is a staff role (so the client view switch shows). */
  isStaff: boolean;
}

/** Reads access profiles. The gateway caches them per request. */
export interface AccessReader {
  profileFor(userId: string): Promise<AccessProfile>;
  /** True when at least one person holds the given role key. */
  anyoneHolds(roleKey: string): Promise<boolean>;
  /** Everyone who holds at least one of [roleKeys] now (for broadcasts). */
  holdersOf(roleKeys: string[]): Promise<string[]>;
}

/** Gives roles from other modules (such as the first super admin set-up). */
export interface RoleAssigner {
  assignByKey(input: { userId: string; roleKey: string; assignedBy: string | null }): Promise<void>;
  /** Removes every role of a person whose account was deleted. */
  removeAllFor(userId: string): Promise<void>;
}

/** The role key of the all-powerful Super Admin. */
export const SUPER_ADMIN_ROLE_KEY = "super-admin";
/** The role every new client account gets. */
export const CLIENT_ROLE_KEY = "guest";

/** Events this module emits. */
export const ROLE_EVENTS = {
  created: "role.created",
  updated: "role.updated",
  archived: "role.archived",
  assigned: "role.assigned",
  unassigned: "role.unassigned",
  permissionDenied: "permission.denied",
} as const;
