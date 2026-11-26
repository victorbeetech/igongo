/** `OfferingRepository` on one module's tables, with Drizzle. */

import { omitKey, type Database } from "@igongo/core";
import { and, asc, eq, gte, sql } from "drizzle-orm";
import type { OfferingRepository } from "../../application/ports/offering-repository";
import type { Offering } from "../../domain/offering";
import type { BookingTables } from "./booking-tables";

export class DrizzleOfferingRepository implements OfferingRepository {
  constructor(
    private readonly db: Database,
    private readonly t: BookingTables,
  ) {}

  async byId(id: string): Promise<Offering | null> {
    const [row] = await this.db.select().from(this.t.offerings).where(eq(this.t.offerings.id, id));
    return row ?? null;
  }

  list(): Promise<Offering[]> {
    return this.db.select().from(this.t.offerings).orderBy(asc(this.t.offerings.sortOrder), asc(this.t.offerings.name));
  }

  async save(offering: Offering): Promise<void> {
    await this.db.insert(this.t.offerings).values(offering).onConflictDoUpdate({ target: this.t.offerings.id, set: omitKey(offering, "id") });
  }

  async moveStock(id: string, delta: number): Promise<boolean> {
    const o = this.t.offerings;
    // One statement, so two buyers can never both take the last item.
    const done = await this.db
      .update(o)
      .set({ capacity: sql`${o.capacity} + ${delta}` })
      .where(and(eq(o.id, id), gte(o.capacity, -delta)))
      .returning({ id: o.id });
    return done.length > 0;
  }
}
