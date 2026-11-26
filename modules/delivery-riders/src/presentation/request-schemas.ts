/** Zod schemas for Delivery & Riders request bodies. */

import { DELIVERY_SOURCES } from "@igongo/contracts/delivery-riders";
import { z } from "zod";

const key = z.string().regex(/^[a-z0-9-]{2,40}$/);
const money = z.number().int().min(0).max(100_000_000);

/** `POST /delivery/rider/online`. */
export const onlineBody = z.object({ online: z.boolean() });

/** `POST /delivery/rider/location`. */
export const locationBody = z.object({ lat: z.number().min(-90).max(90), lng: z.number().min(-180).max(180) });

/** `POST /delivery/jobs/:id/assign`. */
export const assignBody = z.object({ riderUserId: z.string().min(3).max(80) });

/** `POST /delivery/jobs/:id/deliver`. */
export const deliverBody = z.object({ code: z.string().regex(/^\d{4}$/).optional(), cashCollected: money.optional() });

/** `POST /delivery/jobs/:id/fail`. */
export const failBody = z.object({ reason: z.string().trim().min(3).max(300) });

/** `PUT /delivery/rules`. */
export const rulesBody = z.object({
  zones: z.array(z.object({ zone: key, name: z.string().trim().min(2).max(60), fee: money, minutes: z.number().int().min(0).max(600) })).max(50),
  assignment: z.enum(["auto", "dispatcher"]),
  proof: z.enum(["code", "none"]),
  ridersCarryCash: z.boolean(),
  cashLimit: money,
  payPerTrip: money,
});

/** `POST /delivery/jobs`: the dispatcher sends anything that is not a food order. */
export const manualJobBody = z.object({
  source: z.enum(DELIVERY_SOURCES).exclude(["food"]),
  what: z.string().trim().min(2).max(200),
  customer: z.object({
    name: z.string().trim().min(1).max(120),
    phone: z.string().trim().regex(/^\+?[0-9 ]{7,20}$/).optional(),
    /** The guest's account, so they can follow it in the app (from the CRM guest list). */
    userId: z.string().min(3).max(80).optional(),
  }),
  place: z.object({ label: z.string().trim().min(2).max(200), zone: key.nullable(), lat: z.number().min(-90).max(90).nullable(), lng: z.number().min(-180).max(180).nullable() }),
  cashToCollect: money.default(0),
});
