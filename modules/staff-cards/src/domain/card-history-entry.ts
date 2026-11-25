/** One line in a card's life story: who held it, and when it changed. */

export const CARD_ACTIONS = ["registered", "encoded", "issued", "reset", "lost"] as const;
export type CardAction = (typeof CARD_ACTIONS)[number];

export interface CardHistoryEntry {
  id: string;
  cardId: string;
  action: CardAction;
  /** The holder at that moment (the new holder when issued, the old one when reset). */
  staffId: string | null;
  /** Who did it (a user ID). */
  actorId: string | null;
  at: Date;
}
