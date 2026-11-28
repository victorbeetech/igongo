/**
 * The points store on Postgres. Rules live in the settings table; lots and
 * history in their own tables. `commit` writes lots and history together in
 * one transaction, so a balance and its history can never disagree.
 */

import { ModuleSettings, type Database } from "@igongo/core";
import { and, desc, eq, gt, isNotNull, lte, sql } from "drizzle-orm";
import type { PointsCommit, PointsStore } from "../../application/ports/points-store";
import type { PointsEvent, PointsEventKind } from "../../domain/points-event";
import type { PointsLot } from "../../domain/points-lot";
import { DEFAULT_POINTS_RULES, type PointsRules } from "../../domain/rules";
import { events, lots, settings } from "./schema";

/** The settings key the rules are saved under. */
const RULES_KEY = "rules";

/** Turns a lots row into the domain shape. */
function toLot(r: typeof lots.$inferSelect): PointsLot {
  return { id: r.id, guestId: r.guestId, earned: r.earned, remaining: r.remaining, earnedAt: r.earnedAt, expiresAt: r.expiresAt, sourceRef: r.sourceRef };
}

/** Turns an events row into the domain shape. */
function toEvent(r: typeof events.$inferSelect): PointsEvent {
  return { id: r.id, guestId: r.guestId, kind: r.kind as PointsEventKind, points: r.points, sourceRef: r.sourceRef, note: r.note, createdAt: r.createdAt };
}

export class DrizzlePointsStore implements PointsStore {
  private readonly rules: ModuleSettings;

  constructor(private readonly db: Database) {
    this.rules = new ModuleSettings(this.db, settings);
  }

  /** The saved rules, with any field not saved yet taken from the starting rules. */
  readRules(): Promise<PointsRules> {
    return this.rules.read(RULES_KEY, DEFAULT_POINTS_RULES);
  }

  /** Replaces the whole rules set. */
  writeRules(rules: PointsRules, by: string | null, now: Date): Promise<void> {
    return this.rules.write(RULES_KEY, rules, by, now);
  }

  /** Every lot of one guest. */
  async lotsOf(guestId: string): Promise<PointsLot[]> {
    const rows = await this.db.select().from(lots).where(eq(lots.guestId, guestId));
    return rows.map(toLot);
  }

  /** Lots with points left whose expiry date is in the past. */
  async lotsDueForExpiry(now: Date): Promise<PointsLot[]> {
    const rows = await this.db
      .select()
      .from(lots)
      .where(and(gt(lots.remaining, 0), isNotNull(lots.expiresAt), lte(lots.expiresAt, now)));
    return rows.map(toLot);
  }

  /** True when a history line with this source already exists. */
  async hasSource(sourceRef: string): Promise<boolean> {
    const [row] = await this.db.select({ id: events.id }).from(events).where(eq(events.sourceRef, sourceRef)).limit(1);
    return row !== undefined;
  }

  /** The history line with this source, or null. */
  async eventBySource(sourceRef: string): Promise<PointsEvent | null> {
    const [row] = await this.db.select().from(events).where(eq(events.sourceRef, sourceRef)).limit(1);
    return row ? toEvent(row) : null;
  }

  /** The guest's newest history lines first. */
  async eventsOf(guestId: string, limit: number): Promise<PointsEvent[]> {
    const rows = await this.db.select().from(events).where(eq(events.guestId, guestId)).orderBy(desc(events.createdAt)).limit(limit);
    return rows.map(toEvent);
  }

  /** Saves lots (insert, or update the remaining points) and history in one transaction. */
  async commit(change: PointsCommit): Promise<void> {
    await this.db.transaction(async (tx) => {
      for (const lot of change.lots) {
        // A new lot is inserted; an existing lot only has its remaining points changed.
        await tx
          .insert(lots)
          .values({ id: lot.id, guestId: lot.guestId, earned: lot.earned, remaining: lot.remaining, earnedAt: lot.earnedAt, expiresAt: lot.expiresAt, sourceRef: lot.sourceRef })
          .onConflictDoUpdate({ target: lots.id, set: { remaining: sql`excluded.remaining` } });
      }
      for (const e of change.events) {
        await tx.insert(events).values({ id: e.id, guestId: e.guestId, kind: e.kind, points: e.points, sourceRef: e.sourceRef, note: e.note, createdAt: e.createdAt });
      }
    });
  }
}
