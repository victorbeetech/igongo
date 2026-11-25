/** Permission keys Wristbands checks. The super admin gives them to roles. */

export const BAND_PERMISSIONS = {
  /** See bands and scan them at a door (gate, security, events). */
  view: "wristbands.bands.view",
  /** Register new bands into stock. */
  create: "wristbands.bands.create",
  /** Assign and reset ranges, encode, mark missing or retired. */
  edit: "wristbands.bands.edit",
} as const;
