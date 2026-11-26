// The hand-made web pages of module 33 (Performance), live from the API
// through the shared record pages (the same engine as the API's records kit).
// Each line: which shared page the screen uses, and which record types it shows.

import type { ScreenOverrides } from "@/shared/catalog/types";
import { recordOverrides } from "@/shared/records/presentation/recordOverrides";
import { PLACE } from "./domain/place";

/** Module 33's hand-made web pages. */
export const m33Overrides: ScreenOverrides = recordOverrides(PLACE, {
  "S33-01": ["list", { types: ["appraisal"], mine: true, canAdd: false }],
  "S33-02": ["list", { types: ["appraisal"], staff: true }],
  "S33-03": ["list", { types: ["appraisal"], staff: true, openOnly: false }],
  "S33-04": ["list", { types: ["goal"], staff: true }],
  "S33-05": ["list", { types: ["probation"], staff: true }],
  "S33-06": ["settings"],
});
