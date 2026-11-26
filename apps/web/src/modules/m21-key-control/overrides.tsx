// The hand-made web pages of module 21 (Key control), live from the API
// through the shared record pages (the same engine as the API's records kit).
// Each line: which shared page the screen uses, and which record types it shows.

import type { ScreenOverrides } from "@/shared/catalog/types";
import { recordOverrides } from "@/shared/records/presentation/recordOverrides";
import { PLACE } from "./domain/place";

/** Module 21's hand-made web pages. */
export const m21Overrides: ScreenOverrides = recordOverrides(PLACE, {
  "S21-01": ["list", { types: ["key"], staff: true, openOnly: false }],
  "S21-02": ["scan"],
  "S21-03": ["scan"],
  "S21-04": ["scan"],
  "S21-05": ["board", { types: ["key"], staff: true }],
  "S21-06": ["settings"],
});
