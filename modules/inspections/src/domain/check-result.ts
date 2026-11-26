/** The answer to one checklist line in a run. */

export const RESULTS = ["ok", "fault", "na"] as const;
export type Result = (typeof RESULTS)[number];

export interface CheckResult {
  key: string;
  label: string;
  result: Result;
  note: string | null;
  photoIds: string[];
  /** The fault raised for this line, such as `FLT-0042`. */
  faultNumber: string | null;
}

/** The share of checked lines that passed, 0 to 100 (lines marked n/a do not count). */
export function scoreOf(results: Pick<CheckResult, "result">[]): number {
  const checked = results.filter((r) => r.result !== "na");
  return checked.length ? Math.round((100 * checked.filter((r) => r.result === "ok").length) / checked.length) : 100;
}
