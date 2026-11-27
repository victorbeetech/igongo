/**
 * Zod schemas for CRM request bodies and queries. Every value a guest can
 * type is checked here on the server, whatever the app already checked, and
 * each refusal carries a sentence the app can show the guest.
 */

import { z } from "zod";

/** Plain short text: trimmed and at most 200 characters. */
const shortText = z.string().trim().max(200);

/** A staff tag: lower-case letters, digits and dashes, 2 to 40 characters. */
const tag = z.string().regex(/^[a-z0-9-]{2,40}$/);

/** A phone number: an optional leading `+`, then 7 to 20 digits or spaces. */
export const phoneField = z
  .string()
  .trim()
  .regex(/^\+?[0-9 ]{7,20}$/, "Enter a phone number with 7 to 20 digits, such as +256 700 000000.");

/**
 * An email address: checked as an address, at most 254 characters, and kept
 * in lower case so the same address always matches the same profile.
 */
export const emailField = z
  .email("Enter an email address, such as name@example.com.")
  .max(254, "The email address is too long.")
  .transform((value) => value.toLowerCase());

/** A guest's name: 2 to 120 characters. */
const nameField = z.string().trim().min(2, "Enter your name, at least 2 letters.").max(120, "Your name is too long.");

/**
 * `PATCH /crm/me`: any of my details. A missing field is left as it is; a
 * `null` clears it. Fields not listed here (tags, consent, the account) are
 * ignored, because the schema strips unknown keys.
 */
export const myDetailsBody = z
  .object({
    name: nameField,
    phone: phoneField.nullable(),
    email: emailField.nullable(),
    nationality: shortText.nullable(),
    birthday: z.iso.date("Enter the birthday as YYYY-MM-DD.").nullable(),
    preferences: z.string().trim().max(1000).nullable(),
    allergies: z.string().trim().max(500).nullable(),
  })
  .partial();

/** `PUT /crm/me/consent`. */
export const consentBody = z.object({ sms: z.boolean(), whatsapp: z.boolean(), email: z.boolean() });

/** `GET /crm/guests`. */
export const searchQuery = z.object({ q: z.string().trim().max(80).optional(), tag: tag.optional() });

/** `POST /crm/guests`: a walk-in guest. */
export const walkInBody = z.object({ name: nameField, phone: phoneField.optional(), email: emailField.optional() });

/** `PUT /crm/guests/:id/tags`. */
export const tagsBody = z.object({ tags: z.array(tag).max(20) });

/** `POST /crm/guests/:id/notes`. */
export const noteBody = z.object({ text: z.string().trim().min(1).max(2000) });

/** `PUT /crm/settings`. */
export const settingsBody = z.object({ tags: z.array(tag).max(60) });
