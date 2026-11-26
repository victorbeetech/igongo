/**
 * Use cases for a pay run's life (S28-02 to S28-05): start, recalculate,
 * adjust one payslip, approve, mark paid (settling bonuses and advance
 * instalments in their own modules), and cancel. Every step is audited.
 */

import type { PayLine } from "@igongo/contracts/payroll";
import { AppError, newId, recordChange } from "@igongo/core";
import { computePayslip } from "../../domain/compute-payslip";
import type { PayRun, RunStatus } from "../../domain/pay-run";
import type { Payslip } from "../../domain/payslip";
import type { PayrollDeps } from "../payroll-deps";
import { buildPayslips } from "./build-payslips";
import { totalsOf } from "./totals-of";

type By = { userId: string; name: string };

/** @throws AppError `conflict` unless [run] is in one of [statuses] */
function mustBe(run: PayRun, ...statuses: RunStatus[]) {
  if (!statuses.includes(run.status)) throw new AppError("conflict", `This pay run is ${run.status}.`);
}

/** Saves [run] and records [summary]. */
async function step(deps: PayrollDeps, run: PayRun, action: string, summary: string): Promise<PayRun> {
  await deps.payroll.saveRun(run);
  await recordChange(deps.change, { module: "payroll", action: `payrun.${action}`, recordType: "payrun", recordId: run.id, summary });
  return run;
}

/** Starts the pay run of [period]. @throws AppError `conflict` when the month already has one */
export async function startPayRun(deps: PayrollDeps, period: string, by: By): Promise<PayRun> {
  if (await deps.payroll.liveRunFor(period)) throw new AppError("conflict", `${period} already has a pay run.`);
  const id = newId("run");
  const payslips = await buildPayslips(deps, { id, period }, new Map());
  if (!payslips.length) throw new AppError("bad_request", "Nobody has an active pay profile yet.");
  const run: PayRun = { id, period, status: "draft", ...totalsOf(payslips), createdById: by.userId, createdByName: by.name, createdAt: deps.change.now, approvedByName: null, approvedAt: null, paidByName: null, paidAt: null };
  await deps.payroll.saveRun(run);
  await deps.payroll.replacePayslips(id, payslips);
  await recordChange(deps.change, { module: "payroll", action: "payrun.started", recordType: "payrun", recordId: id, summary: `Started the ${period} pay run: ${run.staffCount} people, net ${run.net} UGX` });
  return run;
}

/** Rebuilds a draft run from today's profiles, bonuses and advances, keeping manual adjustments. */
export async function recalculatePayRun(deps: PayrollDeps, run: PayRun): Promise<PayRun> {
  mustBe(run, "draft");
  const keep = new Map((await deps.payroll.payslips(run.id)).map((p) => [p.staffId, p.adjustments]));
  const payslips = await buildPayslips(deps, run, keep);
  await deps.payroll.replacePayslips(run.id, payslips);
  return step(deps, { ...run, ...totalsOf(payslips) }, "recalculated", `Recalculated the ${run.period} pay run`);
}

/** Sets the manual lines on one payslip of a draft run, and works it out again. */
export async function adjustPayslip(deps: PayrollDeps, payslip: Payslip, adjustments: PayLine[]): Promise<Payslip> {
  const run = await deps.payroll.run(payslip.runId);
  if (!run) throw new AppError("not_found", "Pay run not found.");
  mustBe(run, "draft");
  const profile = await deps.payroll.profile(payslip.staffId);
  if (!profile) throw new AppError("not_found", "Pay profile not found.");
  const bonuses = ((await deps.bonuses?.unpaid()) ?? []).filter((b) => payslip.bonusIds.includes(b.bonusId));
  const next = computePayslip({
    id: payslip.id,
    runId: run.id,
    period: run.period,
    staff: { staffId: payslip.staffId, name: payslip.staffName, staffNumber: payslip.staffNumber, department: payslip.department },
    profile,
    bonuses,
    advances: payslip.advanceLines,
    adjustments,
    rules: (await deps.settings.read()).deductions,
  });
  await deps.payroll.savePayslip(next);
  await step(deps, { ...run, ...totalsOf((await deps.payroll.payslips(run.id)).map((p) => (p.id === next.id ? next : p))) }, "adjusted", `Adjusted ${payslip.staffName}'s ${run.period} payslip`);
  return next;
}

/** Locks a draft run. @throws AppError when the maker approves their own run and the super admin forbids it */
export async function approvePayRun(deps: PayrollDeps, run: PayRun, by: By): Promise<PayRun> {
  mustBe(run, "draft");
  if ((await deps.settings.read()).approverMustDiffer && run.createdById === by.userId) throw new AppError("permission_denied", "Someone other than the maker approves this pay run.");
  return step(deps, { ...run, status: "approved", approvedByName: by.name, approvedAt: deps.change.now }, "approved", `${by.name} approved the ${run.period} pay run (net ${run.net} UGX)`);
}

/** Marks an approved run paid, then settles its bonuses and advance instalments in their modules. */
export async function markPayRunPaid(deps: PayrollDeps, run: PayRun, by: By): Promise<PayRun> {
  mustBe(run, "approved");
  const now = deps.change.now;
  const payslips = await deps.payroll.payslips(run.id);
  const paid = await step(deps, { ...run, status: "paid", paidByName: by.name, paidAt: now }, "paid", `${by.name} marked the ${run.period} pay run paid`);
  await deps.bonuses?.paid(payslips.flatMap((p) => p.bonusIds), run.id, now);
  await deps.advances?.recovered(payslips.flatMap((p) => p.advanceLines), run.period, run.id);
  return paid;
}

/** Cancels a run that is not yet paid. */
export async function cancelPayRun(deps: PayrollDeps, run: PayRun, by: By): Promise<PayRun> {
  mustBe(run, "draft", "approved");
  return step(deps, { ...run, status: "cancelled" }, "cancelled", `${by.name} cancelled the ${run.period} pay run`);
}
