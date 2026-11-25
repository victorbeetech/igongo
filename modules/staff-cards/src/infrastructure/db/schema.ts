/**
 * Staff Cards' own Postgres schema, `cards`. No other module reads these
 * tables; they use the CardResolver contract. Change this file, then run
 * `pnpm db:generate` to write the next migration.
 */

import { CARD_STATUSES } from "@igongo/contracts/staff-cards";
import { index, pgSchema, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { CARD_ACTIONS } from "../../domain/card-history-entry";

export const cardsSchema = pgSchema("cards");

export const cardStatus = cardsSchema.enum("card_status", CARD_STATUSES);
export const cardAction = cardsSchema.enum("card_action", CARD_ACTIONS);

/** One row per physical card, kept for ever. */
export const cards = cardsSchema.table(
  "cards",
  {
    cardId: text("card_id").primaryKey(),
    cardNumber: text("card_number").notNull(),
    /** NFC chip UID, upper-case hex. */
    uid: text("uid"),
    /** The random secret in the QR code. */
    qrToken: text("qr_token").notNull(),
    cardType: text("card_type").notNull(),
    templateKey: text("template_key").notNull(),
    /** The holder (an HR Records staff ID), null while in stock. */
    staffId: text("staff_id"),
    status: cardStatus("status").notNull().default("unassigned"),
    issuedAt: timestamp("issued_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("cards_number_key").on(t.cardNumber), uniqueIndex("cards_uid_key").on(t.uid), uniqueIndex("cards_qr_token_key").on(t.qrToken), index("cards_staff_idx").on(t.staffId)],
);

/** Every change to every card: who held it and when (S16-09, S16-15). */
export const cardHistory = cardsSchema.table(
  "card_history",
  {
    id: text("id").primaryKey(),
    cardId: text("card_id")
      .notNull()
      .references(() => cards.cardId),
    action: cardAction("action").notNull(),
    staffId: text("staff_id"),
    actorId: text("actor_id"),
    at: timestamp("at", { withTimezone: true }).notNull(),
  },
  (t) => [index("card_history_card_idx").on(t.cardId, t.at)],
);
