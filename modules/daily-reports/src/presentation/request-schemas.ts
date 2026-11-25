/** Zod schemas for Daily Reports request bodies and queries. */

import { z } from "zod";
import { REPORT_STATUSES } from "../domain/daily-report";

const date = z.iso.date();
const section = z.object({ title: z.string().trim().min(1).max(120), text: z.string().max(5000) });

/** `PUT /daily-reports/mine/:date`. */
export const saveBody = z.object({ sections: z.array(section).min(1).max(20), photoUrls: z.array(z.url().max(500)).max(10).optional(), submit: z.boolean().default(false) });

/** `POST /daily-reports/:id/review`. */
export const reviewBody = z.object({ decision: z.enum(["signed", "returned"]), note: z.string().trim().max(1000).optional() });

/** `POST /daily-reports/:id/comments`. */
export const commentBody = z.object({ body: z.string().trim().min(1).max(2000) });

/** `GET /daily-reports`. */
export const listQuery = z.object({ from: date, to: date, status: z.enum(REPORT_STATUSES).optional(), limit: z.coerce.number().int().min(1).max(500).default(200) });

/** `GET /daily-reports/missing`. */
export const dayQuery = z.object({ date: date.optional() });

/** `PUT /daily-reports/template`. */
export const templateBody = z.object({ sections: z.array(z.string().trim().min(1).max(120)).min(1).max(20), dueBy: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/) });
