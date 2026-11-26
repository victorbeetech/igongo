/**
 * Permission keys App Layout checks. The super admin holds `*`; the hotel
 * may give layout editing to an IT or brand role in the role builder.
 */

export const LAYOUT_PERMISSIONS = {
  /** Read any role's layout and history. */
  view: "app-builder.layouts.view",
  /** Publish and roll back layouts. */
  edit: "app-builder.layouts.edit",
  /** The public screens and client view rules. */
  settings: "app-builder.settings.edit",
} as const;
