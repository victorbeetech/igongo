/** A staff card: one physical NFC card with its printed QR code. */

import type { CardStatus } from "@igongo/contracts/staff-cards";

export interface Card {
  cardId: string;
  /** The number printed on the card, such as `C-00042`. */
  cardNumber: string;
  /** The NFC chip's UID in upper-case hex, once the card is encoded. */
  uid: string | null;
  /** The random secret inside the QR code. A reset gives a new one, so old prints stop working. */
  qrToken: string;
  /** The chip type, such as `ntag213` or `ntag424` (Phase 2 card types). */
  cardType: string;
  /** The print design, such as `portrait-black` (the default for every role). */
  templateKey: string;
  /** The holder, or null while the card is in stock. */
  staffId: string | null;
  status: CardStatus;
  issuedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

/** The default design for every role, approved on 25 Nov 2026. */
export const DEFAULT_CARD_TEMPLATE = "portrait-black";
/** The chip on the hotel's current cards. */
export const DEFAULT_CARD_TYPE = "ntag213";
