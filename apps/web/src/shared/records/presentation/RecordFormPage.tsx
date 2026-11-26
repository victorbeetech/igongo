"use client";
// An add page for one or more record types (log a found item, request
// leave, book a transfer, give feedback). After saving it shows the
// record with its code.

import { useState } from "react";
import { LiveData } from "@/shared/api/LiveData";
import type { ScreenContext } from "@/shared/catalog/types";
import { PurposeText } from "@/shared/screens/parts/PurposeText";
import { useRecordConfig } from "../data/recordsApi";
import type { RecordPlace } from "../types/recordPlace";
import { RecordDetail } from "./RecordDetail";
import { RecordForm } from "./RecordForm";
import { typesFor } from "./recordWords";

export function RecordFormPage({ screen, place, types, staff }: { screen: ScreenContext; place: RecordPlace; types?: string[]; staff?: boolean }) {
  const config = useRecordConfig(place);
  const [saved, setSaved] = useState("");
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <div className="grid max-w-3xl gap-3 p-4">
        <LiveData query={config} name={screen.spec.name}>
          {(c) => (
            <>
              {c.notice && <p className="rounded-md bg-surface-alt p-2 text-body">{c.notice}</p>}
              {saved ? <RecordDetail place={place} config={c} id={saved} staff={staff} onClose={() => setSaved("")} /> : <RecordForm place={place} types={typesFor(c, types).filter((t) => staff || t.selfService)} staff={staff} onSaved={(r) => setSaved(r.id)} />}
            </>
          )}
        </LiveData>
      </div>
    </>
  );
}
