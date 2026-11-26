// The hand-made web pages of module 59 (Promotions and vouchers), live from the API
// through the shared record pages (the same engine as the API's records kit).
// Each line: which shared page the screen uses, and which record types it shows.

import type { ScreenOverrides } from "@/shared/catalog/types";
import { recordOverrides } from "@/shared/records/presentation/recordOverrides";
import { PLACE } from "./domain/place";

/** Module 59's hand-made web pages. */
export const m59Overrides: ScreenOverrides = recordOverrides(PLACE, {
  "S59-01": ["list", { types: ["promotion"], staff: true }],
  "S59-02": ["form", { types: ["promotion"], staff: true }],
  "S59-03": ["list", { types: ["voucher"], staff: true }],
  "S59-04": ["form", { types: ["voucher"] }],
  "S59-05": ["list", { types: ["voucher"], mine: true, canAdd: false }],
  "S59-06": ["scan"],
});
