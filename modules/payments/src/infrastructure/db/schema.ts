/**
 * Payments' own Postgres schema, `payments`. No other module reads these
 * tables. Change this file, then run `pnpm db:generate`.
 */

import { moduleSettingsTable } from "@igongo/core";
import { index, integer, pgSchema, text, timestamp } from "drizzle-orm/pg-core";

export const paymentsSchema = pgSchema("payments");

/** Every payment, kept for ever (the books and the daily settlement). */
export const payments = paymentsSchema.table(
  "payments",
  {
    id: text("id").primaryKey(),
    module: text("module").notNull(),
    recordId: text("record_id").notNull(),
    label: text("label").notNull(),
    outlet: text("outlet"),
    method: text("method", { enum: ["mtn_momo", "airtel_money", "card", "bank_transfer", "cash", "room_charge", "corporate_account"] }).notNull(),
    amount: integer("amount").notNull(),
    status: text("status", { enum: ["pending", "succeeded", "failed", "refunded"] }).notNull(),
    payerUserId: text("payer_user_id"),
    payerPhone: text("payer_phone"),
    providerRef: text("provider_ref"),
    redirectUrl: text("redirect_url"),
    message: text("message"),
    recordedBy: text("recorded_by"),
    refundedAmount: integer("refunded_amount").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
    settledAt: timestamp("settled_at", { withTimezone: true }),
  },
  (t) => [index("payments_record_idx").on(t.module, t.recordId), index("payments_payer_idx").on(t.payerUserId, t.createdAt), index("payments_status_idx").on(t.status, t.createdAt)],
);

/** The method switches (key `methods`). */
export const settings = moduleSettingsTable(paymentsSchema);
