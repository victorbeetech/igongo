"use client";
// S02-07 Role holders: who holds one role (`?role=`), with "give this role"
// (pick an account, optionally until a date, for temporary roles such as
// Acting GM) and "take away".

import { useState } from "react";
import { useAccounts } from "@/modules/m04-users-login/data/accountsApi";
import { useAssignRole, useRole, useUnassignRole } from "@/modules/m02-roles-permissions/data/rolesApi";
import { LiveData } from "@/shared/api/LiveData";
import type { ScreenContext } from "@/shared/catalog/types";
import { useAddress } from "@/shared/navigation/useAddress";
import { PurposeText } from "@/shared/screens/parts/PurposeText";
import { Button } from "@/shared/ui/button/Button";
import { TextInput } from "@/shared/ui/field/TextInput";
import { SearchField } from "@/shared/ui/search/SearchField";

/** The role holders page. */
export function RoleHoldersPage({ screen }: { screen: ScreenContext }) {
  const id = useAddress().params.get("role") ?? "";
  const role = useRole(id);
  const assign = useAssignRole(id);
  const unassign = useUnassignRole(id);
  const [q, setQ] = useState("");
  const [until, setUntil] = useState("");
  const accounts = useAccounts(q, "active");
  if (!id) return <p className="p-4 text-body text-muted">Open a role from the roles list to see who holds it.</p>;
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <LiveData query={role} name={screen.spec.name}>
        {(r) => (
          <div className="grid gap-4 p-4">
            <h2 className="text-title font-bold">{r.name}</h2>
            {/* Step 1: current holders. */}
            <ul className="grid rounded-md border border-line bg-surface">
              {(r.holders ?? []).length === 0 && <li className="p-3 text-body text-muted">Nobody holds this role yet.</li>}
              {(r.holders ?? []).map((h) => (
                <li key={h.userId} className="flex items-center gap-2 border-b border-line p-3 last:border-b-0">
                  <span className="flex-1 text-body">{accounts.data?.items.find((a) => a.id === h.userId)?.name ?? h.userId}{h.endsAt ? ` · until ${new Date(h.endsAt).toLocaleDateString()}` : ""}</span>
                  <Button variant="secondary" onClick={() => unassign.mutate(h.userId)}>Take away</Button>
                </li>
              ))}
            </ul>
            {/* Step 2: give it to someone. */}
            <section className="grid gap-2">
              <h3 className="text-subtitle font-bold">Give this role</h3>
              <SearchField hint="Find an account" value={q} onChange={setQ} />
              <TextInput label="Until (optional, for a temporary role)" type="date" value={until} onChange={setUntil} />
              <ul className="grid rounded-md border border-line bg-surface">
                {accounts.data?.items.slice(0, 8).map((a) => (
                  <li key={a.id} className="flex items-center gap-2 border-b border-line p-3 last:border-b-0">
                    <span className="flex-1 text-body">{a.name} <span className="text-caption text-muted">{a.email}</span></span>
                    <Button onClick={() => assign.mutate({ userId: a.id, ...(until ? { endsAt: new Date(until).toISOString() } : {}) })}>Give</Button>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        )}
      </LiveData>
    </>
  );
}
