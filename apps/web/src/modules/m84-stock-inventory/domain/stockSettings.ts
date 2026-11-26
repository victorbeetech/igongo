// The super admin's stock rules (no code): categories, units, whether a
// store may go below zero, and whether changes need a reason.

import type { FieldDef } from "@/shared/records/types/fieldDef";

export interface StockSettings {
  categories: string[];
  units: string[];
  allowNegative: boolean;
  reasonRequired: boolean;
  itemFields: FieldDef[];
}
