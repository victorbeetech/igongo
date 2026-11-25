/** Zod schemas for HR Records request bodies and queries. */

import { STAFF_STATUSES } from "@igongo/contracts/hr-records";
import { z } from "zod";

/** Fields HR fills in. Empty text means "not known". */
const draft = z.object({
  name: z.string().trim().min(2).max(120),
  department: z.string().trim().max(60).nullable(),
  jobTitle: z.string().trim().max(120).nullable(),
  photoUrl: z.url().max(500).nullable(),
  phone: z.string().trim().max(30).nullable(),
  email: z.email().max(200).nullable(),
  hireDate: z.iso.date().nullable(),
  emergencyContact: z.string().trim().max(300).nullable(),
  status: z.enum(STAFF_STATUSES),
  userId: z.string().max(80).nullable(),
});

/** `POST /hr/staff`. */
export const enrolBody = draft.partial().extend({ name: draft.shape.name });

/** `PATCH /hr/staff/:id`. */
export const updateBody = draft.partial();

/** `GET /hr/staff`. */
export const searchQuery = z.object({
  q: z.string().trim().max(100).optional(),
  department: z.string().max(60).optional(),
  status: z.enum(STAFF_STATUSES).optional(),
  limit: z.coerce.number().int().min(1).max(200).default(50),
  offset: z.coerce.number().int().min(0).default(0),
});
