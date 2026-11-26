// The hand-made web pages of module 76 (Prices and taxes), live from the API
// through the shared record pages (the same engine as the API's records kit).
// Each line: which shared page the screen uses, and which record types it shows.

import type { ScreenOverrides } from "@/shared/catalog/types";
import { recordOverrides } from "@/shared/records/presentation/recordOverrides";
import { PLACE } from "./domain/place";

/** Module 76's hand-made web pages. */
export const m76Overrides: ScreenOverrides = recordOverrides(PLACE, {
  "S76-01": ["list", { types: ["price_list"], staff: true }],
  "S76-02": ["list", { types: ["tax"], staff: true }],
  "S76-03": ["list", { types: ["discount"], staff: true }],
  "S76-04": ["list", { staff: true, openOnly: false }],
});
