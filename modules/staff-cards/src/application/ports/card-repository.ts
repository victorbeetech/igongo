/** Where cards and their history are kept. The Drizzle version is in infrastructure/db. */

import type { CardStatus } from "@igongo/contracts/staff-cards";
import type { Card } from "../../domain/card";
import type { CardHistoryEntry } from "../../domain/card-history-entry";

export interface CardRepository {
  get(cardId: string): Promise<Card | null>;
  byUid(uid: string): Promise<Card | null>;
  byQrToken(token: string): Promise<Card | null>;
  byCardNumber(cardNumber: string): Promise<Card | null>;
  list(filter: { status?: CardStatus; staffId?: string; q?: string; limit: number; offset: number }): Promise<Card[]>;
  /** Count per status, for the cards home. */
  countByStatus(): Promise<Record<CardStatus, number>>;
  /** The highest running card number so far (0 when none). */
  highestCardNumber(): Promise<number>;
  create(card: Omit<Card, "updatedAt">): Promise<void>;
  update(cardId: string, changes: Partial<Omit<Card, "cardId" | "createdAt">>, now: Date): Promise<void>;
  addHistory(entry: CardHistoryEntry): Promise<void>;
  history(cardId: string): Promise<CardHistoryEntry[]>;
}
