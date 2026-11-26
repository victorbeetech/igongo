// The hand-made web pages of module 57 (Loyalty), live from the API
// through the shared record pages (the same engine as the API's records kit).
// Each line: which shared page the screen uses, and which record types it shows.

import type { ScreenOverrides } from "@/shared/catalog/types";
import { recordOverrides } from "@/shared/records/presentation/recordOverrides";
import { PLACE } from "./domain/place";

/** Module 57's hand-made web pages. */
export const m57Overrides: ScreenOverrides = recordOverrides(PLACE, {
  "S57-01": ["list", { types: ["points"], mine: true, canAdd: false }],
  "S57-02": ["list", { types: ["member"], mine: true, canAdd: false }],
  "S57-03": ["list", { types: ["reward"], canAdd: false, openOnly: false }],
  "S57-04": ["list", { types: ["member"], staff: true }],
  "S57-05": ["settings"],
});
