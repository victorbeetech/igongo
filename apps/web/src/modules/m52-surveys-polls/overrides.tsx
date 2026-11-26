// The hand-made web pages of module 52 (Surveys and polls), live from the API
// through the shared record pages (the same engine as the API's records kit).
// Each line: which shared page the screen uses, and which record types it shows.

import type { ScreenOverrides } from "@/shared/catalog/types";
import { recordOverrides } from "@/shared/records/presentation/recordOverrides";
import { PLACE } from "./domain/place";

/** Module 52's hand-made web pages. */
export const m52Overrides: ScreenOverrides = recordOverrides(PLACE, {
  "S52-01": ["list", { staff: true }],
  "S52-02": ["form"],
  "S52-03": ["settings"],
  "S52-04": ["board", { staff: true, openOnly: false }],
});
