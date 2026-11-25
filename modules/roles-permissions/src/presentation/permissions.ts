/** Permission keys Roles & Permissions checks. The super admin gives them to roles. */

export const ROLE_PERMISSIONS = {
  viewRoles: "roles-permissions.roles.view",
  createRoles: "roles-permissions.roles.create",
  editRoles: "roles-permissions.roles.edit",
  deleteRoles: "roles-permissions.roles.delete",
  viewAssignments: "roles-permissions.assignments.view",
  assign: "roles-permissions.assignments.create",
  unassign: "roles-permissions.assignments.delete",
  viewReport: "roles-permissions.report.view",
} as const;
