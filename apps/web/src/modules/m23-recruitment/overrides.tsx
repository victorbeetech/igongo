// The hand-made web pages of module 23 (Recruitment), live from the API
// through the shared record pages (the same engine as the API's records kit).
// Each line: which shared page the screen uses, and which record types it shows.

import type { ScreenOverrides } from "@/shared/catalog/types";
import { recordOverrides } from "@/shared/records/presentation/recordOverrides";
import { PLACE } from "./domain/place";

/** Module 23's hand-made web pages. */
export const m23Overrides: ScreenOverrides = recordOverrides(PLACE, {
  "S23-01": ["list", { types: ["vacancy"], staff: true }],
  "S23-03": ["list", { types: ["vacancy"], canAdd: false }],
  "S23-04": ["form", { types: ["application"] }],
  "S23-05": ["list", { types: ["application"], staff: true }],
  "S23-06": ["list", { types: ["application"], staff: true }],
  "S23-07": ["list", { types: ["interview"], staff: true }],
  "S23-08": ["list", { types: ["interview"], staff: true }],
});
