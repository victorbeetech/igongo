"use client";
// S39-01 Inspections due: today's (and this week's) checklists for my
// department, with what is already done and its score.

import { useToday } from "@/modules/m39-inspections/data/inspectionsApi";
import { LiveData } from "@/shared/api/LiveData";
import { catalog } from "@/shared/catalog/catalogIndex";
import type { ScreenContext } from "@/shared/catalog/types";
import { recordHref } from "@/shared/navigation/recordId";
import { PurposeText } from "@/shared/screens/parts/PurposeText";
import { ListRow } from "@/shared/ui/list-row/ListRow";

/** The due list. */
export function DuePage({ screen }: { screen: ScreenContext }) {
  const today = useToday();
  const run = catalog.hrefOf(catalog.screen("S39-02")!);
  const result = catalog.screen("S39-03")!;
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <LiveData query={today} name="Checkups due" isEmpty={(d) => d.items.length === 0}>
        {(d) => (
          <div className="grid gap-1 p-4">
            {d.items.map(({ checklist, done }) => (
              <ListRow
                key={checklist.id}
                title={checklist.name}
                subtitle={done ? `Done by ${done.inspectorName} · score ${done.score}%` : `${checklist.frequency === "daily" ? "Today" : "This week"}, by ${checklist.dueBy} · ${checklist.items.length} lines`}
                status={done ? "Done" : "Due"}
                href={done ? recordHref(result, done.id) : `${run}?checklist=${checklist.id}`}
              />
            ))}
          </div>
        )}
      </LiveData>
    </>
  );
}
