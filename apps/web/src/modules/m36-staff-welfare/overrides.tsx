// The hand-made web pages of module 36 (Staff requests and welfare), live from the API
// through the shared record pages (the same engine as the API's records kit).
// Each line: which shared page the screen uses, and which record types it shows.

import type { ScreenOverrides } from "@/shared/catalog/types";
import { recordOverrides } from "@/shared/records/presentation/recordOverrides";
import { PLACE } from "./domain/place";

/** Module 36's hand-made web pages. */
export const m36Overrides: ScreenOverrides = recordOverrides(PLACE, {
  "S36-01": ["list", { types: ["request"], mine: true, openOnly: false }],
  "S36-02": ["form", { types: ["request"] }],
  "S36-03": ["list", { types: ["request"], staff: true }],
  "S36-04": ["list", { types: ["welfare"], staff: true }],
  "S36-05": ["settings"],
});
