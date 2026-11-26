/** Zod schemas for Chat request bodies and queries. */

import { z } from "zod";

/** `POST /chat/conversations`. */
export const startBody = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("direct"), userId: z.string().max(80) }),
  z.object({ kind: z.literal("group"), title: z.string().trim().min(2).max(80), userIds: z.array(z.string().max(80)).min(1).max(500) }),
]);

/** `POST /chat/conversations/:id/messages`. */
export const messageBody = z.object({ body: z.string().max(4000).default(""), fileIds: z.array(z.string().max(60)).max(5).default([]) });

/** `GET /chat/conversations/:id/messages`. */
export const messagesQuery = z.object({ after: z.coerce.date().optional(), limit: z.coerce.number().int().min(1).max(200).default(50) });

/** `GET /chat/people`. */
export const peopleQuery = z.object({ q: z.string().trim().max(80).default("") });

const key = z.string().regex(/^[a-z0-9-]{2,60}$/);

/** `PUT /chat/settings`. */
export const settingsBody = z.object({
  staffChat: z.boolean(),
  groups: z.boolean(),
  guestChat: z.boolean(),
  desks: z.array(z.object({ key, name: z.string().trim().min(2).max(60), roles: z.array(key).max(30) })).max(20),
  attachments: z.boolean(),
  maxGroupSize: z.number().int().min(2).max(500),
});
