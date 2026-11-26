/** Zod schemas for Delivery & Riders request bodies. */

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
