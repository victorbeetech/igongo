// The hand-made web pages of module 46 (Lost and found), live from the API
// through the shared record pages (the same engine as the API's records kit).
// Each line: which shared page the screen uses, and which record types it shows.

import type { ScreenOverrides } from "@/shared/catalog/types";
import { recordOverrides } from "@/shared/records/presentation/recordOverrides";
import { PLACE } from "./domain/place";

/** Module 46's hand-made web pages. */
export const m46Overrides: ScreenOverrides = recordOverrides(PLACE, {
  "S46-01": ["board", { types: ["found"], staff: true }],
  "S46-02": ["form", { types: ["found"], staff: true }],
  "S46-03": ["list", { staff: true }],
  "S46-04": ["form", { types: ["lost"] }],
  "S46-05": ["settings"],
});
