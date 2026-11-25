"use client";
// S04-01 Accounts list: every account (staff and clients), searchable by
// name, email or phone, filtered by status. Live from the API.

import { useState } from "react";
import { useAccounts } from "@/modules/m04-users-login/data/accountsApi";
import { LiveData } from "@/shared/api/LiveData";
import type { ScreenContext } from "@/shared/catalog/types";
import { catalog } from "@/shared/catalog/catalogIndex";
import { recordHref } from "@/shared/navigation/recordId";
import { PurposeText } from "@/shared/screens/parts/PurposeText";
import { Button } from "@/shared/ui/button/Button";
import { FilterChips } from "@/shared/ui/chip/FilterChips";
import { ListRow } from "@/shared/ui/list-row/ListRow";
import { SearchField } from "@/shared/ui/search/SearchField";

const STATUSES = ["All", "Active", "Pending", "Locked", "Suspended"];

/** The accounts list. */
export function AccountsListPage({ screen }: { screen: ScreenContext }) {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("All");
  const accounts = useAccounts(q, status === "All" ? "" : status.toLowerCase());
  const detail = catalog.screen("S04-02")!;
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <div className="grid gap-3 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="min-w-56 flex-1"><SearchField hint="Search name, email or phone" value={q} onChange={setQ} /></div>
          <Button href={catalog.hrefOf(catalog.screen("S04-03")!)}>Create account</Button>
        </div>
        <FilterChips label="Status" options={STATUSES} value={status} onChange={setStatus} />
        <LiveData query={accounts} name="Accounts" isEmpty={(d) => d.items.length === 0}>
          {(d) => (
            <ul className="grid rounded-md border border-line bg-surface">
              {d.items.map((a) => (
                <li key={a.id}>
                  <ListRow title={a.name} subtitle={`${a.email} · ${a.kind}`} status={a.status[0]!.toUpperCase() + a.status.slice(1)} href={recordHref(detail, a.id)} />
                </li>
              ))}
            </ul>
          )}
        </LiveData>
      </div>
    </>
  );
}
