/** Use case: mark a card lost. It stops working at once at every station. */

import { AppError, type ChangeContext } from "@igongo/core";
import type { Card } from "../../domain/card";
import type { CardRepository } from "../ports/card-repository";
import { recordCardChange } from "../record-card-change";

/** @throws AppError `not_found` */
export async function reportCardLost(cards: CardRepository, ctx: ChangeContext, cardId: string): Promise<Card> {
  const card = await cards.get(cardId);
  if (!card) throw new AppError("not_found", "Card not found.");
  await cards.update(cardId, { status: "lost" }, ctx.now);
  await recordCardChange(cards, ctx, { cardId, action: "lost", staffId: card.staffId, summary: `Card ${card.cardNumber} reported lost` });
  return (await cards.get(cardId)) as Card;
}
