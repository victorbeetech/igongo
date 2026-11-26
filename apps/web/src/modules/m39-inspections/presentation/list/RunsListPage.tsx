"use client";
// S39-04 Inspections list: done checkups in my scope, newest first.

import { useLikeRun, useRuns } from "@/modules/m39-inspections/data/inspectionsApi";
import { LiveData } from "@/shared/api/LiveData";
import { catalog } from "@/shared/catalog/catalogIndex";
import type { ScreenContext } from "@/shared/catalog/types";
import { dayTimeOf } from "@/shared/format/when";
import { recordHref } from "@/shared/navigation/recordId";
import { PurposeText } from "@/shared/screens/parts/PurposeText";
import { DataTable } from "@/shared/ui/table/DataTable";
import { LikeButton } from "@/shared/ui/social/LikeButton";

/** The list. */
export function RunsListPage({ screen }: { screen: ScreenContext }) {
  const runs = useRuns();
  const like = useLikeRun();
  const result = catalog.screen("S39-03")!;
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <LiveData query={runs} name="Checkups" isEmpty={(d) => d.items.length === 0}>
        {(d) => (
          <div className="p-4">
            <DataTable
              rows={d.items}
              rowKey={(r) => r.id}
              columns={[
                { label: "Checklist", cell: (r) => <a href={recordHref(result, r.id)} className="text-primary-text">{r.checklistName}</a> },
                { label: "Department", cell: (r) => r.department },
                { label: "By", cell: (r) => r.inspectorName },
                { label: "When", cell: (r) => dayTimeOf(r.submittedAt) },
                { label: "Score", cell: (r) => `${r.score}%` },
                { label: "Faults", cell: (r) => r.faults },
                { label: "Likes", cell: (r) => (d.settings.likesEnabled ? <LikeButton likes={r.likes} liked={r.likedByMe} disabled={!d.can.like} onClick={() => like.mutate(r.id)} /> : "—") },
                { label: "Comments", cell: (r) => (d.settings.commentsEnabled ? r.comments : "—") },
              ]}
            />
          </div>
        )}
      </LiveData>
    </>
  );
}
