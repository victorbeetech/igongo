/**
 * Card designs (module 16, S16-02 to S16-07) of the Igongo API: templates,
 * card types and which template each role uses. The gateway imports only
 * this file.
 */

export type { DesignsDeps } from "./application/designs-deps";
export type { CardDesigns } from "./domain/card-designs";
export { DEFAULT_CARD_DESIGNS } from "./domain/default-designs";
export { SettingsDesignsStore } from "./infrastructure/db/settings-designs-store";
export { designsRouter } from "./presentation/designs-router";
export { DESIGN_PERMISSIONS } from "./presentation/permissions";
