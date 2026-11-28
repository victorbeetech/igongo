/**
 * Guest content of the Igongo API: the banners, stories, featured stays,
 * did-you-know cards and restaurant slides the super admin edits and the
 * guest app shows. The gateway imports only this file.
 */

export type { GuestContentDeps } from "./application/guest-content-deps";
export type { GuestContentStore } from "./application/ports/guest-content-store";
export { activeContent } from "./domain/active-content";
export * from "./domain/content";
export { SettingsGuestContentStore } from "./infrastructure/db/settings-guest-content-store";
export { readActiveContent, readFullContent } from "./application/use-cases/read-content";
export { saveContent } from "./application/use-cases/save-content";
export { GUEST_CONTENT_PERMISSIONS } from "./presentation/permissions";
export { guestContentRouter } from "./presentation/content-router";
