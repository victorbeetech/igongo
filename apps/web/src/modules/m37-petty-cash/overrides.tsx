// The hand-made web pages of module 37 (Petty cash), live from the API
// through the shared record pages (the same engine as the API's records kit).
// Each line: which shared page the screen uses, and which record types it shows.

import type { ScreenOverrides } from "@/shared/catalog/types";
import { recordOverrides } from "@/shared/records/presentation/recordOverrides";
import { PLACE } from "./domain/place";

/** Module 37's hand-made web pages. */
export const m37Overrides: ScreenOverrides = recordOverrides(PLACE, {
  "S37-01": ["list", { types: ["claim"], mine: true, openOnly: false }],
  "S37-02": ["form", { types: ["claim"] }],
  "S37-03": ["list", { types: ["claim"], staff: true }],
  "S37-04": ["list", { types: ["topup"], staff: true }],
  "S37-05": ["form", { types: ["count"], staff: true }],
  "S37-06": ["settings"],
});
