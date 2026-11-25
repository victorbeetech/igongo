/** Zod schemas for the Super Admin Console's requests. */

import { z } from "zod";
import { SECTION_NAMES } from "../domain/settings-sections";

/** `PATCH /admin/modules/:key`. */
export const moduleBody = z.object({
  enabled: z.boolean().optional(),
  maintenance: z.boolean().optional(),
  message: z.string().max(300).nullable().optional(),
});

/** A settings section in the path. */
export const sectionParam = z.object({ section: z.enum(SECTION_NAMES as [string, ...string[]]) });

/** `PATCH /admin/settings/:section`: any fields; the section's rules check them. */
export const sectionBody = z.record(z.string(), z.unknown());

/** `PUT /admin/keys/:key`. */
export const secretBody = z.object({ value: z.string().min(1).max(10_000) });
