// The hand-made web pages of module 45 (Security), live from the API
// through the shared record pages (the same engine as the API's records kit).
// Each line: which shared page the screen uses, and which record types it shows.

import type { ScreenOverrides } from "@/shared/catalog/types";
import { recordOverrides } from "@/shared/records/presentation/recordOverrides";
import { PLACE } from "./domain/place";

/** Module 45's hand-made web pages. */
export const m45Overrides: ScreenOverrides = recordOverrides(PLACE, {
  "S45-01": ["board", { staff: true }],
  "S45-02": ["list", { types: ["patrol"], staff: true }],
  "S45-03": ["list", { types: ["incident"], staff: true }],
  "S45-04": ["form", { types: ["incident"] }],
  "S45-05": ["list", { types: ["incident"], staff: true, openOnly: false }],
  "S45-06": ["form", { types: ["panic"] }],
  "S45-07": ["settings"],
});
