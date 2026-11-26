/**
 * Knowledge base (module 48) of the Igongo API. The gateway imports only
 * this file. See modules/knowledge-base/README.md.
 */

import type { StaffDirectory } from "@igongo/contracts/hr-records";
import type { ChangeContext, Database } from "@igongo/core";
import { recordKpis, recordsDeps, recordsRouter, type RecordsDeps } from "@igongo/records-kit";
import { knowledgeBaseModule } from "./domain/knowledge-base-module";
import { knowledgeBaseTables } from "./infrastructure/db/schema";

export { knowledgeBaseModule };

/** This module's dependencies for one request. [staff] is null while HR Records is off. */
export const knowledgeBaseDeps = (db: Database, change: ChangeContext, staff: StaffDirectory | null): RecordsDeps => recordsDeps(knowledgeBaseModule, knowledgeBaseTables, db, change, staff);

/** The routes, mounted at `/api/knowledge`. */
export const knowledgeBaseRouter = (deps: Parameters<typeof recordsRouter>[1]) => recordsRouter(knowledgeBaseModule.key, deps);

/** This module's numbers for the management dashboard. */
export const knowledgeBaseKpis = (db: Database) => recordKpis(knowledgeBaseModule, knowledgeBaseTables, db, "Knowledge base");
