/** Zod schemas for every records module's request bodies and queries. */

import { z } from "zod";
import { FIELD_KINDS } from "../domain/field-def";

const key = z.string().trim().regex(/^[a-z][a-z0-9_]{0,39}$/, "Use small letters, digits and _ only.");
const label = z.string().trim().min(1).max(120);
const value = z.union([z.string().max(5000), z.number(), z.boolean(), z.null()]);
const day = z.iso.date().nullable();

/** `POST /records`. */
export const createBody = z.object({
  type: key,
  title: z.string().trim().max(200).optional(),
  fields: z.record(z.string().max(40), value).default({}),
  assigneeId: z.string().max(80).nullable().optional(),
  dueOn: day.optional(),
  location: z.string().trim().max(200).nullable().optional(),
  ownerName: z.string().trim().max(120).optional(),
});

/** `PATCH /records/:id`. */
export const editBody = z.object({
  title: z.string().trim().max(200).optional(),
  fields: z.record(z.string().max(40), value).optional(),
  dueOn: day.optional(),
  location: z.string().trim().max(200).nullable().optional(),
});

/** `POST /records/:id/status`. */
export const moveBody = z.object({ status: key, note: z.string().trim().max(1000).optional() });

/** `POST /records/:id/assign`. */
export const assignBody = z.object({ staffId: z.string().max(80).nullable() });

/** `POST /records/:id/comments`. */
export const commentBody = z.object({ text: z.string().trim().min(1).max(2000) });

/** `GET /records`. */
export const listQuery = z.object({
  type: key.optional(),
  status: key.optional(),
  open: z.enum(["1", "0"]).optional(),
  mine: z.literal("1").optional(),
  assigned: z.literal("1").optional(),
  q: z.string().trim().max(80).optional(),
  from: z.iso.date().optional(),
  to: z.iso.date().optional(),
});

/** `PUT /config`: the whole set-up. */
export const configBody = z.object({
  comments: z.boolean(),
  notice: z.string().trim().max(1000).default(""),
  types: z
    .array(
      z.object({
        key,
        name: label,
        active: z.boolean(),
        selfService: z.boolean().optional(),
        fields: z.array(z.object({ key, label, kind: z.enum(FIELD_KINDS), required: z.boolean().optional(), options: z.array(z.string().trim().min(1).max(80)).max(60).optional(), inList: z.boolean().optional() })).max(60),
        statuses: z.array(z.object({ key, label, done: z.boolean().optional(), approval: z.boolean().optional() })).min(1).max(20),
      }),
    )
    .min(1)
    .max(20),
});
