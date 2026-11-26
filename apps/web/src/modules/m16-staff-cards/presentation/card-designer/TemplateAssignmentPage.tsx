"use client";
// S16-05 Template assignment: the default card for every role, and the
// roles that use another template. Saved with the rest of the designs.

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { api } from "@/shared/api/apiClient";
import { LiveData } from "@/shared/api/LiveData";
import type { ScreenContext } from "@/shared/catalog/types";
import { PurposeText } from "@/shared/screens/parts/PurposeText";
import { Button } from "@/shared/ui/button/Button";
import { SelectInput } from "@/shared/ui/field/SelectInput";
import { DataTable } from "@/shared/ui/table/DataTable";
import { useCardDesigns, useSaveCardDesigns } from "../../data/designsApi";
import type { CardDesigns } from "../../domain/cardDesigns";

/** The roles, by key and name, for the table. */
const useRoleNames = () => useQuery({ queryKey: ["card-designs", "roles"], queryFn: () => api<{ items: { key: string; name: string; archivedAt: string | null }[] }>("/api/access/roles") });

export function TemplateAssignmentPage({ screen }: { screen: ScreenContext }) {
  const designs = useCardDesigns();
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <div className="grid gap-3 p-4">
        <LiveData query={designs} name="Card designs">{(d) => <Assign initial={d} />}</LiveData>
      </div>
    </>
  );
}

function Assign({ initial }: { initial: CardDesigns }) {
  const roles = useRoleNames();
  const save = useSaveCardDesigns();
  const [d, setD] = useState(initial);
  const active = d.templates.filter((t) => t.active).map((t): [string, string] => [t.key, t.name]);
  const setRole = (role: string, key: string) => {
    const byRole = { ...d.byRole };
    if (key) byRole[role] = key;
    else delete byRole[role];
    setD({ ...d, byRole });
  };
  return (
    <>
      <SelectInput label="Default card for every role" value={d.defaultTemplate} onChange={(defaultTemplate) => setD({ ...d, defaultTemplate })} options={active} />
      <LiveData query={roles} name="Roles">
        {(r) => (
          <DataTable
            rows={r.items.filter((x) => !x.archivedAt)}
            rowKey={(x) => x.key}
            columns={[
              { label: "Role", cell: (x) => x.name },
              { label: "Card", cell: (x) => <SelectInput label={`Card for ${x.name}`} value={d.byRole[x.key] ?? ""} onChange={(v) => setRole(x.key, v)} options={[["", "The default"], ...active]} /> },
            ]}
          />
        )}
      </LiveData>
      <div>
        <Button onClick={() => save.mutate(d)} disabled={save.isPending}>Save assignments</Button>
      </div>
    </>
  );
}
