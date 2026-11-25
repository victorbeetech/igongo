"use client";
// S25-03 My attendance: my days over the last month, with in, out, time on
// site and late marks.

import { hoursOf, timeOf, useMyDays } from "@/modules/m25-attendance/data/attendanceApi";
import { LiveData } from "@/shared/api/LiveData";
import type { ScreenContext } from "@/shared/catalog/types";
import { PurposeText } from "@/shared/screens/parts/PurposeText";
import { StatusChip } from "@/shared/ui/chip/StatusChip";
import { DataTable } from "@/shared/ui/table/DataTable";

/** YYYY-MM-DD of [d]. */
const day = (d: Date) => d.toISOString().slice(0, 10);

/** My attendance for the last 31 days. */
export function MyAttendancePage({ screen }: { screen: ScreenContext }) {
  const to = new Date();
  const days = useMyDays(day(new Date(to.getTime() - 30 * 86400000)), day(new Date(to.getTime() + 86400000)));
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <div className="p-4">
        <LiveData query={days} name="Your attendance" isEmpty={(d) => d.days.length === 0}>
          {(d) => (
            <DataTable
              rows={[...d.days].reverse()}
              rowKey={(r) => r.workDate}
              columns={[
                { label: "Day", cell: (r) => r.workDate },
                { label: "In", cell: (r) => timeOf(r.firstIn) },
                { label: "Out", cell: (r) => timeOf(r.lastOut) },
                { label: "On site", cell: (r) => hoursOf(r.minutesOnSite) },
                { label: "", cell: (r) => <StatusChip status={r.late ? "Late" : "On time"} /> },
              ]}
            />
          )}
        </LiveData>
      </div>
    </>
  );
}
