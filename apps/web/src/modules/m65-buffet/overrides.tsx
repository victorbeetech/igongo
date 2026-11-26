// The hand-made web pages of module 65 (Buffet), live from the API
// through the shared record pages (the same engine as the API's records kit).
// Each line: which shared page the screen uses, and which record types it shows.

import type { ScreenOverrides } from "@/shared/catalog/types";
import { recordOverrides } from "@/shared/records/presentation/recordOverrides";
import { PLACE } from "./domain/place";

/** Module 65's hand-made web pages. */
export const m65Overrides: ScreenOverrides = recordOverrides(PLACE, {
  "S65-01": ["list", { types: ["session"], staff: true }],
  "S65-02": ["list", { types: ["ticket"], staff: true }],
  "S65-03": ["board", { staff: true }],
  "S65-04": ["form", { types: ["ticket"] }],
  "S65-05": ["settings"],
});
