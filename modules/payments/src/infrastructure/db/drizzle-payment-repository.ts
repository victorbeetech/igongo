/** `PaymentRepository` on Postgres, with Drizzle. */

import type { Database } from "@igongo/core";
import { and, asc, desc, eq } from "drizzle-orm";
import type { PaymentRepository } from "../../application/ports/payment-repository";
import type { Payment, PaymentStatus } from "../../domain/payment";
import { payments } from "./schema";

export class DrizzlePaymentRepository implements PaymentRepository {
  constructor(private readonly db: Database) {}

  async byId(id: string): Promise<Payment | null> {
    const [row] = await this.db.select().from(payments).where(eq(payments.id, id));
    return row ?? null;
  }

  forRecord(module: string, recordId: string): Promise<Payment[]> {
    return this.db.select().from(payments).where(and(eq(payments.module, module), eq(payments.recordId, recordId))).orderBy(asc(payments.createdAt));
  }

  list(filter: { status?: PaymentStatus; module?: string; payerUserId?: string; limit: number }): Promise<Payment[]> {
    const where = and(
      filter.status ? eq(payments.status, filter.status) : undefined,
      filter.module ? eq(payments.module, filter.module) : undefined,
      filter.payerUserId ? eq(payments.payerUserId, filter.payerUserId) : undefined,
    );
    return this.db.select().from(payments).where(where).orderBy(desc(payments.createdAt)).limit(filter.limit);
  }

  async add(payment: Payment): Promise<void> {
    await this.db.insert(payments).values(payment);
  }

  async settle(id: string, status: "succeeded" | "failed", message: string | null, at: Date): Promise<boolean> {
    // `status = pending` in the WHERE makes this a one-time switch, even with two callbacks at once.
    const done = await this.db.update(payments).set({ status, message, settledAt: at }).where(and(eq(payments.id, id), eq(payments.status, "pending"))).returning({ id: payments.id });
    return done.length > 0;
  }

  async update(payment: Payment): Promise<void> {
    const { id, ...rest } = payment;
    await this.db.update(payments).set(rest).where(eq(payments.id, id));
  }
}
