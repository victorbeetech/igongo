/** Zod schemas for Inspections request bodies and queries. */

import { z } from "zod";
import { RESULTS } from "../domain/check-result";
import { FREQUENCIES } from "../domain/checklist";

const key = z.string().regex(/^[a-z0-9-]{2,60}$/);
const day = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

/** `POST /inspections/checklists` and `PUT /inspections/checklists/:id`. */
export const checklistBody = z.object({
  name: z.string().trim().min(2).max(120),
  department: key,
  frequency: z.enum(FREQUENCIES).default("daily"),
  dueBy: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/).default("10:00"),
  items: z
    .array(z.object({ key, label: z.string().trim().min(2).max(160), photoOnFail: z.boolean().default(false), raiseFault: z.boolean().default(true) }))
    .min(1)
    .max(100),
  active: z.boolean().default(true),
});

/** `POST /inspections/runs`. */
export const runBody = z.object({
  checklistId: z.string().max(60),
  answers: z.array(z.object({ key, result: z.enum(RESULTS), note: z.string().trim().max(1000).nullable().default(null), photoIds: z.array(z.string().max(60)).max(5).default([]) })).max(100),
  note: z.string().trim().max(2000).nullable().default(null),
});

/** `GET /inspections/runs`. */
export const runsQuery = z.object({ from: day.optional(), to: day.optional(), checklistId: z.string().max(60).optional(), limit: z.coerce.number().int().min(1).max(200).default(50) });

/** `POST /inspections/runs/:id/comments`. */
export const commentBody = z.object({ body: z.string().trim().min(1).max(2000) });

/** `PUT /inspections/settings`. */
export const settingsBody = z.object({ likesEnabled: z.boolean(), commentsEnabled: z.boolean() });
