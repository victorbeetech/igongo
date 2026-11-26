// The hand-made web pages of module 58 (Campaigns), live from the API
// through the shared record pages (the same engine as the API's records kit).
// Each line: which shared page the screen uses, and which record types it shows.

import type { ScreenOverrides } from "@/shared/catalog/types";
import { recordOverrides } from "@/shared/records/presentation/recordOverrides";
import { PLACE } from "./domain/place";

/** Module 58's hand-made web pages. */
export const m58Overrides: ScreenOverrides = recordOverrides(PLACE, {
  "S58-01": ["list", { staff: true }],
  "S58-02": ["form", { staff: true }],
  "S58-03": ["board", { staff: true, openOnly: false }],
});
