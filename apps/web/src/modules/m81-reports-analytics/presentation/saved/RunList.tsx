"use client";
// A saved report's past runs, newest first; each opens its numbers.

import { useRuns } from "@/modules/m81-reports-analytics/data/savedReportsApi";
import { LiveData } from "@/shared/api/LiveData";
import { Button } from "@/shared/ui/button/Button";

/** The runs of report [id]; [onOpen] shows one. */
export function RunList({ id, onOpen }: { id: string; onOpen: (runId: string) => void }) {
  const runs = useRuns(id);
  return (
    <LiveData query={runs} name="Past runs" isEmpty={(d) => d.runs.length === 0}>
      {(d) => (
        <ul className="grid gap-1">
          {d.runs.map((r) => (
            <li key={r.id} className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-caption">
                {r.fromDay === r.toDay ? r.fromDay : `${r.fromDay} to ${r.toDay}`} · {r.trigger === "schedule" ? "7 AM run" : "by hand"}
              </span>
              <Button variant="text" onClick={() => onOpen(r.id)}>Open</Button>
            </li>
          ))}
        </ul>
      )}
    </LiveData>
  );
}
