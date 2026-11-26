// The hand-made web pages of module 63 (Kitchen production), live from the API
// through the shared record pages (the same engine as the API's records kit).
// Each line: which shared page the screen uses, and which record types it shows.

import type { ScreenOverrides } from "@/shared/catalog/types";
import { recordOverrides } from "@/shared/records/presentation/recordOverrides";
import { PLACE } from "./domain/place";

/** Module 63's hand-made web pages. */
export const m63Overrides: ScreenOverrides = recordOverrides(PLACE, {
  "S63-03": ["list", { types: ["production"], staff: true }],
  "S63-04": ["list", { types: ["waste"], staff: true }],
  "S63-05": ["settings"],
});
