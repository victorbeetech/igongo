/** Zod schemas for Faults & Maintenance request bodies and queries. */

import { FAULT_PRIORITIES } from "@igongo/contracts/faults-maintenance";
import { z } from "zod";
import { FAULT_STATUSES } from "../domain/fault-status";

const key = z.string().regex(/^[a-z0-9-]{2,60}$/);

/** `POST /faults`. */
export const reportBody = z.object({
  title: z.string().trim().min(3).max(160),
  description: z.string().trim().max(4000).default(""),
  category: key.nullable().default(null),
  location: z.string().trim().max(160).nullable().default(null),
  priority: z.enum(FAULT_PRIORITIES).default("normal"),
  photoIds: z.array(z.string().max(60)).max(10).default([]),
});

/** `GET /faults`. */
export const listQuery = z.object({
  status: z.enum(FAULT_STATUSES).optional(),
  open: z.enum(["1", "0"]).optional(),
  mine: z.enum(["reported", "assigned"]).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  offset: z.coerce.number().int().min(0).default(0),
});

/** `POST /faults/:id/assign`. */
export const assignBody = z.object({ staffId: z.string().max(60), note: z.string().trim().max(1000).nullable().default(null) });

/** `POST /faults/:id/status`. */
export const statusBody = z.object({ status: z.enum(FAULT_STATUSES), note: z.string().trim().max(2000).nullable().default(null) });

/** `POST /faults/:id/comments`. */
export const commentBody = z.object({ body: z.string().trim().min(1).max(2000) });

/** `PUT /faults/settings`. */
export const settingsBody = z.object({
  categories: z.array(z.object({ key, name: z.string().trim().min(1).max(80), department: key.nullable() })).max(100),
  likesEnabled: z.boolean(),
  commentsEnabled: z.boolean(),
  photoRequired: z.boolean(),
});
