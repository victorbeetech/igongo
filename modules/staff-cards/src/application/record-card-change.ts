/** Writes a card change to the card's history and to the Audit Trail. */

import { newId, recordChange, type ChangeContext } from "@igongo/core";
import type { CardAction } from "../domain/card-history-entry";
import type { CardRepository } from "./ports/card-repository";

/** Records [action] on [cardId] (holder [staffId]) with [summary]. */
export async function recordCardChange(cards: CardRepository, ctx: ChangeContext, entry: { cardId: string; action: CardAction; staffId: string | null; summary: string }): Promise<void> {
  await cards.addHistory({ id: newId("cdh"), cardId: entry.cardId, action: entry.action, staffId: entry.staffId, actorId: ctx.actorId, at: ctx.now });
  await recordChange(ctx, { module: "staff-cards", action: `card.${entry.action}`, recordType: "card", recordId: entry.cardId, summary: entry.summary });
}
