// The hand-made web pages of module 60 (Guest requests), live from the API
// through the shared record pages (the same engine as the API's records kit).
// Each line: which shared page the screen uses, and which record types it shows.

import type { ScreenOverrides } from "@/shared/catalog/types";
import { recordOverrides } from "@/shared/records/presentation/recordOverrides";
import { PLACE } from "./domain/place";

/** Module 60's hand-made web pages. */
export const m60Overrides: ScreenOverrides = recordOverrides(PLACE, {
  "S60-01": ["form"],
  "S60-02": ["list", { mine: true, openOnly: false }],
  "S60-03": ["board", { staff: true }],
  "S60-04": ["list", { staff: true }],
  "S60-05": ["settings"],
});
