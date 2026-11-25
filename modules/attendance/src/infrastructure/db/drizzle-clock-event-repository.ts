/** `ClockEventRepository` on Postgres, with Drizzle. */

import type { Database } from "@igongo/core";
import { and, asc, between, desc, eq } from "drizzle-orm";
import type { ClockEventFilter, ClockEventRepository } from "../../application/ports/clock-event-repository";
import type { ClockEvent } from "../../domain/clock-event";
import { clockEvents } from "./schema";

export class DrizzleClockEventRepository implements ClockEventRepository {
  constructor(private readonly db: Database) {}

  async add(event: ClockEvent): Promise<void> {
    await this.db.insert(clockEvents).values(event);
  }

  async latestFor(staffId: string): Promise<ClockEvent | null> {
    const [row] = await this.db.select().from(clockEvents).where(eq(clockEvents.staffId, staffId)).orderBy(desc(clockEvents.at)).limit(1);
    return row ?? null;
  }

  async hasInOn(staffId: string, workDate: string): Promise<boolean> {
    const rows = await this.db
      .select({ id: clockEvents.id })
      .from(clockEvents)
      .where(and(eq(clockEvents.staffId, staffId), eq(clockEvents.workDate, workDate), eq(clockEvents.kind, "in")))
      .limit(1);
    return rows.length > 0;
  }

  list(filter: ClockEventFilter): Promise<ClockEvent[]> {
    const where = and(
      between(clockEvents.workDate, filter.from, filter.to),
      filter.staffId ? eq(clockEvents.staffId, filter.staffId) : undefined,
      filter.department ? eq(clockEvents.department, filter.department) : undefined,
    );
    return this.db.select().from(clockEvents).where(where).orderBy(asc(clockEvents.at));
  }
}
