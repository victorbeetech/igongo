/** Where payments are kept. */

import type { Payment, PaymentStatus } from "../../domain/payment";
import type { SettlementRow } from "../../domain/settlement-row";

export interface PaymentRepository {
  byId(id: string): Promise<Payment | null>;
  /** Payments of one record, oldest first. */
  forRecord(module: string, recordId: string): Promise<Payment[]>;
  /** Newest first. `before` keeps only payments made earlier than that time (the next page). */
  list(filter: { status?: PaymentStatus; module?: string; payerUserId?: string; before?: Date; limit: number }): Promise<Payment[]>;
  add(payment: Payment): Promise<void>;
  /**
   * Moves a payment out of `pending` once, and only once.
   * @returns false when it was no longer pending (someone else settled it)
   */
  settle(id: string, status: "succeeded" | "failed", message: string | null, at: Date): Promise<boolean>;
  update(payment: Payment): Promise<void>;
  /** Paid money settled in [from, to), grouped by hotel day, method, module and outlet. */
  settlement(from: Date, to: Date): Promise<SettlementRow[]>;
}
