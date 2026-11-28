/** Zod schemas for the calendar's query and settings body. */

import { z } from "zod";
import { FULL_RULES } from "../domain/day-status";

/** `YYYY-MM-DD`. */
const day = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

/** `GET /api/calendar?from&days`: the first day (default: today is set by the route) and how many days. */
export const calendarQuery = z.object({
  from: day.optional(),
  days: z.coerce.number().int().min(1).max(365).default(31),
});

/** `PUT /api/calendar/settings`: any of the settings, all optional. */
export const calendarSettingsBody = z
  .object({
    enabled: z.boolean(),
    openWeekdays: z.array(z.number().int().min(0).max(6)).max(7).refine((d) => new Set(d).size === d.length, "Each weekday once."),
    fullRule: z.enum(FULL_RULES),
    windowDays: z.number().int().min(1).max(365),
  })
  .partial();
