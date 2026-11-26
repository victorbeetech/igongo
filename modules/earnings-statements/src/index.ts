/**
 * Earnings Statements (module 29) of the Igongo API: payslips and the
 * lifetime earnings statement. The gateway imports only this file.
 */

export type { EarningsDeps } from "./application/earnings-deps";
export { buildStatement } from "./domain/build-statement";
export type { EarningsStatement } from "./domain/earnings-statement";
export { EARNINGS_PERMISSIONS } from "./presentation/permissions";
export { earningsRouter } from "./presentation/earnings-router";
