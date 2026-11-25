"use client";
// S25-01 Clock in (and S25-02 Clock-in result). Two uses on one page:
// - a gate or reception computer with a USB card reader: each tap clocks
//   the holder in or out and shows their name, photo line and the time;
// - anyone on staff: clock yourself in or out (when the rules allow it).

import { useState } from "react";
import { timeOf, useClockSelf, useMyStatus, useStationClock } from "@/modules/m25-attendance/data/attendanceApi";
import { staffLine } from "@/shared/api/types/staffRef";
import type { ScreenContext } from "@/shared/catalog/types";
import { PurposeText } from "@/shared/screens/parts/PurposeText";
import { Button } from "@/shared/ui/button/Button";
import { Card } from "@/shared/ui/card/Card";
import { StatusChip } from "@/shared/ui/chip/StatusChip";
import { TextInput } from "@/shared/ui/field/TextInput";
import { ScanEntry } from "@/shared/ui/scan/ScanEntry";
import { SectionHeader } from "@/shared/ui/section/SectionHeader";

/** The clock-in page. */
export function ClockInPage({ screen }: { screen: ScreenContext }) {
  const [station, setStation] = useState("Main gate");
  const tap = useStationClock();
  const self = useClockSelf();
  const status = useMyStatus();
  const result = tap.data;
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <div className="grid gap-4 p-4">
        <section className="grid gap-2">
          <SectionHeader title="Station (gate or reception)" />
          <TextInput label="This station's name" value={station} onChange={setStation} />
          <ScanEntry action="Clock in or out" busy={tap.isPending} onScan={(scan) => tap.mutate({ ...scan, station })} />
          {result && (
            <Card>
              <StatusChip status={result.event.kind === "in" ? (result.event.late ? "Late" : "On time") : "Clocked out"} />
              <p className="mt-1 text-title font-bold">{result.staff.name}</p>
              <p className="text-body">{staffLine(result.staff)} · {result.event.kind === "in" ? "in" : "out"} at {timeOf(result.event.at)}</p>
            </Card>
          )}
        </section>
        {status.data && (
          <section className="grid gap-2">
            <SectionHeader title="Me" />
            <p className="text-body">You are {status.data.clockedIn ? "clocked in" : "clocked out"}{status.data.last ? ` since ${timeOf(status.data.last.at)}` : ""}.</p>
            {status.data.rules.allowAppClock && <Button onClick={() => self.mutate(undefined)} disabled={self.isPending}>{status.data.clockedIn ? "Clock me out" : "Clock me in"}</Button>}
          </section>
        )}
      </div>
    </>
  );
}
