// The hand-made web pages of module 35 (Discipline), live from the API
// through the shared record pages (the same engine as the API's records kit).
// Each line: which shared page the screen uses, and which record types it shows.

import type { ScreenOverrides } from "@/shared/catalog/types";
import { recordOverrides } from "@/shared/records/presentation/recordOverrides";
import { PLACE } from "./domain/place";

/** Module 35's hand-made web pages. */
export const m35Overrides: ScreenOverrides = recordOverrides(PLACE, {
  "S35-01": ["list", { staff: true }],
  "S35-02": ["list", { staff: true, openOnly: false }],
  "S35-03": ["form", { staff: true }],
  "S35-04": ["list", { mine: true, canAdd: false }],
  "S35-05": ["list", { staff: true, openOnly: false }],
  "S35-06": ["settings"],
});
