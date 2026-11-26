// The hand-made web pages of module 79 (Cash-up), live from the API
// through the shared record pages (the same engine as the API's records kit).
// Each line: which shared page the screen uses, and which record types it shows.

import type { ScreenOverrides } from "@/shared/catalog/types";
import { recordOverrides } from "@/shared/records/presentation/recordOverrides";
import { PLACE } from "./domain/place";

/** Module 79's hand-made web pages. */
export const m79Overrides: ScreenOverrides = recordOverrides(PLACE, {
  "S79-01": ["form", { types: ["cashup"] }],
  "S79-02": ["list", { types: ["cashup"], staff: true }],
  "S79-03": ["list", { types: ["cashup"], staff: true, openOnly: false }],
  "S79-04": ["form", { types: ["float"] }],
  "S79-05": ["settings"],
});
