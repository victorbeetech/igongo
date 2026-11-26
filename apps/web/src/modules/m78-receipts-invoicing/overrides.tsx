// The hand-made web pages of module 78 (Receipts and invoices), live from the API
// through the shared record pages (the same engine as the API's records kit).
// Each line: which shared page the screen uses, and which record types it shows.

import type { ScreenOverrides } from "@/shared/catalog/types";
import { recordOverrides } from "@/shared/records/presentation/recordOverrides";
import { PLACE } from "./domain/place";

/** Module 78's hand-made web pages. */
export const m78Overrides: ScreenOverrides = recordOverrides(PLACE, {
  "S78-01": ["list", { staff: true }],
  "S78-02": ["scan"],
  "S78-03": ["settings"],
  "S78-04": ["settings"],
  "S78-05": ["scan"],
  "S78-06": ["list", { mine: true, canAdd: false }],
});
