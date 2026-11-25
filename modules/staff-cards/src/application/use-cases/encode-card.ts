/** Use case: link a card to its NFC chip after the encoder wrote and read it. */

import { AppError, normalizeUid, type ChangeContext } from "@igongo/core";
import type { Card } from "../../domain/card";
import type { CardRepository } from "../ports/card-repository";
import { recordCardChange } from "../record-card-change";

/** @throws AppError `not_found`, or `conflict` when another card has this chip */
export async function encodeCard(cards: CardRepository, ctx: ChangeContext, cardId: string, rawUid: string): Promise<Card> {
  const card = await cards.get(cardId);
  if (!card) throw new AppError("not_found", "Card not found.");
  const uid = normalizeUid(rawUid);
  const other = await cards.byUid(uid);
  if (other && other.cardId !== cardId) throw new AppError("conflict", `This chip already belongs to card ${other.cardNumber}.`);
  await cards.update(cardId, { uid }, ctx.now);
  await recordCardChange(cards, ctx, { cardId, action: "encoded", staffId: card.staffId, summary: `Encoded card ${card.cardNumber} with chip ${uid}` });
  return (await cards.get(cardId)) as Card;
}
