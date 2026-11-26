// The hand-made web pages of module 43 (Housekeeping), live from the API
// through the shared record pages (the same engine as the API's records kit).
// Each line: which shared page the screen uses, and which record types it shows.

import type { ScreenOverrides } from "@/shared/catalog/types";
import { recordOverrides } from "@/shared/records/presentation/recordOverrides";
import { PLACE } from "./domain/place";

/** Module 43's hand-made web pages. */
export const m43Overrides: ScreenOverrides = recordOverrides(PLACE, {
  "S43-01": ["board", { types: ["room"], staff: true }],
  "S43-02": ["list", { types: ["room"], staff: true }],
  "S43-03": ["list", { types: ["clean"], assigned: true }],
  "S43-04": ["list", { types: ["clean"], assigned: true }],
  "S43-05": ["list", { types: ["clean"], staff: true }],
  "S43-06": ["list", { types: ["clean"], staff: true }],
  "S43-07": ["settings"],
});
