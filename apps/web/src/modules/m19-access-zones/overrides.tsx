// The hand-made web pages of module 19 (Access zones), live from the API
// through the shared record pages (the same engine as the API's records kit).
// Each line: which shared page the screen uses, and which record types it shows.

import type { ScreenOverrides } from "@/shared/catalog/types";
import { recordOverrides } from "@/shared/records/presentation/recordOverrides";
import { PLACE } from "./domain/place";

/** Module 19's hand-made web pages. */
export const m19Overrides: ScreenOverrides = recordOverrides(PLACE, {
  "S19-01": ["list", { types: ["zone"], staff: true }],
  "S19-03": ["settings"],
  "S19-04": ["board", { types: ["entry"], staff: true }],
  "S19-05": ["form", { types: ["entry"], staff: true }],
  "S19-06": ["list", { types: ["entry"], staff: true, openOnly: false }],
  "S19-07": ["list", { types: ["pass"], staff: true }],
});
