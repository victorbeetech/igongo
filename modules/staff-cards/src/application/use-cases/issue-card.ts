/**
 * Use case: give a card in stock to a staff member. A person holds one
 * active card at a time, so any other active card of theirs is reset first.
 */

import type { StaffDirectory } from "@igongo/contracts/hr-records";
import { AppError, type ChangeContext } from "@igongo/core";
import type { Card } from "../../domain/card";
import type { CardRepository } from "../ports/card-repository";
import { recordCardChange } from "../record-card-change";
import { resetCard } from "./reset-card";

/** @throws AppError `not_found` for an unknown card or person, `conflict` when the card is not in stock */
export async function issueCard(deps: { cards: CardRepository; staff: StaffDirectory }, ctx: ChangeContext, cardId: string, input: { staffId: string; templateKey?: string }): Promise<Card> {
  // 1. The card must be in stock, and the person an active staff member.
  const card = await deps.cards.get(cardId);
  if (!card) throw new AppError("not_found", "Card not found.");
  if (card.status !== "unassigned") throw new AppError("conflict", `Card ${card.cardNumber} is not in stock. Reset it first.`);
  const holder = await deps.staff.byId(input.staffId);
  if (!holder || holder.status !== "active") throw new AppError("not_found", "Active staff member not found.");
  // 2. One active card per person: reset the old one.
  for (const old of await deps.cards.list({ staffId: holder.staffId, status: "active", limit: 10, offset: 0 })) await resetCard(deps.cards, ctx, old.cardId);
  // 3. Hand it over.
  await deps.cards.update(cardId, { staffId: holder.staffId, status: "active", issuedAt: ctx.now, ...(input.templateKey ? { templateKey: input.templateKey } : {}) }, ctx.now);
  await recordCardChange(deps.cards, ctx, { cardId, action: "issued", staffId: holder.staffId, summary: `Issued card ${card.cardNumber} to ${holder.name} (${holder.staffNumber})` });
  return (await deps.cards.get(cardId)) as Card;
}
