// The hand-made web pages of module 26 (Shifts and rosters), live from the API
// through the shared record pages (the same engine as the API's records kit).
// Each line: which shared page the screen uses, and which record types it shows.

import type { ScreenOverrides } from "@/shared/catalog/types";
import { recordOverrides } from "@/shared/records/presentation/recordOverrides";
import { PLACE } from "./domain/place";

/** Module 26's hand-made web pages. */
export const m26Overrides: ScreenOverrides = recordOverrides(PLACE, {
  "S26-01": ["list", { types: ["shift"], staff: true }],
  "S26-02": ["list", { types: ["shift"], assigned: true, canAdd: false }],
  "S26-03": ["settings"],
  "S26-04": ["list", { types: ["swap"], staff: true }],
  "S26-05": ["list", { types: ["open_shift"], staff: true }],
});
