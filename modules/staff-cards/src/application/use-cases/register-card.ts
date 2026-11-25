/**
 * Use case: put a new blank card into stock. It gets the next printed
 * number (unless one is given), a fresh QR token and, if the reader already
 * read it, the chip's UID.
 */

import { AppError, newId, normalizeUid, type ChangeContext } from "@igongo/core";
import { DEFAULT_CARD_TEMPLATE, DEFAULT_CARD_TYPE, type Card } from "../../domain/card";
import { newQrToken, nextCardNumber } from "../../domain/card-codes";
import type { CardRepository } from "../ports/card-repository";
import { recordCardChange } from "../record-card-change";

export interface RegisterCardInput {
  cardNumber?: string;
  uid?: string;
  cardType?: string;
  templateKey?: string;
}

/** @throws AppError `conflict` when the number or UID is already registered */
export async function registerCard(cards: CardRepository, ctx: ChangeContext, input: RegisterCardInput): Promise<Card> {
  // 1. Numbers and chips are unique.
  const cardNumber = input.cardNumber ?? nextCardNumber(await cards.highestCardNumber());
  if (await cards.byCardNumber(cardNumber)) throw new AppError("conflict", `Card ${cardNumber} is already registered.`);
  const uid = input.uid ? normalizeUid(input.uid) : null;
  if (uid && (await cards.byUid(uid))) throw new AppError("conflict", "This chip is already registered to another card.");
  // 2. Save it in stock.
  const card: Omit<Card, "updatedAt"> = {
    cardId: newId("card"),
    cardNumber,
    uid,
    qrToken: newQrToken(),
    cardType: input.cardType ?? DEFAULT_CARD_TYPE,
    templateKey: input.templateKey ?? DEFAULT_CARD_TEMPLATE,
    staffId: null,
    status: "unassigned",
    issuedAt: null,
    createdAt: ctx.now,
  };
  await cards.create(card);
  // 3. Record it.
  await recordCardChange(cards, ctx, { cardId: card.cardId, action: "registered", staffId: null, summary: `Registered card ${cardNumber}` });
  return (await cards.get(card.cardId)) as Card;
}
