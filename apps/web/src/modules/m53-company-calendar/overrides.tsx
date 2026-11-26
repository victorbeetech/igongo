// The hand-made web pages of module 53 (Company calendar), live from the API
// through the shared record pages (the same engine as the API's records kit).
// Each line: which shared page the screen uses, and which record types it shows.

import type { ScreenOverrides } from "@/shared/catalog/types";
import { recordOverrides } from "@/shared/records/presentation/recordOverrides";
import { PLACE } from "./domain/place";

/** Module 53's hand-made web pages. */
export const m53Overrides: ScreenOverrides = recordOverrides(PLACE, {
  "S53-01": ["list", { canAdd: false, openOnly: false }],
  "S53-02": ["list", { canAdd: false, openOnly: false }],
  "S53-03": ["form", { staff: true }],
  "S53-04": ["settings"],
});
