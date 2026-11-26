/** Permission keys CRM checks. The super admin gives them to roles. */

export const CRM_PERMISSIONS = {
  /** Own: my profile (guests). All/department: the guests list and profiles (staff). */
  view: "crm-guests.profiles.view",
  /** Own: change my details. All: tag guests, add notes. */
  edit: "crm-guests.profiles.edit",
  /** Add walk-in guests at the desk. */
  create: "crm-guests.profiles.create",
  /** Change the tag list. */
  settings: "crm-guests.settings.edit",
} as const;
