/** Zod schemas for Notice Board request bodies and queries. */

import { z } from "zod";

const draft = z.object({
  title: z.string().trim().min(2).max(160),
  body: z.string().trim().min(1).max(10000),
  audienceRoles: z.array(z.string().regex(/^[a-z0-9-]{2,60}$/)).max(50).default([]),
  pinned: z.boolean().default(false),
  allowComments: z.boolean().default(true),
  allowLikes: z.boolean().default(true),
});

/** `POST /notices`. */
export const publishBody = draft;

/** `PATCH /notices/:id`. */
export const editBody = z.object({
  title: z.string().trim().min(2).max(160).optional(),
  body: z.string().trim().min(1).max(10000).optional(),
  audienceRoles: z.array(z.string().regex(/^[a-z0-9-]{2,60}$/)).max(50).optional(),
  pinned: z.boolean().optional(),
  allowComments: z.boolean().optional(),
  allowLikes: z.boolean().optional(),
});

/** `POST /notices/:id/comments`. */
export const commentBody = z.object({ body: z.string().trim().min(1).max(2000) });

/** `GET /notices`. */
export const listQuery = z.object({ limit: z.coerce.number().int().min(1).max(100).default(30), offset: z.coerce.number().int().min(0).default(0) });

/** `PUT /notices/settings`. */
export const settingsBody = z.object({ commentsEnabled: z.boolean(), likesEnabled: z.boolean(), readReceipts: z.boolean() });
