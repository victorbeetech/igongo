/**
 * Permission keys the card design routes check. They sit under Staff Cards
 * (module 16), so the pre-made card roles' wildcards cover them.
 */

export const DESIGN_PERMISSIONS = {
  /** Change templates, card types and which template each role uses. */
  edit: "staff-cards.designs.edit",
} as const;
