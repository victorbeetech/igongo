/** `BandRepository` on Postgres, with Drizzle. Range actions are single statements. */

import type { Database } from "@igongo/core";
import { and, asc, between, count, desc, eq, inArray, isNotNull } from "drizzle-orm";
import type { BandRepository, BandSummary } from "../../application/ports/band-repository";
import type { BandRange } from "../../domain/band-range";
import type { BandScan } from "../../domain/band-scan";
import { BAND_STATUSES, type BandStatus, type Wristband } from "../../domain/wristband";
import { bandScans, wristbands } from "./schema";

/** Rows per insert, to stay well under Postgres' parameter limit. */
const CHUNK = 1000;

export class DrizzleBandRepository implements BandRepository {
  constructor(private readonly db: Database) {}

  async get(bandNumber: number): Promise<Wristband | null> {
    const [row] = await this.db.select().from(wristbands).where(eq(wristbands.bandNumber, bandNumber));
    return row ?? null;
  }

  async byUid(uid: string): Promise<Wristband | null> {
    const [row] = await this.db.select().from(wristbands).where(eq(wristbands.uid, uid));
    return row ?? null;
  }

  list(filter: { status?: BandStatus; eventKey?: string; range?: BandRange; limit: number; offset: number }): Promise<Wristband[]> {
    const where = and(
      filter.status ? eq(wristbands.status, filter.status) : undefined,
      filter.eventKey ? eq(wristbands.eventKey, filter.eventKey) : undefined,
      filter.range ? between(wristbands.bandNumber, filter.range.from, filter.range.to) : undefined,
    );
    return this.db.select().from(wristbands).where(where).orderBy(asc(wristbands.bandNumber)).limit(filter.limit).offset(filter.offset);
  }

  async summary(): Promise<BandSummary> {
    const statuses = await this.db.select({ status: wristbands.status, n: count() }).from(wristbands).groupBy(wristbands.status);
    const byStatus = Object.fromEntries(BAND_STATUSES.map((s) => [s, 0])) as Record<BandStatus, number>;
    for (const row of statuses) byStatus[row.status] = Number(row.n);
    const events = await this.db
      .select({ eventKey: wristbands.eventKey, eventName: wristbands.eventName, n: count() })
      .from(wristbands)
      .where(isNotNull(wristbands.eventKey))
      .groupBy(wristbands.eventKey, wristbands.eventName);
    return { byStatus, events: events.map((e) => ({ eventKey: e.eventKey as string, eventName: e.eventName, count: Number(e.n) })) };
  }

  async existingIn(range: BandRange): Promise<number[]> {
    const rows = await this.db.select({ n: wristbands.bandNumber }).from(wristbands).where(between(wristbands.bandNumber, range.from, range.to));
    return rows.map((r) => r.n);
  }

  async createMany(bands: Wristband[]): Promise<void> {
    for (let i = 0; i < bands.length; i += CHUNK) await this.db.insert(wristbands).values(bands.slice(i, i + CHUNK));
  }

  async assignRange(range: BandRange, event: { eventKey: string; eventName: string }, now: Date): Promise<number> {
    const rows = await this.db
      .update(wristbands)
      .set({ status: "assigned", eventKey: event.eventKey, eventName: event.eventName, assignedAt: now })
      .where(and(between(wristbands.bandNumber, range.from, range.to), eq(wristbands.status, "in_stock")))
      .returning({ n: wristbands.bandNumber });
    return rows.length;
  }

  async resetRange(range: BandRange): Promise<number> {
    const rows = await this.db
      .update(wristbands)
      .set({ status: "in_stock", eventKey: null, eventName: null, assignedAt: null })
      .where(and(between(wristbands.bandNumber, range.from, range.to), inArray(wristbands.status, ["assigned", "missing"])))
      .returning({ n: wristbands.bandNumber });
    return rows.length;
  }

  async update(bandNumber: number, changes: Partial<Pick<Wristband, "uid" | "status" | "eventKey" | "eventName" | "assignedAt">>): Promise<void> {
    await this.db.update(wristbands).set(changes).where(eq(wristbands.bandNumber, bandNumber));
  }

  async addScan(scan: BandScan): Promise<void> {
    await this.db.insert(bandScans).values(scan);
  }

  scans(filter: { eventKey?: string; bandNumber?: number; limit: number }): Promise<BandScan[]> {
    const where = and(filter.eventKey ? eq(bandScans.eventKey, filter.eventKey) : undefined, filter.bandNumber ? eq(bandScans.bandNumber, filter.bandNumber) : undefined);
    return this.db.select().from(bandScans).where(where).orderBy(desc(bandScans.at)).limit(filter.limit);
  }
}
