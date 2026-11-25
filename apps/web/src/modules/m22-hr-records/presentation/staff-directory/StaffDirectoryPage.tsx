"use client";
// S22-01 Staff directory: everyone HR may see, searchable by name, staff
// number or job title, filtered by status. Live from HR Records.

import { useState } from "react";
import { useStaffDirectory } from "@/modules/m22-hr-records/data/staffApi";
import { LiveData } from "@/shared/api/LiveData";
import { catalog } from "@/shared/catalog/catalogIndex";
import type { ScreenContext } from "@/shared/catalog/types";
import { recordHref } from "@/shared/navigation/recordId";
import { PurposeText } from "@/shared/screens/parts/PurposeText";
import { Button } from "@/shared/ui/button/Button";
import { FilterChips } from "@/shared/ui/chip/FilterChips";
import { ListRow } from "@/shared/ui/list-row/ListRow";
import { SearchField } from "@/shared/ui/search/SearchField";

const STATUSES = ["All", "Active", "Suspended", "Left"];

/** The staff directory. */
export function StaffDirectoryPage({ screen }: { screen: ScreenContext }) {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("Active");
  const staff = useStaffDirectory(q, status === "All" ? "" : status.toLowerCase());
  const profile = catalog.screen("S22-02")!;
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <div className="grid gap-3 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="min-w-56 flex-1"><SearchField hint="Search name, staff number or job" value={q} onChange={setQ} /></div>
          <Button href={catalog.hrefOf(catalog.screen("S22-03")!)}>Add staff</Button>
        </div>
        <FilterChips label="Status" options={STATUSES} value={status} onChange={setStatus} />
        <LiveData query={staff} name="Staff" isEmpty={(d) => d.items.length === 0}>
          {(d) => (
            <ul className="grid rounded-md border border-line bg-surface">
              {d.items.map((s) => (
                <li key={s.staffId}>
                  <ListRow title={s.name} subtitle={[s.staffNumber, s.jobTitle, s.department].filter(Boolean).join(" · ")} status={s.status[0]!.toUpperCase() + s.status.slice(1)} href={recordHref(profile, s.staffId)} />
                </li>
              ))}
            </ul>
          )}
        </LiveData>
      </div>
    </>
  );
}
