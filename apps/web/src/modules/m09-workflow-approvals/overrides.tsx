// The hand-made web pages of module 9 (Approvals), live from the API
// through the shared record pages (the same engine as the API's records kit).
// Each line: which shared page the screen uses, and which record types it shows.

import type { ScreenOverrides } from "@/shared/catalog/types";
import { recordOverrides } from "@/shared/records/presentation/recordOverrides";
import { PLACE } from "./domain/place";

/** Module 9's hand-made web pages. */
export const m09Overrides: ScreenOverrides = recordOverrides(PLACE, {
  "S09-01": ["list", { types: ["approval"], staff: true }],
  "S09-03": ["list", { types: ["delegation"], staff: true }],
  "S09-04": ["form", { types: ["approval"] }],
  "S09-05": ["board", { staff: true }],
});
