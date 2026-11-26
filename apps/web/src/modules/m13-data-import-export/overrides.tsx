// The hand-made web pages of module 13 (Data jobs), live from the API
// through the shared record pages (the same engine as the API's records kit).
// Each line: which shared page the screen uses, and which record types it shows.

import type { ScreenOverrides } from "@/shared/catalog/types";
import { recordOverrides } from "@/shared/records/presentation/recordOverrides";
import { PLACE } from "./domain/place";

/** Module 13's hand-made web pages. */
export const m13Overrides: ScreenOverrides = recordOverrides(PLACE, {
  "S13-02": ["list", { staff: true, openOnly: false }],
  "S13-03": ["list", { types: ["export"], staff: true }],
  "S13-04": ["list", { staff: true }],
  "S13-05": ["form", { types: ["restore"], staff: true }],
});
