// The hand-made web pages of module 24 (Onboarding and exit), live from the API
// through the shared record pages (the same engine as the API's records kit).
// Each line: which shared page the screen uses, and which record types it shows.

import type { ScreenOverrides } from "@/shared/catalog/types";
import { recordOverrides } from "@/shared/records/presentation/recordOverrides";
import { PLACE } from "./domain/place";

/** Module 24's hand-made web pages. */
export const m24Overrides: ScreenOverrides = recordOverrides(PLACE, {
  "S24-01": ["list", { types: ["onboarding"], staff: true }],
  "S24-02": ["list", { types: ["onboarding"], staff: true }],
  "S24-03": ["list", { types: ["onboarding"], mine: true, canAdd: false }],
  "S24-04": ["list", { types: ["exit"], staff: true }],
  "S24-05": ["list", { types: ["exit"], staff: true }],
  "S24-06": ["list", { types: ["exit"], staff: true }],
  "S24-07": ["settings"],
});
