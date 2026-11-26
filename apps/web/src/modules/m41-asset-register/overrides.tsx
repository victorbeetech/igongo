// The hand-made web pages of module 41 (Assets), live from the API
// through the shared record pages (the same engine as the API's records kit).
// Each line: which shared page the screen uses, and which record types it shows.

import type { ScreenOverrides } from "@/shared/catalog/types";
import { recordOverrides } from "@/shared/records/presentation/recordOverrides";
import { PLACE } from "./domain/place";

/** Module 41's hand-made web pages. */
export const m41Overrides: ScreenOverrides = recordOverrides(PLACE, {
  "S41-01": ["list", { types: ["asset"], staff: true, openOnly: false }],
  "S41-02": ["scan"],
  "S41-03": ["scan"],
  "S41-04": ["form", { types: ["asset"], staff: true }],
  "S41-05": ["list", { types: ["count"], staff: true }],
  "S41-06": ["settings"],
});
