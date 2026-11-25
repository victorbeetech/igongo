/** `CardRepository` on Postgres, with Drizzle. */

import { CARD_STATUSES, type CardStatus } from "@igongo/contracts/staff-cards";
import type { Database } from "@igongo/core";
import { and, asc, count, desc, eq, ilike, sql } from "drizzle-orm";
import type { CardRepository } from "../../application/ports/card-repository";
import type { Card } from "../../domain/card";
import type { CardHistoryEntry } from "../../domain/card-history-entry";
import { cardHistory, cards } from "./schema";

export class DrizzleCardRepository implements CardRepository {
  constructor(private readonly db: Database) {}

  /** The first card matching [where], or null. */
  private async one(where: ReturnType<typeof eq>): Promise<Card | null> {
    const [row] = await this.db.select().from(cards).where(where);
    return row ?? null;
  }

  get(cardId: string) {
    return this.one(eq(cards.cardId, cardId));
  }

  byUid(uid: string) {
    return this.one(eq(cards.uid, uid));
  }

  byQrToken(token: string) {
    return this.one(eq(cards.qrToken, token));
  }

  byCardNumber(cardNumber: string) {
    return this.one(eq(cards.cardNumber, cardNumber));
  }

  list(filter: { status?: CardStatus; staffId?: string; q?: string; limit: number; offset: number }): Promise<Card[]> {
    const where = and(
      filter.status ? eq(cards.status, filter.status) : undefined,
      filter.staffId ? eq(cards.staffId, filter.staffId) : undefined,
      filter.q ? ilike(cards.cardNumber, `%${filter.q}%`) : undefined,
    );
    return this.db.select().from(cards).where(where).orderBy(asc(cards.cardNumber)).limit(filter.limit).offset(filter.offset);
  }

  async countByStatus(): Promise<Record<CardStatus, number>> {
    const rows = await this.db.select({ status: cards.status, n: count() }).from(cards).groupBy(cards.status);
    // Every status appears, even with zero cards.
    const counts = Object.fromEntries(CARD_STATUSES.map((s) => [s, 0])) as Record<CardStatus, number>;
    for (const row of rows) counts[row.status] = Number(row.n);
    return counts;
  }

  async highestCardNumber(): Promise<number> {
    const [row] = await this.db.select({ max: sql<number>`coalesce(max(substring(${cards.cardNumber} from '[0-9]+$')::int), 0)` }).from(cards);
    return Number(row?.max ?? 0);
  }

  async create(card: Omit<Card, "updatedAt">): Promise<void> {
    await this.db.insert(cards).values({ ...card, updatedAt: card.createdAt });
  }

  async update(cardId: string, changes: Partial<Omit<Card, "cardId" | "createdAt">>, now: Date): Promise<void> {
    await this.db.update(cards).set({ ...changes, updatedAt: now }).where(eq(cards.cardId, cardId));
  }

  async addHistory(entry: CardHistoryEntry): Promise<void> {
    await this.db.insert(cardHistory).values(entry);
  }

  history(cardId: string): Promise<CardHistoryEntry[]> {
    return this.db.select().from(cardHistory).where(eq(cardHistory.cardId, cardId)).orderBy(desc(cardHistory.at), desc(cardHistory.id));
  }
}
