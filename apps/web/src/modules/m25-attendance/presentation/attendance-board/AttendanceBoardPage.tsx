"use client";
// S25-04 Attendance today (with S25-05 board) and S25-06 On site now: every
// person in my scope with their first in, last out, time on site and late
// mark; absent people are listed too. "On site now" refreshes every 30 s.

import { useState } from "react";
import { hoursOf, timeOf, useBoard, useOnSite, type BoardRow } from "@/modules/m25-attendance/data/attendanceApi";
import { LiveData } from "@/shared/api/LiveData";
import type { ScreenContext } from "@/shared/catalog/types";
import { PurposeText } from "@/shared/screens/parts/PurposeText";
import { StatusChip } from "@/shared/ui/chip/StatusChip";
import { TextInput } from "@/shared/ui/field/TextInput";
import { KpiCard } from "@/shared/ui/kpi/KpiCard";
import { DataTable } from "@/shared/ui/table/DataTable";

/** The state word for a row. */
function stateOf(r: BoardRow): string {
  if (r.state === "absent") return "Absent";
  if (r.onSite) return r.late ? "Late" : "On site";
  return "Clocked out";
}

/** The table of rows, shared by both pages. */
function Board({ rows }: { rows: BoardRow[] }) {
  return (
    <DataTable
      rows={rows}
      rowKey={(r) => r.staff.staffId}
      columns={[
        { label: "Name", cell: (r) => r.staff.name },
        { label: "Department", cell: (r) => r.staff.department ?? "—" },
        { label: "In", cell: (r) => timeOf(r.firstIn) },
        { label: "Out", cell: (r) => timeOf(r.lastOut) },
        { label: "On site", cell: (r) => (r.state === "present" ? hoursOf(r.minutesOnSite) : "—") },
        { label: "State", cell: (r) => <StatusChip status={stateOf(r)} /> },
      ]}
    />
  );
}

/** S25-04: the day's board, any day. */
export function AttendanceBoardPage({ screen }: { screen: ScreenContext }) {
  const [date, setDate] = useState("");
  const board = useBoard(date);
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <div className="grid gap-3 p-4">
        <TextInput label="Day (empty for today)" type="date" value={date} onChange={setDate} />
        <LiveData query={board} name="Attendance">
          {(d) => (
            <>
              <div className="grid grid-cols-3 gap-2">
                <KpiCard label="Present" value={String(d.rows.filter((r) => r.state === "present").length)} />
                <KpiCard label="Late" value={String(d.rows.filter((r) => r.late).length)} />
                <KpiCard label="Absent" value={String(d.rows.filter((r) => r.state === "absent").length)} />
              </div>
              <Board rows={d.rows} />
            </>
          )}
        </LiveData>
      </div>
    </>
  );
}

/** S25-06: who is on site right now. */
export function OnSitePage({ screen }: { screen: ScreenContext }) {
  const onSite = useOnSite();
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <div className="grid gap-3 p-4">
        <LiveData query={onSite} name="People on site">{(d) => <><KpiCard label="On site now" value={String(d.rows.length)} /><Board rows={d.rows} /></>}</LiveData>
      </div>
    </>
  );
}
