"use client";
// S06-03 Records search: find anything ever done in the system by words,
// module and dates, years back, and download the result. Every search
// result links nowhere else, because entries are the record itself.

import { useState } from "react";
import { filterQuery, useRecordSearch, type RecordFilter } from "@/modules/m06-records-search/data/recordsApi";
import { downloadFile } from "@/shared/api/downloadFile";
import { ErrorState } from "@/shared/api/LiveData";
import type { ScreenContext } from "@/shared/catalog/types";
import { dayTimeOf } from "@/shared/format/when";
import { PurposeText } from "@/shared/screens/parts/PurposeText";
import { Button } from "@/shared/ui/button/Button";
import { TextInput } from "@/shared/ui/field/TextInput";
import { DataTable } from "@/shared/ui/table/DataTable";

const EMPTY: RecordFilter = { q: "", module: "", from: "", to: "" };

/** The search page. */
export function RecordsSearchPage({ screen }: { screen: ScreenContext }) {
  const [draft, setDraft] = useState(EMPTY);
  const [filter, setFilter] = useState(EMPTY);
  const search = useRecordSearch(filter);
  const rows = search.data?.pages.flatMap((p) => p.items) ?? [];
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <div className="grid gap-3 p-4">
        <form onSubmit={(e) => { e.preventDefault(); setFilter(draft); }} className="flex flex-wrap items-end gap-2">
          <TextInput label="Words" value={draft.q} onChange={(q) => setDraft({ ...draft, q })} hint="Such as a name, a number or FLT-0042" />
          <TextInput label="Module key" value={draft.module} onChange={(module) => setDraft({ ...draft, module })} hint="Such as payroll" />
          <TextInput label="From" type="date" value={draft.from} onChange={(from) => setDraft({ ...draft, from })} />
          <TextInput label="To" type="date" value={draft.to} onChange={(to) => setDraft({ ...draft, to })} />
          <Button type="submit">Search</Button>
          <Button variant="secondary" onClick={() => void downloadFile(`/api/records/export.csv?${filterQuery(filter)}`, "records.csv")}>Download spreadsheet</Button>
        </form>
        {search.isPending && <p className="text-caption text-muted">Searching…</p>}
        {search.isError && <ErrorState error={search.error} name="Records" retry={() => void search.refetch()} />}
        {search.isSuccess && (
          <>
            <DataTable
              rows={rows}
              rowKey={(r) => r.id}
              empty="Nothing matches. Try fewer words or a wider range."
              columns={[
                { label: "When", cell: (r) => dayTimeOf(r.occurredAt) },
                { label: "Who", cell: (r) => r.actorName ?? "System" },
                { label: "Module", cell: (r) => r.module },
                { label: "What", cell: (r) => r.summary },
                { label: "Record", cell: (r) => (r.recordType ? `${r.recordType} ${r.recordId ?? ""}` : "—") },
              ]}
            />
            {search.hasNextPage && <div><Button variant="secondary" disabled={search.isFetchingNextPage} onClick={() => void search.fetchNextPage()}>Older results</Button></div>}
          </>
        )}
      </div>
    </>
  );
}
