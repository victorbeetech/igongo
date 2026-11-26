// The hand-made web pages of module 56 (Feedback and complaints), live from the API
// through the shared record pages (the same engine as the API's records kit).
// Each line: which shared page the screen uses, and which record types it shows.

import type { ScreenOverrides } from "@/shared/catalog/types";
import { recordOverrides } from "@/shared/records/presentation/recordOverrides";
import { PLACE } from "./domain/place";

/** Module 56's hand-made web pages. */
export const m56Overrides: ScreenOverrides = recordOverrides(PLACE, {
  "S56-01": ["list", { types: ["feedback"], staff: true }],
  "S56-02": ["list", { staff: true, openOnly: false }],
  "S56-03": ["form"],
  "S56-04": ["list", { types: ["complaint"], staff: true }],
  "S56-05": ["list", { types: ["review"], staff: true }],
  "S56-06": ["board", { staff: true, openOnly: false }],
  "S56-07": ["settings"],
});
