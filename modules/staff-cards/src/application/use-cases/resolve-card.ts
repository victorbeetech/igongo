/**
 * Use case: find the card behind a tap or a scan. This is the CardResolver
 * contract other modules (Attendance, Staff Meals) call.
 */

import type { CardResolver, CardScan, ResolvedCard } from "@igongo/contracts/staff-cards";
import { AppError, normalizeUid } from "@igongo/core";
import type { Card } from "../../domain/card";
import { qrTokenFrom } from "../../domain/card-codes";
import type { CardRepository } from "../ports/card-repository";

/** The card for [scan], or null. @throws AppError `bad_request` when the scan has neither a UID nor a QR text */
export async function findCard(cards: CardRepository, scan: CardScan): Promise<Card | null> {
  if (scan.uid) return cards.byUid(normalizeUid(scan.uid));
  if (scan.qr) {
    const token = qrTokenFrom(scan.qr);
    return token ? cards.byQrToken(token) : null;
  }
  throw new AppError("bad_request", "Tap a card or scan its QR code.");
}

/** The CardResolver contract on top of [cards]. */
export function cardResolver(cards: CardRepository): CardResolver {
  return {
    async resolve(scan: CardScan): Promise<ResolvedCard | null> {
      const card = await findCard(cards, scan);
      return card ? { cardId: card.cardId, cardNumber: card.cardNumber, staffId: card.staffId, status: card.status } : null;
    },
  };
}
