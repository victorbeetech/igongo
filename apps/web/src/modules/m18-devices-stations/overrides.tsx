// The hand-made web pages of module 18 (Devices), live from the API
// through the shared record pages (the same engine as the API's records kit).
// Each line: which shared page the screen uses, and which record types it shows.

import type { ScreenOverrides } from "@/shared/catalog/types";
import { recordOverrides } from "@/shared/records/presentation/recordOverrides";
import { PLACE } from "./domain/place";

/** Module 18's hand-made web pages. */
export const m18Overrides: ScreenOverrides = recordOverrides(PLACE, {
  "S18-01": ["list", { types: ["device"], staff: true }],
  "S18-02": ["scan"],
  "S18-03": ["form", { types: ["device"], staff: true }],
  "S18-04": ["scan"],
  "S18-05": ["list", { types: ["station"], staff: true }],
  "S18-06": ["list", { types: ["station"], staff: true }],
  "S18-07": ["list", { types: ["device"], staff: true }],
  "S18-08": ["list", { types: ["station"], staff: true }],
  "S18-09": ["list", { types: ["alert"], staff: true }],
  "S18-10": ["settings"],
});
