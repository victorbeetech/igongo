// The hand-made web pages of module 44 (Laundry), live from the API
// through the shared record pages (the same engine as the API's records kit).
// Each line: which shared page the screen uses, and which record types it shows.

import type { ScreenOverrides } from "@/shared/catalog/types";
import { recordOverrides } from "@/shared/records/presentation/recordOverrides";
import { PLACE } from "./domain/place";

/** Module 44's hand-made web pages. */
export const m44Overrides: ScreenOverrides = recordOverrides(PLACE, {
  "S44-01": ["list", { types: ["guest"], staff: true }],
  "S44-02": ["form", { types: ["guest"] }],
  "S44-03": ["list", { types: ["linen"], staff: true }],
  "S44-04": ["list", { types: ["uniform"], staff: true }],
  "S44-05": ["settings"],
});
