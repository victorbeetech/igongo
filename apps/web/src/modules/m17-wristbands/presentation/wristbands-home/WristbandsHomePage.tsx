"use client";
// S17-01 Wristbands home (with S17-03 Register bands and S17-06 Assign
// range): stock counts, bands out per event, and the three range actions.
// Bands are registered once, then given to an event by number range and
// taken back after it.

import { useState } from "react";
import { BAND_STATUS_WORDS, useBandSummary, useRangeAction } from "@/modules/m17-wristbands/data/bandsApi";
import { LiveData } from "@/shared/api/LiveData";
import type { ScreenContext } from "@/shared/catalog/types";
import { PurposeText } from "@/shared/screens/parts/PurposeText";
import { Button } from "@/shared/ui/button/Button";
import { Card } from "@/shared/ui/card/Card";
import { TextInput } from "@/shared/ui/field/TextInput";
import { KpiCard } from "@/shared/ui/kpi/KpiCard";
import { SectionHeader } from "@/shared/ui/section/SectionHeader";
import { DataTable } from "@/shared/ui/table/DataTable";

/** The wristbands home. */
export function WristbandsHomePage({ screen }: { screen: ScreenContext }) {
  const summary = useBandSummary();
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <div className="grid gap-4 p-4">
        <LiveData query={summary} name="Wristbands">
          {(d) => (
            <>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {(Object.keys(BAND_STATUS_WORDS) as (keyof typeof BAND_STATUS_WORDS)[]).map((k) => <KpiCard key={k} label={BAND_STATUS_WORDS[k]} value={String(d.byStatus[k])} />)}
              </div>
              <SectionHeader title="Out at events" />
              <DataTable rows={d.events} rowKey={(e) => e.eventKey} empty="No bands are out." columns={[{ label: "Event", cell: (e) => e.eventName ?? e.eventKey }, { label: "Bands", cell: (e) => e.count }]} />
            </>
          )}
        </LiveData>
        <RangeForm title="Register new bands" action="register-range" button="Register" />
        <RangeForm title="Give a range to an event" action="assign-range" button="Assign" withEvent />
        <RangeForm title="Take a range back after an event" action="reset-range" button="Back to stock" />
      </div>
    </>
  );
}

/** One range action: from, to and (for assigning) the event. */
function RangeForm({ title, action, button, withEvent }: { title: string; action: "register-range" | "assign-range" | "reset-range"; button: string; withEvent?: boolean }) {
  const run = useRangeAction(action);
  const [v, setV] = useState({ from: "", to: "", eventName: "" });
  // The event key is made from its name: "Wedding, 5 Dec" -> "wedding-5-dec".
  const eventKey = v.eventName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return (
    <Card>
      <form className="grid gap-2 sm:grid-cols-4 sm:items-end" onSubmit={(e) => { e.preventDefault(); run.mutate({ from: Number(v.from), to: Number(v.to), ...(withEvent ? { eventKey, eventName: v.eventName } : {}) }); }}>
        <p className="text-label font-bold sm:col-span-4">{title}</p>
        <TextInput label="From number" type="number" value={v.from} onChange={(from) => setV({ ...v, from })} required />
        <TextInput label="To number" type="number" value={v.to} onChange={(to) => setV({ ...v, to })} required />
        {withEvent && <TextInput label="Event name" value={v.eventName} onChange={(eventName) => setV({ ...v, eventName })} required />}
        <Button type="submit" disabled={run.isPending}>{button}</Button>
        {run.data && <p role="status" className="text-caption sm:col-span-4">{Object.entries(run.data).map(([k, n]) => `${k}: ${n}`).join(", ")}</p>}
      </form>
    </Card>
  );
}
