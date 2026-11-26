"use client";
// A records module's board (dashboards such as the room board, the
// requests board or the security home): how many records sit in each
// status, then the staff list below.

import { LiveData } from "@/shared/api/LiveData";
import type { ScreenContext } from "@/shared/catalog/types";
import { KpiCard } from "@/shared/ui/kpi/KpiCard";
import { useRecordConfig, useRecordSummary } from "../data/recordsApi";
import type { RecordPlace } from "../types/recordPlace";
import { RecordListPage, type ListView } from "./RecordListPage";
import { statusLabel, typesFor } from "./recordWords";

export function RecordBoardPage({ screen, place, view = {} }: { screen: ScreenContext; place: RecordPlace; view?: ListView }) {
  const config = useRecordConfig(place);
  const summary = useRecordSummary(place);
  return (
    <>
      <div className="p-4 pb-0">
        <LiveData query={summary} name="Counts">
          {(s) => {
            const types = config.data ? typesFor(config.data, view.types) : [];
            const rows = s.items.filter((x) => types.some((t) => t.key === x.type) && x.n > 0);
            return (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {rows.map((x) => <KpiCard key={`${x.type}.${x.status}`} label={`${types.length > 1 ? `${types.find((t) => t.key === x.type)?.name}: ` : ""}${statusLabel(types.find((t) => t.key === x.type), x.status)}`} value={String(x.n)} />)}
              </div>
            );
          }}
        </LiveData>
      </div>
      <RecordListPage screen={screen} place={place} view={{ staff: true, ...view }} />
    </>
  );
}
