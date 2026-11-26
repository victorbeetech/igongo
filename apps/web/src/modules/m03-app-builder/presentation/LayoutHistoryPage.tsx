"use client";
// S03-09 Layout history: a role's published versions, newest first, with
// roll back (which publishes the old version again as a new one).

import { useState } from "react";
import { LiveData } from "@/shared/api/LiveData";
import type { ScreenContext } from "@/shared/catalog/types";
import { PurposeText } from "@/shared/screens/parts/PurposeText";
import { Button } from "@/shared/ui/button/Button";
import { DataTable } from "@/shared/ui/table/DataTable";
import { useLayoutHistory, useRollBack } from "../data/layoutApi";
import { RolePicker } from "./parts/RolePicker";

export function LayoutHistoryPage({ screen }: { screen: ScreenContext }) {
  const [roleId, setRoleId] = useState("");
  const history = useLayoutHistory(roleId);
  const rollBack = useRollBack(roleId);
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <div className="grid gap-3 p-4">
        <RolePicker value={roleId} onChange={setRoleId} />
        {roleId && (
          <LiveData query={history} name="Layout history">
            {(d) => (
              <DataTable
                rows={d.items}
                rowKey={(v) => String(v.version)}
                empty="This role's layout has not been changed yet."
                columns={[
                  { label: "Version", cell: (v) => `v${v.version}` },
                  { label: "Published", cell: (v) => new Date(v.publishedAt).toLocaleString("en-UG") },
                  { label: "Menu", cell: (v) => `${v.layout.menu.length} ordered, ${v.layout.hidden.length} hidden` },
                  { label: "Tabs", cell: (v) => v.layout.tabs.join(", ") || "Default" },
                  { label: "", cell: (v) => (v.version === d.items[0]?.version ? "Live" : <Button variant="secondary" disabled={rollBack.isPending} onClick={() => rollBack.mutate(v.version)}>Roll back</Button>) },
                ]}
              />
            )}
          </LiveData>
        )}
      </div>
    </>
  );
}
