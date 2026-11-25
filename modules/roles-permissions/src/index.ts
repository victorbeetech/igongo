/**
 * The Roles & Permissions module (module 2) of the Igongo API. The gateway
 * imports only this file. See modules/roles-permissions/README.md.
 */

export type { ChangeContext } from "./application/change-context";
export { accessProfile } from "./application/use-cases/access-profile";
export { accessService } from "./application/use-cases/access-service";
export { combineAccess } from "./domain/combine-access";
export type { Role } from "./domain/role";
export { DrizzleAssignmentRepository } from "./infrastructure/db/drizzle-assignment-repository";
export { DrizzleRoleRepository } from "./infrastructure/db/drizzle-role-repository";
export { ROLE_PERMISSIONS } from "./presentation/permissions";
export { rolesRouter, type RolesDeps } from "./presentation/roles-router";
