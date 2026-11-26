// The hand-made web pages of module 51 (Meetings), live from the API
// through the shared record pages (the same engine as the API's records kit).
// Each line: which shared page the screen uses, and which record types it shows.

import type { ScreenOverrides } from "@/shared/catalog/types";
import { recordOverrides } from "@/shared/records/presentation/recordOverrides";
import { PLACE } from "./domain/place";

/** Module 51's hand-made web pages. */
export const m51Overrides: ScreenOverrides = recordOverrides(PLACE, {
  "S51-01": ["list", { types: ["meeting"], staff: true }],
  "S51-02": ["list", { types: ["meeting"], staff: true, openOnly: false }],
  "S51-03": ["form", { types: ["meeting"], staff: true }],
  "S51-04": ["list", { types: ["meeting"], staff: true }],
  "S51-05": ["list", { types: ["action"], assigned: true }],
});
