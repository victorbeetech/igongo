// The hand-made web pages of module 34 (Training), live from the API
// through the shared record pages (the same engine as the API's records kit).
// Each line: which shared page the screen uses, and which record types it shows.

import type { ScreenOverrides } from "@/shared/catalog/types";
import { recordOverrides } from "@/shared/records/presentation/recordOverrides";
import { PLACE } from "./domain/place";

/** Module 34's hand-made web pages. */
export const m34Overrides: ScreenOverrides = recordOverrides(PLACE, {
  "S34-01": ["list", { types: ["request"], mine: true }],
  "S34-02": ["list", { types: ["course"], staff: true }],
  "S34-03": ["list", { types: ["course"], canAdd: false }],
  "S34-04": ["list", { types: ["session"], staff: true }],
  "S34-05": ["list", { types: ["certificate"], staff: true }],
  "S34-06": ["settings"],
});
