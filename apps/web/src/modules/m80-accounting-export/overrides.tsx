// The hand-made web pages of module 80 (Accounting export), live from the API
// through the shared record pages (the same engine as the API's records kit).
// Each line: which shared page the screen uses, and which record types it shows.

import type { ScreenOverrides } from "@/shared/catalog/types";
import { recordOverrides } from "@/shared/records/presentation/recordOverrides";
import { PLACE } from "./domain/place";

/** Module 80's hand-made web pages. */
export const m80Overrides: ScreenOverrides = recordOverrides(PLACE, {
  "S80-01": ["list", { types: ["batch"], staff: true }],
  "S80-02": ["list", { types: ["mapping"], staff: true }],
});
