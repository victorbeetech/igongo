/**
 * Public contract of Staff Cards (module 16): turning a tapped NFC card or a
 * scanned QR code into the staff member who holds it. Attendance (gate and
 * reception clock-in) and Staff Meals (canteen) use only this.
 */

/** What a reader or camera saw. Exactly one of the two is set. */
export interface CardScan {
  /** The NFC chip's UID as hex, such as `04A1B2C3D4E5F6`. */
  uid?: string;
  /** The text of the card's QR code. */
  qr?: string;
}

/** A card that was found, and who holds it. */
export interface ResolvedCard {
  cardId: string;
  cardNumber: string;
  /** The holder, or null when the card is in stock or was reset. */
  staffId: string | null;
  /** Only `active` cards may be used to clock in or claim meals. */
  status: CardStatus;
}

/** A card's life: in stock, in use, or taken out of use. */
export const CARD_STATUSES = ["unassigned", "active", "lost", "revoked"] as const;
export type CardStatus = (typeof CARD_STATUSES)[number];

/** Finds cards from a scan. The gateway builds it from Staff Cards for each request. */
export interface CardResolver {
  /** The card for [scan], or null when no card matches. */
  resolve(scan: CardScan): Promise<ResolvedCard | null>;
}

/** Events this module emits. */
export const CARD_EVENTS = {
  issued: "card.issued",
  reset: "card.reset",
  reportedLost: "card.lost",
} as const;
