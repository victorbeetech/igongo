// The hand-made web pages of module 20 (Visitors), live from the API
// through the shared record pages (the same engine as the API's records kit).
// Each line: which shared page the screen uses, and which record types it shows.

import type { ScreenOverrides } from "@/shared/catalog/types";
import { recordOverrides } from "@/shared/records/presentation/recordOverrides";
import { PLACE } from "./domain/place";

/** Module 20's hand-made web pages. */
export const m20Overrides: ScreenOverrides = recordOverrides(PLACE, {
  "S20-01": ["board", { types: ["visitor"], staff: true }],
  "S20-02": ["form", { types: ["visitor"] }],
  "S20-03": ["form", { types: ["visitor"], staff: true }],
  "S20-04": ["scan"],
  "S20-05": ["list", { types: ["visitor"], staff: true, openOnly: false }],
  "S20-06": ["list", { types: ["contractor"], staff: true }],
  "S20-07": ["list", { types: ["vehicle"], staff: true }],
  "S20-08": ["list", { types: ["blacklist"], staff: true }],
  "S20-09": ["settings"],
});
