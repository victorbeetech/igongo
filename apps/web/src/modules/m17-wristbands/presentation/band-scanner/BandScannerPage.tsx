"use client";
// S17-07 Band scanner: the event door. Tap or scan a band (or type its
// number) and get a clear verdict: let in, wrong event, not given out,
// blocked or unknown. Every scan is logged.

import { useState } from "react";
import { useScanBand, VERDICT_WORDS } from "@/modules/m17-wristbands/data/bandsApi";
import type { ScreenContext } from "@/shared/catalog/types";
import { PurposeText } from "@/shared/screens/parts/PurposeText";
import { Card } from "@/shared/ui/card/Card";
import { StatusChip } from "@/shared/ui/chip/StatusChip";
import { TextInput } from "@/shared/ui/field/TextInput";
import { ScanEntry } from "@/shared/ui/scan/ScanEntry";
import type { Scan } from "@/shared/ui/scan/scanOf";

/** A short number typed by hand is a band number; anything else is a chip or QR. */
function bandScan(s: Scan): Record<string, unknown> {
  return "uid" in s && /^\d{1,6}$/.test(s.uid) ? { bandNumber: Number(s.uid) } : s;
}

/** The band scanner. */
export function BandScannerPage({ screen }: { screen: ScreenContext }) {
  const scan = useScanBand();
  const [eventKey, setEventKey] = useState("");
  const verdict = scan.data;
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <div className="grid gap-3 p-4">
        <TextInput label="Event key at this door (optional, such as wedding-5-dec)" value={eventKey} onChange={setEventKey} />
        <ScanEntry action="Check band" busy={scan.isPending} onScan={(s) => scan.mutate({ ...bandScan(s), ...(eventKey ? { eventKey } : {}) })} />
        {verdict && (
          <Card>
            <StatusChip status={verdict.result === "ok" ? "Passed" : "Refused"} />
            <p className="mt-1 text-title font-bold">{VERDICT_WORDS[verdict.result]}</p>
            {verdict.band && <p className="text-body">Band {verdict.band.bandNumber}{verdict.band.eventName ? ` · ${verdict.band.eventName}` : ""}</p>}
          </Card>
        )}
      </div>
    </>
  );
}
