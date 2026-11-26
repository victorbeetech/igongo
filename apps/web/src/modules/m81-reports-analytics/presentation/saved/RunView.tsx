"use client";
// One past run of a saved report: its days and numbers as they were, with
// a spreadsheet download.

import { useRun } from "@/modules/m81-reports-analytics/data/savedReportsApi";
import { downloadFile } from "@/shared/api/downloadFile";
import { LiveData } from "@/shared/api/LiveData";
import { Button } from "@/shared/ui/button/Button";
import { KpiGroups } from "../parts/KpiGroups";

/** The run [id], with a way back to the list. */
export function RunView({ id, onClose }: { id: string; onClose: () => void }) {
  const run = useRun(id);
  return (
    <div className="grid gap-3 p-4">
      <div className="flex flex-wrap gap-2">
        <Button variant="text" onClick={onClose}>Back to reports</Button>
        <Button variant="secondary" onClick={() => void downloadFile(`/api/reports/runs/${id}/export.csv`, "report.csv")}>Download spreadsheet</Button>
      </div>
      <LiveData query={run} name="Report">
        {(r) => (
          <>
            <p className="text-subtitle font-bold">{r.reportName}</p>
            <p className="text-caption text-muted">
              {r.fromDay === r.toDay ? `Hotel day ${r.fromDay}` : `Hotel days ${r.fromDay} to ${r.toDay}`} · {r.trigger === "schedule" ? "Ran at 7 AM" : "Run by hand"} {new Date(r.ranAt).toLocaleString("en-UG")}
            </p>
            {r.groups.length ? <KpiGroups groups={r.groups} /> : <p className="text-caption text-muted">This run had no areas to show.</p>}
          </>
        )}
      </LiveData>
    </div>
  );
}
