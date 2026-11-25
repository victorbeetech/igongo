/**
 * Roles & Permissions' own Postgres schema, `roles`. No other module reads
 * these tables. Roles are data: the super admin creates and edits them at
 * runtime, and the 121 pre-made roles are seeded by migration 0001.
 */

import { boolean, index, jsonb, pgSchema, primaryKey, text, timestamp } from "drizzle-orm/pg-core";
import type { DataScope } from "@igongo/contracts/roles-permissions";

/** The `roles` schema. */
export const rolesSchema = pgSchema("roles");

/** Free-text rules shown on the role page (approval limits, extra rules). */
export interface RoleRules {
  approvalLimits: string[];
  extraRules: string[];
}

/** One role, such as Chef or Lifeguard. */
export const roles = rolesSchema.table("roles", {
  id: text("id").primaryKey(),
  /** Stable machine key, such as `executive-chef`. Never changes. */
  key: text("key").notNull().unique(),
  name: text("name").notNull(),
  description: text("description").notNull().default(""),
  /** Group for lists, such as `Department managers`. */
  level: text("level").notNull().default("Custom"),
  department: text("department"),
  /** Brand token name or hex, and an icon name, for the role badge. */
  color: text("color"),
  icon: text("icon"),
  /** Staff roles get the client view switch; guest and partner roles don't. */
  isStaff: boolean("is_staff").notNull().default(true),
  /** True for the seeded pre-made roles (still fully editable). */
  isPremade: boolean("is_premade").notNull().default(false),
  reportsToRoleId: text("reports_to_role_id"),
  /** Home screen tiles, in order. */
  homeTiles: jsonb("home_tiles").$type<string[]>().notNull().default([]),
  rules: jsonb("rules").$type<RoleRules>().notNull().default({ approvalLimits: [], extraRules: [] }),
  /** Archived roles keep their history but give no access. */
  archivedAt: timestamp("archived_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

/** One permission a role gives: `module.feature.action` with a data scope. */
export const rolePermissions = rolesSchema.table(
  "role_permissions",
  {
    roleId: text("role_id").notNull().references(() => roles.id, { onDelete: "cascade" }),
    permissionKey: text("permission_key").notNull(),
    scope: text("scope").$type<DataScope>().notNull().default("all"),
  },
  (t) => [primaryKey({ columns: [t.roleId, t.permissionKey] }), index("role_permissions_key_idx").on(t.permissionKey)],
);

/** A role that includes everything another role gives (such as the staff base role). */
export const roleIncludes = rolesSchema.table(
  "role_includes",
  {
    roleId: text("role_id").notNull().references(() => roles.id, { onDelete: "cascade" }),
    includedRoleId: text("included_role_id").notNull().references(() => roles.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.roleId, t.includedRoleId] })],
);

/** Who holds which role, optionally only between two dates ("Acting GM for two weeks"). */
export const userRoles = rolesSchema.table(
  "user_roles",
  {
    /** A user ID from Users & Login. */
    userId: text("user_id").notNull(),
    roleId: text("role_id").notNull().references(() => roles.id, { onDelete: "cascade" }),
    startsAt: timestamp("starts_at", { withTimezone: true }),
    endsAt: timestamp("ends_at", { withTimezone: true }),
    assignedBy: text("assigned_by"),
    assignedAt: timestamp("assigned_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.roleId] }), index("user_roles_role_idx").on(t.roleId)],
);
