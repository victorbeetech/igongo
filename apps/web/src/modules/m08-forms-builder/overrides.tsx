// The hand-made web pages of module 8 (Forms), live from the API
// through the shared record pages (the same engine as the API's records kit).
// Each line: which shared page the screen uses, and which record types it shows.

import type { ScreenOverrides } from "@/shared/catalog/types";
import { recordOverrides } from "@/shared/records/presentation/recordOverrides";
import { PLACE } from "./domain/place";

/** Module 8's hand-made web pages. */
export const m08Overrides: ScreenOverrides = recordOverrides(PLACE, {
  "S08-01": ["list", { staff: true }],
  "S08-04": ["settings"],
  "S08-06": ["list", { staff: true, openOnly: false }],
  "S08-07": ["form"],
  "S08-08": ["list", { staff: true }],
  "S08-09": ["list", { staff: true }],
  "S08-10": ["form"],
});
