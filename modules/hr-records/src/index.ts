/**
 * HR Records (module 22) of the Igongo API. The gateway imports only this
 * file. See modules/hr-records/README.md.
 */

export type { StaffRepository } from "./application/ports/staff-repository";
export { enrolStaff, STAFF_BASE_ROLE_KEY } from "./application/use-cases/enrol-staff";
export { updateStaff } from "./application/use-cases/update-staff";
export type { StaffDraft, StaffMember } from "./domain/staff-member";
export { nextStaffNumber } from "./domain/staff-number";
export { DrizzleStaffRepository } from "./infrastructure/db/drizzle-staff-repository";
export { HR_PERMISSIONS } from "./presentation/permissions";
export { hrRouter, type HrDeps } from "./presentation/hr-router";
