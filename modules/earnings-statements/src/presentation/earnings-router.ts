/**
 * Earnings Statements HTTP routes, mounted by the gateway at `/api/earnings`.
 *
 *   GET  /earnings/mine                    my lifetime statement and payslips   S29-01, S29-02
 *   GET  /earnings/mine/payslips/:id       one of my payslips                   S29-01
 *   GET  /earnings/mine/export.csv         my statement as a spreadsheet        S29-03
 *   GET  /earnings/staff/:staffId          someone's statement (staff tool)     S29-04
 *   GET  /earnings/staff/:staffId/export.csv
 */

import type { StaffRef } from "@igongo/contracts/hr-records";
import { actorOf, AppError, recordChange, requirePermission, requireStaffPermission, scopeReaches, staffScope, type ActorEnv } from "@igongo/core";
import { Hono, type Context } from "hono";
import type { EarningsDeps } from "../application/earnings-deps";
import { statementCsv } from "../application/use-cases/statement-csv";
import { statementFor } from "../application/use-cases/statement-for";
import { EARNINGS_PERMISSIONS as P } from "./permissions";

export function earningsRouter(deps: (c: Context<ActorEnv>) => EarningsDeps) {
  /** The caller's own staff record. @throws AppError `not_found` */
  async function self(c: Context<ActorEnv>): Promise<StaffRef> {
    const me = await deps(c).staff.byUserId(actorOf(c).userId);
    if (!me) throw new AppError("not_found", "Your account is not linked to a staff record yet. Ask HR.");
    return me;
  }

  /** The staff member in the address, if [permission]'s scope reaches them. @throws AppError `not_found` */
  async function other(c: Context<ActorEnv>, permission: string): Promise<StaffRef> {
    const d = deps(c);
    const staff = await d.staff.byId(c.req.param("staffId") as string);
    const scope = staffScope(actorOf(c), permission, await d.staff.byUserId(actorOf(c).userId));
    if (!staff || !scope || scope.kind === "own" || !scopeReaches(scope, staff)) throw new AppError("not_found", "Staff member not found.");
    return staff;
  }

  /** Sends [csv] as a download and records who took it. */
  async function download(c: Context<ActorEnv>, staff: StaffRef, csv: string) {
    await recordChange(deps(c).change, { module: "earnings-statements", action: "statement.exported", recordType: "staff", recordId: staff.staffId, summary: `Downloaded ${staff.name}'s earnings statement` });
    return c.body(csv, 200, { "content-type": "text/csv; charset=utf-8", "content-disposition": `attachment; filename="earnings-${staff.staffNumber}.csv"` });
  }

  return new Hono<ActorEnv>()
    .get("/mine", requirePermission(P.view), async (c) => c.json(await statementFor(deps(c), await self(c))))
    .get("/mine/payslips/:id", requirePermission(P.view), async (c) => {
      const s = await statementFor(deps(c), await self(c));
      const slip = s.payslips.find((p) => p.payslipId === c.req.param("id"));
      if (!slip) throw new AppError("not_found", "Payslip not found.");
      return c.json(slip);
    })
    .get("/mine/export.csv", requirePermission(P.view), async (c) => {
      const me = await self(c);
      return download(c, me, statementCsv(await statementFor(deps(c), me)));
    })
    .get("/staff/:staffId", requireStaffPermission(P.view), async (c) => c.json(await statementFor(deps(c), await other(c, P.view))))
    .get("/staff/:staffId/export.csv", requireStaffPermission(P.export), async (c) => {
      const staff = await other(c, P.export);
      return download(c, staff, statementCsv(await statementFor(deps(c), staff)));
    });
}
