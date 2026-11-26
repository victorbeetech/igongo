"use client";
// S40-02 My faults, S40-03 Fault board and S40-05 Work orders: one list with
// three views. The board also shows counts by status for the HOD's scope.

import { useState } from "react";
import { FAULT_STATUSES, useFaultSummary, useFaults, useLikeFault, type FaultView } from "@/modules/m40-faults-maintenance/data/faultsApi";
import { LiveData } from "@/shared/api/LiveData";
import { catalog } from "@/shared/catalog/catalogIndex";
import type { ScreenContext } from "@/shared/catalog/types";
import { dayTimeOf, words } from "@/shared/format/when";
import { recordHref } from "@/shared/navigation/recordId";
import { PurposeText } from "@/shared/screens/parts/PurposeText";
import { Button } from "@/shared/ui/button/Button";
import { Card } from "@/shared/ui/card/Card";
import { StatusChip } from "@/shared/ui/chip/StatusChip";
import { KpiCard } from "@/shared/ui/kpi/KpiCard";
import { LikeButton } from "@/shared/ui/social/LikeButton";
import { SwitchRow } from "@/shared/ui/switch/SwitchRow";

/** The counts row on the board. */
function Summary() {
  const summary = useFaultSummary();
  const counts = summary.data?.counts ?? {};
  if (Object.keys(counts).length === 0) return null;
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {FAULT_STATUSES.filter((s) => counts[s]).map((s) => <KpiCard key={s} label={words(s)} value={String(counts[s])} />)}
    </div>
  );
}

/** A fault list in the view [view]. */
export function FaultListPage({ screen, view }: { screen: ScreenContext; view: FaultView }) {
  const [openOnly, setOpenOnly] = useState(view !== "reported");
  const faults = useFaults(view, openOnly);
  const like = useLikeFault();
  const detail = catalog.screen("S40-04")!;
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <div className="grid gap-3 p-4">
        {view === "scope" && <Summary />}
        <SwitchRow label="Only faults still needing work" on={openOnly} onChange={setOpenOnly} />
        <LiveData query={faults} name="Faults" isEmpty={(d) => d.items.length === 0}>
          {(d) => (
            <>
              {d.can.report && <div><Button href={catalog.hrefOf(catalog.screen("S40-01")!)}>Report a fault</Button></div>}
              {d.items.map((f) => (
                <Card key={f.id}>
                  <div className="flex flex-wrap items-center gap-2">
                    <a href={recordHref(detail, f.id)} className="text-title font-bold text-primary-text">{`${f.number} · ${f.title}`}</a>
                    <StatusChip status={words(f.status)} />
                    {(f.priority === "high" || f.priority === "urgent") && <StatusChip status={words(f.priority)} />}
                  </div>
                  <p className="text-caption text-muted">
                    {[f.location, f.reportedBy.name, dayTimeOf(f.createdAt), f.assignedTo ? `With ${f.assignedTo.name}` : "Not assigned"].filter(Boolean).join(" · ")}
                  </p>
                  <div className="mt-1 flex items-center gap-3 text-caption">
                    {d.settings.likesEnabled && <LikeButton likes={f.likes} liked={f.likedByMe} disabled={!d.can.like} onClick={() => like.mutate(f.id)} />}
                    {d.settings.commentsEnabled && <span>{`${f.comments} comment${f.comments === 1 ? "" : "s"}`}</span>}
                    {f.photoIds.length > 0 && <span>{`${f.photoIds.length} photo${f.photoIds.length === 1 ? "" : "s"}`}</span>}
                  </div>
                </Card>
              ))}
            </>
          )}
        </LiveData>
      </div>
    </>
  );
}
