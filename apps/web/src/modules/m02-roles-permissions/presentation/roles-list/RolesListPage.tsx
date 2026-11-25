"use client";
// S02-01 Roles list: every role, grouped by level, with its number of
// permissions. Search by name. Each role opens its permissions matrix and
// its holders. Live from the API (the 121 pre-made roles are seeded).

import { useState } from "react";
import { roleHref } from "@/modules/m02-roles-permissions/data/roleLink";
import { useRoles } from "@/modules/m02-roles-permissions/data/rolesApi";
import { LiveData } from "@/shared/api/LiveData";
import { catalog } from "@/shared/catalog/catalogIndex";
import type { ScreenContext } from "@/shared/catalog/types";
import { PurposeText } from "@/shared/screens/parts/PurposeText";
import { Button } from "@/shared/ui/button/Button";
import { SearchField } from "@/shared/ui/search/SearchField";
import { SectionHeader } from "@/shared/ui/section/SectionHeader";

/** The roles list. */
export function RolesListPage({ screen }: { screen: ScreenContext }) {
  const roles = useRoles();
  const [q, setQ] = useState("");
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <div className="flex flex-wrap items-center gap-2 px-4">
        <div className="min-w-56 flex-1"><SearchField hint="Search roles" value={q} onChange={setQ} /></div>
        <Button href={catalog.hrefOf(catalog.screen("S02-02")!)}>New role</Button>
        <Button variant="secondary" href={catalog.hrefOf(catalog.screen("S02-11")!)}>Who can do what</Button>
      </div>
      <LiveData query={roles} name="Roles" isEmpty={(d) => d.items.length === 0}>
        {(d) => {
          const shown = d.items.filter((r) => r.name.toLowerCase().includes(q.toLowerCase()));
          const levels = [...new Set(shown.map((r) => r.level))];
          return (
            <div className="grid gap-1 pb-4">
              {levels.map((level) => (
                <section key={level}>
                  <SectionHeader title={level} />
                  <ul className="mx-4 grid rounded-md border border-line bg-surface">
                    {shown.filter((r) => r.level === level).map((r) => (
                      <li key={r.id} className="flex flex-wrap items-center gap-2 border-b border-line px-3 py-2 last:border-b-0">
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-subtitle font-bold">{r.name}</span>
                          <span className="block truncate text-caption text-muted">{r.permissions.length} permissions{r.includedRoleIds.length ? ` + ${r.includedRoleIds.length} included role` : ""}</span>
                        </span>
                        <Button variant="text" href={roleHref("S02-03", r.id)}>Permissions</Button>
                        <Button variant="text" href={roleHref("S02-07", r.id)}>Holders</Button>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          );
        }}
      </LiveData>
    </>
  );
}
