// The hand-made web pages of module 42 (Tasks), live from the API
// through the shared record pages (the same engine as the API's records kit).
// Each line: which shared page the screen uses, and which record types it shows.

import type { ScreenOverrides } from "@/shared/catalog/types";
import { recordOverrides } from "@/shared/records/presentation/recordOverrides";
import { PLACE } from "./domain/place";

/** Module 42's hand-made web pages. */
export const m42Overrides: ScreenOverrides = recordOverrides(PLACE, {
  "S42-01": ["list", { assigned: true }],
  "S42-02": ["list", { staff: true, openOnly: false }],
  "S42-03": ["form", { staff: true }],
  "S42-04": ["board", { staff: true }],
  "S42-05": ["settings"],
});
