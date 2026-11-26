/** Zod schemas for CRM request bodies and queries. */

import { z } from "zod";

const shortText = z.string().trim().max(200);
const tag = z.string().regex(/^[a-z0-9-]{2,40}$/);

/** `PATCH /crm/me`: any of my details; null clears one. */
export const myDetailsBody = z
  .object({
    name: z.string().trim().min(2).max(120),
    phone: z.string().trim().regex(/^\+?[0-9 ]{7,20}$/).nullable(),
    nationality: shortText.nullable(),
    birthday: z.iso.date().nullable(),
    preferences: z.string().trim().max(1000).nullable(),
    allergies: z.string().trim().max(500).nullable(),
  })
  .partial();

/** `PUT /crm/me/consent`. */
export const consentBody = z.object({ sms: z.boolean(), whatsapp: z.boolean(), email: z.boolean() });

/** `GET /crm/guests`. */
export const searchQuery = z.object({ q: z.string().trim().max(80).optional(), tag: tag.optional() });

/** `POST /crm/guests`: a walk-in guest. */
export const walkInBody = z.object({ name: z.string().trim().min(2).max(120), phone: z.string().trim().regex(/^\+?[0-9 ]{7,20}$/).optional(), email: z.email().optional() });

/** `PUT /crm/guests/:id/tags`. */
export const tagsBody = z.object({ tags: z.array(tag).max(20) });

/** `POST /crm/guests/:id/notes`. */
export const noteBody = z.object({ text: z.string().trim().min(1).max(2000) });

/** `PUT /crm/settings`. */
export const settingsBody = z.object({ tags: z.array(tag).max(60) });
