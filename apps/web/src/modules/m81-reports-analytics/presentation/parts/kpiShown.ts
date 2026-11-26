// A tile's value in its unit: shillings, a percentage or a plain count.

import type { Kpi } from "@/modules/m81-reports-analytics/data/reportsApi";
import { ugx } from "@/shared/format/ugx";

/** [k]'s value as words on a tile. */
export const kpiShown = (k: Kpi): string => (k.unit === "ugx" ? ugx(k.value) : k.unit === "percent" ? `${Math.round(k.value)}%` : k.value.toLocaleString("en-UG"));
