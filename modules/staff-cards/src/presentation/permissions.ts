/** Permission keys Staff Cards checks. The super admin gives them to roles. */

export const CARD_PERMISSIONS = {
  /** See cards and find who holds a card (gate, security, HR). */
  view: "staff-cards.cards.view",
  /** Register blank cards and issue them to staff. */
  create: "staff-cards.cards.create",
  /** Encode, reset and mark cards lost. */
  edit: "staff-cards.cards.edit",
} as const;
