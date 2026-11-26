/**
 * Receipts and invoices (module 78) of the Igongo API. The gateway imports only
 * this file. See modules/receipts-invoicing/README.md.
 */

import type { StaffDirectory } from "@igongo/contracts/hr-records";
import type { ChangeContext, Database } from "@igongo/core";
import { recordKpis, recordsDeps, recordsRouter, type RecordsDeps } from "@igongo/records-kit";
import { receiptsInvoicingModule } from "./domain/receipts-invoicing-module";
import { receiptsInvoicingTables } from "./infrastructure/db/schema";

export { receiptsInvoicingModule };

/** This module's dependencies for one request. [staff] is null while HR Records is off. */
export const receiptsInvoicingDeps = (db: Database, change: ChangeContext, staff: StaffDirectory | null): RecordsDeps => recordsDeps(receiptsInvoicingModule, receiptsInvoicingTables, db, change, staff);

/** The routes, mounted at `/api/documents`. */
export const receiptsInvoicingRouter = (deps: Parameters<typeof recordsRouter>[1]) => recordsRouter(receiptsInvoicingModule.key, deps);

/** This module's numbers for the management dashboard. */
export const receiptsInvoicingKpis = (db: Database) => recordKpis(receiptsInvoicingModule, receiptsInvoicingTables, db, "Receipts and invoices");
