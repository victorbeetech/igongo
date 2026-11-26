"use client";
// S81-04 Saved reports and S81-05 Scheduled reports: my reports (everyone's
// for those who see every area), each with its schedule, runs and removal.
// The scheduled page shows only those that run by themselves at 7 AM.
// A run opens over the list (`?run=` in the address).

import { useSavedReports } from "@/modules/m81-reports-analytics/data/savedReportsApi";
import { LiveData } from "@/shared/api/LiveData";
import type { ScreenContext } from "@/shared/catalog/types";
import { hrefFor } from "@/shared/navigation/hrefFor";
import { useAddress } from "@/shared/navigation/useAddress";
import { PurposeText } from "@/shared/screens/parts/PurposeText";
import { Button } from "@/shared/ui/button/Button";
import { RunView } from "./RunView";
import { SavedReportRow } from "./SavedReportRow";

/** The list; [scheduledOnly] for S81-05. */
export function SavedReportsPage({ screen, scheduledOnly = false }: { screen: ScreenContext; scheduledOnly?: boolean }) {
  const saved = useSavedReports();
  const address = useAddress();
  const runId = address.params.get("run");
  const openRun = (id: string) => address.push(`${address.path}?run=${id}`);
  if (runId) return <RunView id={runId} onClose={() => address.replace(address.path)} />;
  return (
    <>
      <PurposeText text={scheduledOnly ? "Reports that run by themselves at 7 AM Kampala time. Each run is kept here to read or download." : screen.spec.purpose} />
      <div className="grid gap-3 p-4">
        <div>
          <Button href={hrefFor("S81-03", address.path)}>New report</Button>
        </div>
        <LiveData query={saved} name={screen.spec.name} isEmpty={(d) => !d.reports.some((r) => !scheduledOnly || r.schedule !== "none")}>
          {(d) => (
            <>
              {d.reports.filter((r) => !scheduledOnly || r.schedule !== "none").map((r) => <SavedReportRow key={r.id} report={r} onOpenRun={openRun} />)}
            </>
          )}
        </LiveData>
      </div>
    </>
  );
}
