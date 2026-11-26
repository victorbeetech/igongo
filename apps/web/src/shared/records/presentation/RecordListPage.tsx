"use client";
// The list page every records-kit module shares: filter by type, status,
// words and open or closed; "mine" and "given to me" views; download as a
// spreadsheet; add a record; and open one (it opens above the list, with
// `?record=<id>` in the address so it can be shared).

import { useState } from "react";
import { LiveData } from "@/shared/api/LiveData";
import { downloadFile } from "@/shared/api/downloadFile";
import type { ScreenContext } from "@/shared/catalog/types";
import { useAddress } from "@/shared/navigation/useAddress";
import { PurposeText } from "@/shared/screens/parts/PurposeText";
import { Button } from "@/shared/ui/button/Button";
import { StatusChip } from "@/shared/ui/chip/StatusChip";
import { SelectInput } from "@/shared/ui/field/SelectInput";
import { TextInput } from "@/shared/ui/field/TextInput";
import { SwitchRow } from "@/shared/ui/switch/SwitchRow";
import { DataTable } from "@/shared/ui/table/DataTable";
import { useRecordConfig, useRecords } from "../data/recordsApi";
import type { RecordConfig } from "../types/recordConfig";
import type { RecordPlace } from "../types/recordPlace";
import { FieldText } from "./FieldText";
import { RecordDetail } from "./RecordDetail";
import { RecordForm } from "./RecordForm";
import { statusLabel, typesFor } from "./recordWords";

/** How one list page shows its module's records. */
export interface ListView {
  /** Only these record types (default: all active ones). */
  types?: string[];
  /** Only my own records (raised by or for me). */
  mine?: boolean;
  /** Only records given to me. */
  assigned?: boolean;
  /** Staff tools: add for others, assign, move, export. */
  staff?: boolean;
  /** Show the add form (default: true). */
  canAdd?: boolean;
  /** Start with only open records (default: true). */
  openOnly?: boolean;
}

export function RecordListPage({ screen, place, view = {} }: { screen: ScreenContext; place: RecordPlace; view?: ListView }) {
  const config = useRecordConfig(place);
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <div className="grid gap-3 p-4">
        <LiveData query={config} name={screen.spec.name}>{(c) => <RecordList place={place} config={c} view={view} />}</LiveData>
      </div>
    </>
  );
}

/** The list itself, once the set-up is loaded. */
function RecordList({ place, config, view }: { place: RecordPlace; config: RecordConfig; view: ListView }) {
  const address = useAddress();
  const types = typesFor(config, view.types);
  const [typeKey, setTypeKey] = useState(types.length === 1 ? (types[0]?.key ?? "") : "");
  const [status, setStatus] = useState("");
  const [words, setWords] = useState("");
  const [openOnly, setOpenOnly] = useState(view.openOnly ?? true);
  const [adding, setAdding] = useState(false);
  const type = types.find((t) => t.key === typeKey);
  const list = useRecords(place, {
    ...(typeKey ? { type: typeKey } : {}), ...(status ? { status } : {}), ...(words ? { q: words } : {}),
    ...(openOnly ? { open: true } : {}), ...(view.mine ? { mine: true } : {}), ...(view.assigned ? { assigned: true } : {}),
  });
  const opened = address.params.get("record") ?? "";
  /** Opens record [id] above the list. */
  const open = (id: string) => address.replace(`${address.path}${id ? `?record=${encodeURIComponent(id)}` : ""}`);
  // Columns: the fields marked "in list" of the type shown (or of the only type).
  const shownType = type ?? (types.length === 1 ? types[0] : undefined);
  const fieldCols = (shownType?.fields ?? []).filter((f) => f.inList).slice(0, 4);
  const addable = types.filter((t) => view.staff || t.selfService);
  return (
    <>
      {config.notice && <p className="rounded-md bg-surface-alt p-2 text-body">{config.notice}</p>}
      {opened && <RecordDetail place={place} config={config} id={opened} staff={view.staff} onClose={() => open("")} />}
      <div className="flex flex-wrap items-end gap-2">
        {types.length > 1 && <SelectInput label="Type" value={typeKey} onChange={(k) => (setTypeKey(k), setStatus(""))} options={[["", "All types"], ...types.map((t): [string, string] => [t.key, t.name])]} />}
        {type && <SelectInput label="Status" value={status} onChange={setStatus} options={[["", "Any status"], ...type.statuses.map((s): [string, string] => [s.key, s.label])]} />}
        <TextInput label="Search" value={words} onChange={setWords} />
        {(view.canAdd ?? true) && addable.length > 0 && <Button onClick={() => setAdding(!adding)}>{adding ? "Close the form" : "Add"}</Button>}
        {view.staff && <Button variant="secondary" onClick={() => void downloadFile(`${place.path}/export${typeKey ? `?type=${typeKey}` : ""}`, `${place.module}.csv`)}>Download</Button>}
      </div>
      <SwitchRow label="Only open ones" on={openOnly} onChange={setOpenOnly} />
      {adding && <RecordForm place={place} types={addable} staff={view.staff} onSaved={(r) => (setAdding(false), open(r.id))} />}
      <LiveData query={list} name="Records">
        {(d) => (
          <DataTable
            rows={d.items}
            rowKey={(r) => r.id}
            empty="Nothing here yet."
            columns={[
              { label: "Code", cell: (r) => <button type="button" className="text-primary-text underline" onClick={() => open(r.id)}>{r.code}</button> },
              { label: "What", cell: (r) => r.title },
              ...fieldCols.map((f) => ({ label: f.label, cell: (r: (typeof d.items)[number]) => <FieldText field={f} value={r.fields[f.key]} /> })),
              { label: "For", cell: (r) => r.ownerName },
              { label: "With", cell: (r) => r.assigneeName ?? "-" },
              { label: "Day", cell: (r) => r.dueOn ?? "-" },
              { label: "Status", cell: (r) => <StatusChip status={statusLabel(config.types.find((t) => t.key === r.type), r.status)} /> },
            ]}
          />
        )}
      </LiveData>
    </>
  );
}
