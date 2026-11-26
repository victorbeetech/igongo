// The hand-made web pages of module 47 (Fleet and transport), live from the API
// through the shared record pages (the same engine as the API's records kit).
// Each line: which shared page the screen uses, and which record types it shows.

import type { ScreenOverrides } from "@/shared/catalog/types";
import { recordOverrides } from "@/shared/records/presentation/recordOverrides";
import { PLACE } from "./domain/place";

/** Module 47's hand-made web pages. */
export const m47Overrides: ScreenOverrides = recordOverrides(PLACE, {
  "S47-01": ["list", { types: ["vehicle"], staff: true }],
  "S47-02": ["list", { types: ["trip"], staff: true }],
  "S47-03": ["list", { types: ["trip"], mine: true, openOnly: false }],
  "S47-04": ["form", { types: ["trip"] }],
  "S47-05": ["list", { types: ["fuel"], staff: true }],
  "S47-06": ["settings"],
});
