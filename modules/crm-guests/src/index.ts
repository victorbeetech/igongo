/**
 * CRM: Guest & Client Profiles (module 54) of the Igongo API. The gateway
 * imports only this file. See modules/crm-guests/README.md.
 */

export type { CrmDeps } from "./application/crm-deps";
export type { GuestProfile } from "./domain/guest-profile";
export { DrizzleProfileRepository } from "./infrastructure/db/drizzle-profile-repository";
export { SettingsCrmStore } from "./infrastructure/db/settings-crm-store";
export { guestDirectory } from "./infrastructure/guest-directory";
export { CRM_PERMISSIONS } from "./presentation/permissions";
export { crmRouter } from "./presentation/crm-router";
export { guestKpis } from "./infrastructure/guest-kpis";
