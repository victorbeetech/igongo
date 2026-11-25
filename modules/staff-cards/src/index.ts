/**
 * Staff Cards (module 16) of the Igongo API. The gateway imports only this
 * file. See modules/staff-cards/README.md.
 */

export type { CardRepository } from "./application/ports/card-repository";
export { cardResolver, findCard } from "./application/use-cases/resolve-card";
export type { Card } from "./domain/card";
export { cardQrText } from "./domain/card-codes";
export { DrizzleCardRepository } from "./infrastructure/db/drizzle-card-repository";
export { CARD_PERMISSIONS } from "./presentation/permissions";
export { cardsRouter, type CardsDeps } from "./presentation/cards-router";
