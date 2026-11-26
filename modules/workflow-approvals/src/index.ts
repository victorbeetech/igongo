/**
 * Approvals (module 9) of the Igongo API. The gateway imports only
 * this file. See modules/workflow-approvals/README.md.
 */

import type { StaffDirectory } from "@igongo/contracts/hr-records";
import type { ChangeContext, Database } from "@igongo/core";
import { recordKpis, recordsDeps, recordsRouter, type RecordsDeps } from "@igongo/records-kit";
import { workflowApprovalsModule } from "./domain/workflow-approvals-module";
import { workflowApprovalsTables } from "./infrastructure/db/schema";

export { workflowApprovalsModule };

/** This module's dependencies for one request. [staff] is null while HR Records is off. */
export const workflowApprovalsDeps = (db: Database, change: ChangeContext, staff: StaffDirectory | null): RecordsDeps => recordsDeps(workflowApprovalsModule, workflowApprovalsTables, db, change, staff);

/** The routes, mounted at `/api/approvals`. */
export const workflowApprovalsRouter = (deps: Parameters<typeof recordsRouter>[1]) => recordsRouter(workflowApprovalsModule.key, deps);

/** This module's numbers for the management dashboard. */
export const workflowApprovalsKpis = (db: Database) => recordKpis(workflowApprovalsModule, workflowApprovalsTables, db, "Approvals");
