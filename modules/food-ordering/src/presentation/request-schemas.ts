/** Zod schemas for Food Ordering request bodies and queries. */

import { ORDER_STATUSES, ORDER_TYPES } from "@igongo/contracts/food-ordering";
import { recordOf } from "@igongo/core";
import { z } from "zod";

const key = z.string().regex(/^[a-z0-9-]{2,40}$/);
const text = (max: number) => z.string().trim().min(1).max(max);

const place = z.object({ label: text(200), zone: key.nullable(), lat: z.number().min(-90).max(90).nullable(), lng: z.number().min(-180).max(180).nullable() });

/** The cart, for `POST /orders/quote` and `POST /orders`. */
export const cartBody = z.object({
  outlet: key,
  type: z.enum(ORDER_TYPES),
  lines: z.array(z.object({
    itemId: z.string().max(80),
    quantity: z.number().int().min(1).max(100),
    options: z.array(z.string().max(90)).max(20).default([]),
    notes: text(300).optional(),
    /** The day the guest wants this line, as the hotel's date (YYYY-MM-DD). */
    date: z.iso.date().optional(),
  })).min(1).max(50),
  /** Arrival for a pre-order, or the wanted time of a scheduled order. */
  arriveAt: z.iso.datetime({ offset: true }).optional(),
  deliverTo: place.optional(),
  /** A promo or voucher code, any case. */
  promoCode: z.string().trim().min(2).max(40).regex(/^[A-Za-z0-9-]+$/).optional(),
});

/** `POST /orders`: the cart plus the order's details; staff also name the customer. */
export const placeBody = cartBody.extend({
  notes: text(500).optional(),
  allergies: text(300).optional(),
  table: text(40).optional(),
  customer: z.object({ name: text(120), phone: z.string().trim().regex(/^\+?[0-9 ]{7,20}$/).optional() }).optional(),
  /** One random key per checkout, sent again on a retry, so a double tap never orders twice. */
  requestKey: z.string().regex(/^[A-Za-z0-9-]{8,64}$/).optional(),
});

/** `POST /orders/:id/rating`. */
export const ratingBody = z.object({ food: z.number().int().min(1).max(5), delivery: z.number().int().min(1).max(5).optional(), comment: text(500).optional() });

/** `GET /orders/reviews`. */
export const reviewsQuery = z.object({ outlet: key.optional(), all: z.enum(["1"]).optional() });

/** `POST /orders/reviews/:orderId/hide`. */
export const hideBody = z.object({ hidden: z.boolean() });

/** `GET /orders/board`. */
export const boardQuery = z.object({ outlet: key.optional(), status: z.enum(ORDER_STATUSES).optional() });

/** `POST /orders/:id/status`. */
export const statusBody = z.object({ status: z.enum(["preparing", "ready", "delivered"]) });

/** `POST /orders/:id/cancel`. */
export const cancelBody = z.object({ reason: text(300) });

const typeRule = z.object({ enabled: z.boolean(), outlets: z.array(key).max(30), payment: z.enum(["before", "deposit", "later"]) });

/** `PUT /orders/rules`. */
export const rulesBody = z.object({
  types: z.object(recordOf(ORDER_TYPES, () => typeRule)),
  preorderMinNoticeMinutes: z.number().int().min(0).max(7 * 24 * 60),
  depositPercent: z.number().int().min(0).max(100),
  cancelWindowMinutes: z.number().int().min(0).max(24 * 60),
  minutesPerQueuedOrder: z.number().int().min(0).max(60),
  scheduleAheadDays: z.number().int().min(0).max(60).default(7),
});
