/**
 * Use case: submit a done checklist (S39-02). Steps: every line answered,
 * photos where a failed line needs one, raise a fault for each failed line
 * that asks for it, then save the run with its score and audit it.
 */

import type { StaffRef } from "@igongo/contracts/hr-records";
import { AppError, hotelDate, newId, recordChange } from "@igongo/core";
import { scoreOf, type CheckResult, type Result } from "../../domain/check-result";
import type { Checklist } from "../../domain/checklist";
import type { InspectionRun } from "../../domain/inspection-run";
import type { InspectionsDeps } from "../inspections-deps";

/** What the inspector sends for each line. */
export interface AnswerInput {
  key: string;
  result: Result;
  note: string | null;
  photoIds: string[];
}

export async function submitRun(deps: InspectionsDeps, checklist: Checklist, inspector: { userId: string; name: string; staff: StaffRef | null }, answers: AnswerInput[], note: string | null): Promise<InspectionRun> {
  if (!checklist.active) throw new AppError("conflict", "This checklist is switched off.");
  const byKey = new Map(answers.map((a) => [a.key, a]));
  // 1. Every line answered, and photos where needed.
  const missing = checklist.items.filter((i) => !byKey.has(i.key));
  if (missing.length) throw new AppError("bad_request", `Answer every line: ${missing.map((i) => i.label).join(", ")}.`);
  const allPhotos = answers.flatMap((a) => a.photoIds);
  if ((await deps.files.known(allPhotos)).length !== new Set(allPhotos).size) throw new AppError("bad_request", "One of the photos was not found. Upload it again.");
  for (const item of checklist.items) {
    const a = byKey.get(item.key);
    if (a?.result === "fault" && item.photoOnFail && !a.photoIds.length) throw new AppError("bad_request", `Add a photo for "${item.label}".`);
  }
  const id = newId("ins");
  const now = deps.change.now;
  // 2. Faults for failed lines that ask for one (skipped while Faults is off).
  const results: CheckResult[] = [];
  for (const item of checklist.items) {
    const a = byKey.get(item.key) as AnswerInput;
    let faultNumber: string | null = null;
    if (a.result === "fault" && item.raiseFault && deps.faults) {
      const raised = await deps.faults.report({
        title: `${item.label} (${checklist.name})`,
        description: a.note ?? "Failed during the checkup.",
        location: null,
        department: checklist.department,
        priority: "normal",
        photoIds: a.photoIds,
        reporter: { userId: inspector.userId, name: inspector.name, staffId: inspector.staff?.staffId ?? null },
        source: { module: "inspections", recordId: id },
      });
      faultNumber = raised.number;
    }
    results.push({ key: item.key, label: item.label, result: a.result, note: a.note, photoIds: a.photoIds, faultNumber });
  }
  // 3. The run, with its score.
  const run: InspectionRun = {
    id,
    checklistId: checklist.id,
    checklistName: checklist.name,
    department: checklist.department,
    workDate: hotelDate(now),
    inspectorUserId: inspector.userId,
    inspectorStaffId: inspector.staff?.staffId ?? null,
    inspectorName: inspector.name,
    results,
    score: scoreOf(results),
    faults: results.filter((r) => r.result === "fault").length,
    note,
    submittedAt: now,
  };
  await deps.inspections.addRun(run);
  await recordChange(deps.change, { module: "inspections", action: "inspection.submitted", recordType: "inspection", recordId: id, summary: `Did "${checklist.name}": ${run.score}% passed, ${run.faults} faults` });
  return run;
}
