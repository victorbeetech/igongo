"use client";
// One saved report: its areas, days and schedule (changed in place), run it
// now, see its past runs, or remove it after a second tap.

import { useState } from "react";
import { DAY_CHOICES, SCHEDULE_CHOICES, useRemoveReport, useRunReport, useUpdateReport, type SavedReport } from "@/modules/m81-reports-analytics/data/savedReportsApi";
import { Button } from "@/shared/ui/button/Button";
import { Card } from "@/shared/ui/card/Card";
import { SelectInput } from "@/shared/ui/field/SelectInput";
import { RunList } from "./RunList";

/** The row for [report]; [onOpenRun] shows a run. */
export function SavedReportRow({ report, onOpenRun }: { report: SavedReport; onOpenRun: (runId: string) => void }) {
  const update = useUpdateReport();
  const remove = useRemoveReport();
  const run = useRunReport();
  const [showRuns, setShowRuns] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const change = (patch: Partial<SavedReport>) => update.mutate({ id: report.id, name: report.name, modules: report.modules, days: report.days, schedule: report.schedule, ...patch });
  return (
    <Card>
      <div className="grid gap-2">
        <p className="text-subtitle font-bold">{report.name}</p>
        <p className="text-caption text-muted">
          {report.modules.length ? `${report.modules.length} areas` : "Every area"} · by {report.ownerName} · {report.lastRunAt ? `last run ${new Date(report.lastRunAt).toLocaleString("en-UG")}` : "not run yet"}
        </p>
        <div className="flex flex-wrap gap-2">
          <SelectInput label="Covers" value={String(report.days)} onChange={(v) => change({ days: Number(v) as SavedReport["days"] })} options={DAY_CHOICES} />
          <SelectInput label="Runs" value={report.schedule} onChange={(v) => change({ schedule: v as SavedReport["schedule"] })} options={SCHEDULE_CHOICES} />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button disabled={run.isPending} onClick={() => run.mutate(report.id, { onSuccess: (r) => onOpenRun(r.id) })}>{run.isPending ? "Running…" : "Run now"}</Button>
          <Button variant="secondary" onClick={() => setShowRuns(!showRuns)}>{showRuns ? "Hide past runs" : "Past runs"}</Button>
          {confirming ? (
            <>
              <Button variant="secondary" disabled={remove.isPending} onClick={() => remove.mutate(report.id)}>Yes, remove</Button>
              <Button variant="text" onClick={() => setConfirming(false)}>Keep it</Button>
            </>
          ) : (
            <Button variant="text" onClick={() => setConfirming(true)}>Remove</Button>
          )}
        </div>
        {showRuns && <RunList id={report.id} onOpen={onOpenRun} />}
      </div>
    </Card>
  );
}
