/**
 * Payroll HTTP routes, mounted by the gateway at `/api/payroll`. All are
 * staff tools (scope wider than own).
 *
 *   GET   /payroll/profiles                 active staff with their pay profile     S28-01
 *   PUT   /payroll/profiles/:staffId        set one                                 S28-01
 *   GET   /payroll/runs                     pay runs, newest first                  S28-02
 *   POST  /payroll/runs                     start a month                           S28-02
 *   GET   /payroll/runs/:id                 one run with its payslips               S28-03
 *   GET   /payroll/runs/:id/export.csv      the run as a spreadsheet                S28-07
 *   POST  /payroll/runs/:id/recalculate     rebuild a draft                         S28-02
 *   POST  /payroll/runs/:id/approve         lock it                                 S28-04
 *   POST  /payroll/runs/:id/paid            mark paid (settles bonuses, advances)   S28-05
 *   POST  /payroll/runs/:id/cancel          cancel
 *   PUT   /payroll/payslips/:id/adjustments manual lines on one payslip             S28-03
 *   GET   /payroll/settings                 deductions and approval rule            S28-06
 *   PUT   /payroll/settings                 change them                             S28-06
 */

import { zValidator } from "@hono/zod-validator";
import { actorOf, AppError, recordChange, requireStaffPermission, toCsv, type ActorEnv } from "@igongo/core";
import { Hono, type Context } from "hono";
import type { PayrollDeps } from "../application/payroll-deps";
import { adjustPayslip, approvePayRun, cancelPayRun, markPayRunPaid, recalculatePayRun, startPayRun } from "../application/use-cases/pay-run-steps";
import type { PayRun } from "../domain/pay-run";
import { PAYROLL_PERMISSIONS as P } from "./permissions";
import { adjustBody, profileBody, runBody, settingsBody } from "./request-schemas";

export function payrollRouter(deps: (c: Context<ActorEnv>) => PayrollDeps) {
  /** The caller as a change author. */
  const by = (c: Context<ActorEnv>) => ({ userId: actorOf(c).userId, name: actorOf(c).name });

  /** The run in the address. @throws AppError `not_found` */
  async function runOf(c: Context<ActorEnv>): Promise<PayRun> {
    const run = await deps(c).payroll.run(c.req.param("id") as string);
    if (!run) throw new AppError("not_found", "Pay run not found.");
    return run;
  }

  return (
    new Hono<ActorEnv>()
      .get("/profiles", requireStaffPermission(P.profilesView), async (c) => {
        const d = deps(c);
        const profiles = new Map((await d.payroll.profiles()).map((p) => [p.staffId, p]));
        // Everyone active, with or without a profile, so nobody is forgotten.
        const items = (await d.staff.active()).map((s) => ({ staff: s, profile: profiles.get(s.staffId) ?? null }));
        // Pay is sensitive: every look at it is logged.
        await recordChange(d.change, { module: "payroll", action: "profiles.viewed", recordType: "pay_profile", summary: "Viewed everyone's pay profiles" });
        return c.json({ items });
      })
      .put("/profiles/:staffId", requireStaffPermission(P.profilesEdit), zValidator("json", profileBody), async (c) => {
        const d = deps(c);
        const staff = await d.staff.byId(c.req.param("staffId"));
        if (!staff) throw new AppError("not_found", "Staff member not found.");
        const before = await d.payroll.profile(staff.staffId);
        const profile = { staffId: staff.staffId, ...c.req.valid("json"), updatedAt: d.change.now };
        await d.payroll.saveProfile(profile);
        await recordChange(d.change, {
          module: "payroll",
          action: "profile.changed",
          recordType: "pay_profile",
          recordId: staff.staffId,
          summary: `Set ${staff.name}'s pay: basic ${profile.basic} UGX`,
          changes: { basic: { old: before?.basic ?? null, new: profile.basic } },
        });
        return c.json(profile);
      })
      .get("/runs", requireStaffPermission(P.view), async (c) => c.json({ items: await deps(c).payroll.runs(60) }))
      .post("/runs", requireStaffPermission(P.create), zValidator("json", runBody), async (c) => c.json(await startPayRun(deps(c), c.req.valid("json").period, by(c)), 201))
      .get("/runs/:id", requireStaffPermission(P.view), async (c) => {
        const run = await runOf(c);
        await recordChange(deps(c).change, { module: "payroll", action: "payrun.viewed", recordType: "payrun", recordId: run.id, summary: `Viewed the ${run.period} pay run and its payslips` });
        return c.json({ run, payslips: await deps(c).payroll.payslips(run.id) });
      })
      .get("/runs/:id/export.csv", requireStaffPermission(P.export), async (c) => {
        const d = deps(c);
        const run = await runOf(c);
        const slips = await d.payroll.payslips(run.id);
        const rows = [["Staff number", "Name", "Department", "Basic", "Gross", "Deductions", "Net", "Lines"], ...slips.map((p) => [p.staffNumber, p.staffName, p.department, p.basic, p.gross, p.totalDeductions, p.net, [...p.earnings, ...p.deductions.map((l) => ({ ...l, amount: -l.amount }))].map((l) => `${l.name} ${l.amount}`).join("; ")])];
        await recordChange(d.change, { module: "payroll", action: "payrun.exported", recordType: "payrun", recordId: run.id, summary: `Exported the ${run.period} pay run` });
        return c.body(toCsv(rows), 200, { "content-type": "text/csv; charset=utf-8", "content-disposition": `attachment; filename="payroll-${run.period}.csv"` });
      })
      .post("/runs/:id/recalculate", requireStaffPermission(P.create), async (c) => c.json(await recalculatePayRun(deps(c), await runOf(c))))
      .post("/runs/:id/approve", requireStaffPermission(P.approve), async (c) => c.json(await approvePayRun(deps(c), await runOf(c), by(c))))
      .post("/runs/:id/paid", requireStaffPermission(P.edit), async (c) => c.json(await markPayRunPaid(deps(c), await runOf(c), by(c))))
      .post("/runs/:id/cancel", requireStaffPermission(P.edit), async (c) => c.json(await cancelPayRun(deps(c), await runOf(c), by(c))))
      .put("/payslips/:id/adjustments", requireStaffPermission(P.edit), zValidator("json", adjustBody), async (c) => {
        const d = deps(c);
        const slip = await d.payroll.payslip(c.req.param("id"));
        if (!slip) throw new AppError("not_found", "Payslip not found.");
        return c.json(await adjustPayslip(d, slip, c.req.valid("json").adjustments));
      })
      .get("/settings", requireStaffPermission(P.view), async (c) => c.json(await deps(c).settings.read()))
      .put("/settings", requireStaffPermission(P.settings), zValidator("json", settingsBody), async (c) => {
        const d = deps(c);
        const value = c.req.valid("json");
        await d.settings.write(value, d.change.actorId, d.change.now);
        await recordChange(d.change, { module: "payroll", action: "settings.changed", recordType: "settings", recordId: "settings", summary: `Payroll deductions: ${value.deductions.map((r) => r.name).join(", ") || "none"}` });
        return c.json(value);
      })
  );
}
