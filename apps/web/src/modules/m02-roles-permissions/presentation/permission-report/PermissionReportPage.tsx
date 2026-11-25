"use client";
// S02-11 Permission report: "who can do X, and why". Type one permission,
// such as `audit-trail.entries.view`, to see every role that gives it (and
// through which grant) and the people who hold those roles.

import { useState } from "react";
import { useWhoCan } from "@/modules/m02-roles-permissions/data/rolesApi";
import { LiveData } from "@/shared/api/LiveData";
import type { ScreenContext } from "@/shared/catalog/types";
import { PurposeText } from "@/shared/screens/parts/PurposeText";
import { TextInput } from "@/shared/ui/field/TextInput";

/** The permission report. */
export function PermissionReportPage({ screen }: { screen: ScreenContext }) {
  const [permission, setPermission] = useState("audit-trail.entries.view");
  const report = useWhoCan(permission.trim());
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <div className="grid gap-3 p-4">
        <TextInput label="Permission (module.feature.action)" value={permission} onChange={setPermission} />
        <LiveData query={report} name="Roles" isEmpty={(d) => d.items.length === 0}>
          {(d) => (
            <table className="w-full rounded-md border border-line text-caption">
              <thead className="bg-surface-alt"><tr><th className="p-2 text-left">Role</th><th className="p-2 text-left">Because of</th><th className="p-2 text-left">Scope</th><th className="p-2 text-left">People</th></tr></thead>
              <tbody>
                {d.items.map((r) => (
                  <tr key={r.roleId} className="border-t border-line"><td className="p-2 font-bold">{r.roleName}</td><td className="p-2">{r.grantedBy}</td><td className="p-2">{r.scope}</td><td className="p-2">{r.holders.length}</td></tr>
                ))}
              </tbody>
            </table>
          )}
        </LiveData>
      </div>
    </>
  );
}
