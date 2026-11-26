/**
 * A deduction the super admin sets up (S28-06), such as PAYE (tax bands),
 * NSSF (a percentage, with the employer's share) or a fixed union fee.
 * No rate is built in: each hotel enters the rates its accountant gives.
 */

export const DEDUCTION_KINDS = ["percent", "fixed", "bands"] as const;
export type DeductionKind = (typeof DEDUCTION_KINDS)[number];

/** One tax band: the rate on the part of pay up to [upTo] (null for "and above"). */
export interface TaxBand {
  upTo: number | null;
  /** Percent. */
  rate: number;
}

export interface DeductionRule {
  key: string;
  /** Shown on the payslip, such as "PAYE". */
  name: string;
  kind: DeductionKind;
  /** Percent, for `percent`. */
  rate: number;
  /** UGX, for `fixed`. */
  amount: number;
  /** For `bands`, lowest first. */
  bands: TaxBand[];
  /** What the rate applies to. */
  base: "gross" | "basic";
  /** The employer's own share in percent (such as NSSF's 10%); 0 for none. */
  employerRate: number;
}

/** Progressive tax: each band's rate on the part of [pay] that falls in it. */
export function bandTax(pay: number, bands: TaxBand[]): number {
  let tax = 0;
  let floor = 0;
  for (const band of bands) {
    const top = band.upTo ?? Infinity;
    if (pay > floor) tax += ((Math.min(pay, top) - floor) * band.rate) / 100;
    floor = top;
    if (pay <= top) break;
  }
  return Math.round(tax);
}

/** What [rule] takes from a payslip with [basic] and [gross]. */
export function deductionOf(rule: DeductionRule, basic: number, gross: number): { employee: number; employer: number } {
  const base = rule.base === "basic" ? basic : gross;
  const employee = rule.kind === "fixed" ? rule.amount : rule.kind === "percent" ? Math.round((base * rule.rate) / 100) : bandTax(base, rule.bands);
  return { employee, employer: Math.round((base * rule.employerRate) / 100) };
}
