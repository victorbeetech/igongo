/** Zod schemas for every booking module's request bodies and queries. */

import { z } from "zod";
import { BOOKING_STATUSES } from "../domain/booking";
import { OFFERING_KINDS } from "../domain/offering";

const time = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/);
const money = z.number().int().min(0).max(1_000_000_000);

/** `POST /offerings` (all fields) and `PATCH /offerings/:id` (any of them). */
export const offeringBody = z.object({
  kind: z.enum(OFFERING_KINDS),
  name: z.string().trim().min(2).max(120),
  description: z.string().trim().max(2000).nullable().default(null),
  price: money,
  capacity: z.number().int().min(0).max(100_000),
  slots: z.array(time).max(48).default([]),
  onDate: z.iso.date().nullable().default(null),
  photoUrl: z.url().nullable().default(null),
  details: z.record(z.string().max(40), z.string().max(300)).default({}),
  active: z.boolean().default(true),
  visibleToClients: z.boolean().default(true),
  sortOrder: z.number().int().min(0).max(10_000).default(0),
});
export const offeringPatch = offeringBody.partial();

/** The wanted dates or slot, for availability and booking. */
const wanted = { date: z.iso.date().optional(), endDate: z.iso.date().optional(), slot: time.optional() };
export const availabilityQuery = z.object(wanted);

/** `POST /bookings`: staff booking for a walk-in also name the guest. */
export const bookBody = z.object({
  offeringId: z.string().max(80),
  units: z.number().int().min(1).max(1000),
  notes: z.string().trim().max(1000).optional(),
  guest: z.object({ name: z.string().trim().min(2).max(120), phone: z.string().trim().regex(/^\+?[0-9 ]{7,20}$/).optional() }).optional(),
  ...wanted,
});

/** `GET /bookings`. */
export const listQuery = z.object({ date: z.iso.date().optional(), status: z.enum(BOOKING_STATUSES).optional() });

/** `POST /bookings/:id/cancel`. */
export const cancelBody = z.object({ reason: z.string().trim().min(2).max(300) });

/** `POST /bookings/:id/approve`. */
export const approveBody = z.object({ total: money.optional() });

/** `POST /check-in`: the code typed, or the QR text `IGG-BK:<code>`. */
export const checkInBody = z.object({ code: z.string().trim().min(4).max(120) });

/** `POST /tickets/verify` and `POST /tickets/check-in`: the ticket text, as scanned or typed. */
export const ticketBody = z.object({ ticket: z.string().trim().min(4).max(200) });

/** `PUT /rules`. */
export const rulesBody = z.object({ depositPercent: z.number().int().min(0).max(100), requireApproval: z.boolean(), cancelHoursBefore: z.number().int().min(0).max(24 * 60), maxUnits: z.number().int().min(1).max(1000) });

/** Staff assign a room or cottage number (or clear it with null). */
export const unitBody = z.object({ unit: z.string().trim().max(20).nullable() });
