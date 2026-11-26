/** `BookingRepository` on one module's tables, with Drizzle. */

import type { Database } from "@igongo/core";
import { and, desc, eq, gt, lt, ne, sql } from "drizzle-orm";
import type { BookingRepository } from "../../application/ports/booking-repository";
import type { Booking, BookingStatus } from "../../domain/booking";
import type { BookingTables } from "./booking-tables";

export class DrizzleBookingRepository implements BookingRepository {
  constructor(
    private readonly db: Database,
    private readonly t: BookingTables,
  ) {}

  async byId(id: string): Promise<Booking | null> {
    const [row] = await this.db.select().from(this.t.bookings).where(eq(this.t.bookings.id, id));
    return row ?? null;
  }

  async byCode(code: string): Promise<Booking | null> {
    const [row] = await this.db.select().from(this.t.bookings).where(eq(this.t.bookings.code, code.toUpperCase()));
    return row ?? null;
  }

  list(filter: { userId?: string; date?: string; status?: BookingStatus; limit: number }): Promise<Booking[]> {
    const b = this.t.bookings;
    const where = and(filter.userId ? eq(b.userId, filter.userId) : undefined, filter.date ? eq(b.date, filter.date) : undefined, filter.status ? eq(b.status, filter.status) : undefined);
    return this.db.select().from(b).where(where).orderBy(desc(b.createdAt)).limit(filter.limit);
  }

  async unitsTaken(q: { offeringId: string; date: string; endDate: string | null; slot: string | null }): Promise<number> {
    const b = this.t.bookings;
    // Stays clash when they overlap (check-in before the other's check-out, and the other way);
    // tickets and passes clash on the same day and slot.
    const clash = q.endDate
      ? and(lt(b.date, q.endDate), gt(b.endDate, q.date))
      : and(eq(b.date, q.date), q.slot ? eq(b.slot, q.slot) : undefined);
    const [row] = await this.db
      .select({ n: sql<number>`coalesce(sum(${b.units}), 0)` })
      .from(b)
      .where(and(eq(b.offeringId, q.offeringId), ne(b.status, "cancelled"), clash));
    return Number(row?.n ?? 0);
  }

  async add(booking: Booking): Promise<void> {
    await this.db.insert(this.t.bookings).values(booking);
  }

  async update(booking: Booking): Promise<void> {
    const { id, ...rest } = booking;
    await this.db.update(this.t.bookings).set(rest).where(eq(this.t.bookings.id, id));
  }
}
