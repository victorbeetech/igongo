"use client";
// S02-03 Permissions matrix: for one role (`?role=`), every module down the
// side and the eight standard actions across. Each cell is off, or on with
// a data scope (everything, own department, own records and so on). Save
// sends the whole list; the change is recorded in the Audit Trail.

import { useState } from "react";
import { cell, fromGrid, toGrid, type PermissionGrid } from "@/modules/m02-roles-permissions/domain/permissionGrid";
import { useAccessCatalog, useRole, useUpdateRole, type AccessCatalog, type Role } from "@/modules/m02-roles-permissions/data/rolesApi";
import { LiveData } from "@/shared/api/LiveData";
import type { ScreenContext } from "@/shared/catalog/types";
import { useAddress } from "@/shared/navigation/useAddress";
import { PurposeText } from "@/shared/screens/parts/PurposeText";
import { Button } from "@/shared/ui/button/Button";
import { SearchField } from "@/shared/ui/search/SearchField";

/** The matrix page. */
export function PermissionsMatrixPage({ screen }: { screen: ScreenContext }) {
  const id = useAddress().params.get("role") ?? "";
  const role = useRole(id);
  const catalog = useAccessCatalog();
  if (!id) return <p className="p-4 text-body text-muted">Open a role from the roles list to edit its permissions.</p>;
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <LiveData query={role} name={screen.spec.name}>
        {(r) => <LiveData query={catalog} name="Modules">{(c) => <Matrix key={r.id} role={r} catalog={c} />}</LiveData>}
      </LiveData>
    </>
  );
}

/** The editable grid for a loaded role. */
function Matrix({ role, catalog }: { role: Role; catalog: AccessCatalog }) {
  const start = toGrid(role.permissions);
  const [grid, setGrid] = useState<PermissionGrid>(start.grid);
  const [q, setQ] = useState("");
  const save = useUpdateRole(role.id);
  const set = (module: string, action: string, scope: string) => {
    const next = new Map(grid);
    if (scope) next.set(cell(module, action), scope);
    else next.delete(cell(module, action));
    setGrid(next);
  };
  const modules = catalog.modules.filter((m) => m.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="grid gap-3 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="flex-1 text-title font-bold">{role.name}</h2>
        <Button onClick={() => save.mutate({ permissions: fromGrid(grid, start.other) })} disabled={save.isPending}>Save permissions</Button>
      </div>
      {role.includedRoleIds.length > 0 && <p className="text-caption text-muted">Also gets everything in: {role.includedRoleIds.map((r) => r.replace(/^role_/, "")).join(", ")}.</p>}
      <SearchField hint="Find a module" value={q} onChange={setQ} />
      <div className="overflow-x-auto rounded-md border border-line">
        <table className="w-full text-caption">
          <thead className="bg-surface-alt">
            <tr>
              <th scope="col" className="p-2 text-left">Module</th>
              {catalog.actions.map((a) => <th key={a} scope="col" className="p-2 text-left capitalize">{a}</th>)}
            </tr>
          </thead>
          <tbody>
            {modules.map((m) => (
              <tr key={m.key} className="border-t border-line">
                <th scope="row" className="p-2 text-left font-bold">{m.name}</th>
                {catalog.actions.map((a) => (
                  <td key={a} className="p-1">
                    <select aria-label={`${m.name}: ${a}`} value={grid.get(cell(m.key, a)) ?? ""} onChange={(e) => set(m.key, a, e.target.value)}
                      className={`min-h-9 w-full rounded-sm border border-outline px-1 ${grid.has(cell(m.key, a)) ? "bg-primary-container text-on-primary-container font-bold" : "bg-surface"}`}>
                      <option value="">Off</option>
                      {catalog.scopes.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
