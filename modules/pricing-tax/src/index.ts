/**
 * Prices and taxes (module 76) of the Igongo API. The gateway imports only
 * this file. See modules/pricing-tax/README.md.
 */

import type { StaffDirectory } from "@igongo/contracts/hr-records";
import type { ChangeContext, Database } from "@igongo/core";
import { recordKpis, recordsDeps, recordsRouter, type RecordsDeps } from "@igongo/records-kit";
import { pricingTaxModule } from "./domain/pricing-tax-module";
import { pricingTaxTables } from "./infrastructure/db/schema";

export { pricingTaxModule };

/** This module's dependencies for one request. [staff] is null while HR Records is off. */
export const pricingTaxDeps = (db: Database, change: ChangeContext, staff: StaffDirectory | null): RecordsDeps => recordsDeps(pricingTaxModule, pricingTaxTables, db, change, staff);

/** The routes, mounted at `/api/pricing`. */
export const pricingTaxRouter = (deps: Parameters<typeof recordsRouter>[1]) => recordsRouter(pricingTaxModule.key, deps);

/** This module's numbers for the management dashboard. */
export const pricingTaxKpis = (db: Database) => recordKpis(pricingTaxModule, pricingTaxTables, db, "Prices and taxes");
