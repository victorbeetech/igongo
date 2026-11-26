/**
 * Payroll (module 28) of the Igongo API. The gateway imports only this file.
 * See modules/payroll/README.md.
 */

export type { PayrollDeps } from "./application/payroll-deps";
export { computePayslip, sumOf } from "./domain/compute-payslip";
export { bandTax, deductionOf, type DeductionRule } from "./domain/deduction-rule";
export type { PayRun } from "./domain/pay-run";
export type { Payslip } from "./domain/payslip";
export { DEFAULT_PAYROLL_SETTINGS, type PayrollSettings } from "./domain/payroll-settings";
export { DrizzlePayrollRepository } from "./infrastructure/db/drizzle-payroll-repository";
export { SettingsPayrollStore } from "./infrastructure/db/settings-payroll-store";
export { payHistory } from "./infrastructure/pay-history";
export { payrollKpis } from "./infrastructure/payroll-kpis";
export { PAYROLL_PERMISSIONS } from "./presentation/permissions";
export { payrollRouter } from "./presentation/payroll-router";
