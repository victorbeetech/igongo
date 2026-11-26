// The hand-made web pages of module 27 (Leave), live from the API
// through the shared record pages (the same engine as the API's records kit).
// Each line: which shared page the screen uses, and which record types it shows.

import type { ScreenOverrides } from "@/shared/catalog/types";
import { recordOverrides } from "@/shared/records/presentation/recordOverrides";
import { PLACE } from "./domain/place";

/** Module 27's hand-made web pages. */
export const m27Overrides: ScreenOverrides = recordOverrides(PLACE, {
  "S27-01": ["list", { mine: true, openOnly: false }],
  "S27-02": ["form"],
  "S27-03": ["list", { staff: true }],
  "S27-04": ["list", { staff: true, openOnly: false }],
  "S27-05": ["settings"],
});
