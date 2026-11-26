/**
 * Public contract of Reports & Analytics (module 81). Each module that has
 * numbers worth showing gives the gateway a `KpiSource`; the dashboard asks
 * every source that is switched on and that the viewer may see.
 */

/** How a number is shown. */
export type KpiUnit = "count" | "ugx" | "percent";

/** One number on the dashboard, such as "Orders: 42". */
export interface Kpi {
  /** Unique across the system, such as `food-ordering.orders`. */
  key: string;
  label: string;
  value: number;
  unit: KpiUnit;
}

/** A time range: from inclusive, to exclusive. */
export interface KpiRange {
  from: Date;
  to: Date;
}

export interface KpiSource {
  /** The module key, such as `food-ordering`. */
  module: string;
  /** The tile group's title, such as "Food orders". */
  title: string;
  read(range: KpiRange): Promise<Kpi[]>;
}
