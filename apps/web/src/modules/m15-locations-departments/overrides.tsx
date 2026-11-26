// The hand-made web pages of module 15 (Organisation), live from the API
// through the shared record pages (the same engine as the API's records kit).
// Each line: which shared page the screen uses, and which record types it shows.

import type { ScreenOverrides } from "@/shared/catalog/types";
import { recordOverrides } from "@/shared/records/presentation/recordOverrides";
import { PLACE } from "./domain/place";

/** Module 15's hand-made web pages. */
export const m15Overrides: ScreenOverrides = recordOverrides(PLACE, {
  "S15-01": ["board", { staff: true }],
  "S15-02": ["list", { types: ["department"], staff: true }],
  "S15-03": ["list", { types: ["location"], staff: true }],
  "S15-04": ["list", { types: ["outlet"], staff: true }],
  "S15-05": ["list", { types: ["cost_centre"], staff: true }],
});
