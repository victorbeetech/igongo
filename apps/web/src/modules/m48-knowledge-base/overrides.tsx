// The hand-made web pages of module 48 (Knowledge base), live from the API
// through the shared record pages (the same engine as the API's records kit).
// Each line: which shared page the screen uses, and which record types it shows.

import type { ScreenOverrides } from "@/shared/catalog/types";
import { recordOverrides } from "@/shared/records/presentation/recordOverrides";
import { PLACE } from "./domain/place";

/** Module 48's hand-made web pages. */
export const m48Overrides: ScreenOverrides = recordOverrides(PLACE, {
  "S48-01": ["list", { canAdd: false, openOnly: false }],
  "S48-02": ["list", { canAdd: false, openOnly: false }],
  "S48-03": ["list", { staff: true }],
  "S48-04": ["list", { canAdd: false, openOnly: false }],
});
