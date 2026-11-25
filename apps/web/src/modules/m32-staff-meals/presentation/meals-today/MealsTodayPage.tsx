"use client";
// S32-04 Meals today: how many of each meal were served and to whom
// (refreshes every 30 s). S32-01 Meal today: my own meals today.

import { useMyMeals, useServed } from "@/modules/m32-staff-meals/data/mealsApi";
import { LiveData } from "@/shared/api/LiveData";
import type { ScreenContext } from "@/shared/catalog/types";
import { PurposeText } from "@/shared/screens/parts/PurposeText";
import { StatusChip } from "@/shared/ui/chip/StatusChip";
import { KpiCard } from "@/shared/ui/kpi/KpiCard";
import { ListRow } from "@/shared/ui/list-row/ListRow";
import { DataTable } from "@/shared/ui/table/DataTable";

/** S32-04: everything served today. */
export function MealsTodayPage({ screen }: { screen: ScreenContext }) {
  const served = useServed();
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <div className="grid gap-3 p-4">
        <LiveData query={served} name="Meals">
          {(d) => (
            <>
              <div className="grid grid-cols-3 gap-2">{Object.entries(d.counts).map(([k, n]) => <KpiCard key={k} label={k} value={String(n)} />)}</div>
              <DataTable rows={d.items} rowKey={(c) => c.id} empty="No meals served yet today." columns={[{ label: "Time", cell: (c) => new Date(c.at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }, { label: "Meal", cell: (c) => c.mealKey }, { label: "Name", cell: (c) => c.staff?.name ?? "—" }, { label: "Department", cell: (c) => c.staff?.department ?? "—" }]} />
            </>
          )}
        </LiveData>
      </div>
    </>
  );
}

/** S32-01: my meals today. */
export function MyMealsPage({ screen }: { screen: ScreenContext }) {
  const mine = useMyMeals();
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <div className="p-4">
        <LiveData query={mine} name="Your meals">
          {(d) => (
            <ul className="grid rounded-md border border-line bg-surface">
              {d.meals.map((m) => (
                <li key={m.key}>
                  <ListRow title={m.name} subtitle={`${m.startsAt} to ${m.endsAt}`} leading={m.servedAt ? <StatusChip status="Claimed" /> : undefined} status={m.servedAt ? "Done" : m.openNow ? "Open" : "Upcoming"} />
                </li>
              ))}
            </ul>
          )}
        </LiveData>
      </div>
    </>
  );
}
