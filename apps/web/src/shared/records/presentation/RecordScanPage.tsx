"use client";
// Scan or type a record's code (asset tag, key tag, visitor pass, voucher)
// to open it. The QR text is `IGG-REC:<code>`.

import { useState } from "react";
import { LiveData } from "@/shared/api/LiveData";
import type { ScreenContext } from "@/shared/catalog/types";
import { PurposeText } from "@/shared/screens/parts/PurposeText";
import { ScanEntry } from "@/shared/ui/scan/ScanEntry";
import { useLookupRecord, useRecordConfig } from "../data/recordsApi";
import type { RecordPlace } from "../types/recordPlace";
import { RecordDetail } from "./RecordDetail";

export function RecordScanPage({ screen, place }: { screen: ScreenContext; place: RecordPlace }) {
  const config = useRecordConfig(place);
  const lookup = useLookupRecord(place);
  const [id, setId] = useState("");
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <div className="grid gap-3 p-4">
        <ScanEntry action="Find" busy={lookup.isPending} onScan={(s) => lookup.mutate("qr" in s ? s.qr : s.uid, { onSuccess: (r) => setId(r.id) })} />
        {id && <LiveData query={config} name="Record">{(c) => <RecordDetail place={place} config={c} id={id} staff onClose={() => setId("")} />}</LiveData>}
      </div>
    </>
  );
}
