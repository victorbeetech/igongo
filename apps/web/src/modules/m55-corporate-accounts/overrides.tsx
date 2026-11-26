// The hand-made web pages of module 55 (Corporate accounts), live from the API
// through the shared record pages (the same engine as the API's records kit).
// Each line: which shared page the screen uses, and which record types it shows.

import type { ScreenOverrides } from "@/shared/catalog/types";
import { recordOverrides } from "@/shared/records/presentation/recordOverrides";
import { PLACE } from "./domain/place";

/** Module 55's hand-made web pages. */
export const m55Overrides: ScreenOverrides = recordOverrides(PLACE, {
  "S55-01": ["list", { types: ["company"], staff: true }],
  "S55-02": ["list", { types: ["company"], staff: true, openOnly: false }],
  "S55-03": ["form", { types: ["company"], staff: true }],
  "S55-04": ["list", { mine: true, canAdd: false }],
  "S55-05": ["settings"],
});
