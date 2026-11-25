/**
 * Use case: take a card back into stock so it can be given to someone else.
 * The QR token changes, so the old printed QR code no longer works; the NFC
 * chip stays linked to the card.
 */

import { AppError, type ChangeContext } from "@igongo/core";
import type { Card } from "../../domain/card";
import { newQrToken } from "../../domain/card-codes";
import type { CardRepository } from "../ports/card-repository";
import { recordCardChange } from "../record-card-change";

/** @throws AppError `not_found` */
export async function resetCard(cards: CardRepository, ctx: ChangeContext, cardId: string): Promise<Card> {
  const card = await cards.get(cardId);
  if (!card) throw new AppError("not_found", "Card not found.");
  await cards.update(cardId, { staffId: null, status: "unassigned", issuedAt: null, qrToken: newQrToken() }, ctx.now);
  // The history keeps who held it before the reset.
  await recordCardChange(cards, ctx, { cardId, action: "reset", staffId: card.staffId, summary: `Reset card ${card.cardNumber} back to stock` });
  return (await cards.get(cardId)) as Card;
}
