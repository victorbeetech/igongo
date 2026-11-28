/** Permission keys Guest content checks. The super admin gives them to roles. */

export const GUEST_CONTENT_PERMISSIONS = {
  /** Change banners, stories, stays, facts and restaurant slides. */
  edit: "guest-content.content.edit",
  /** See switched-off items too (admin screens). */
  view: "guest-content.content.view",
} as const;
