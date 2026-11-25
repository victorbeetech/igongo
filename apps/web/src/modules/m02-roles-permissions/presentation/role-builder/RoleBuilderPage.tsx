"use client";
// S02-02 Role builder: create a role from blank or as a copy of any role.
// After saving, its permissions matrix opens.

import { useState, type FormEvent } from "react";
import { roleHref } from "@/modules/m02-roles-permissions/data/roleLink";
import { useCreateRole, useRoles } from "@/modules/m02-roles-permissions/data/rolesApi";
import type { ScreenContext } from "@/shared/catalog/types";
import { useAddress } from "@/shared/navigation/useAddress";
import { PurposeText } from "@/shared/screens/parts/PurposeText";
import { Button } from "@/shared/ui/button/Button";
import { TextInput } from "@/shared/ui/field/TextInput";

/** Turns a name into a role key, such as "Night Chef" into `night-chef`. */
const keyOf = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/** The role builder. */
export function RoleBuilderPage({ screen }: { screen: ScreenContext }) {
  const address = useAddress();
  const roles = useRoles();
  const create = useCreateRole();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [cloneFrom, setCloneFrom] = useState(address.params.get("clone") ?? "");

  function submit(event: FormEvent) {
    event.preventDefault();
    create.mutate({ key: keyOf(name), name, description, ...(cloneFrom ? { cloneFromRoleId: cloneFrom } : {}) }, { onSuccess: (role) => address.push(roleHref("S02-03", role.id)) });
  }

  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <form onSubmit={submit} className="grid max-w-lg gap-3 p-4">
        <TextInput label="Role name" value={name} onChange={setName} hint="Such as Night Chef" required />
        <TextInput label="What the role is for" value={description} onChange={setDescription} />
        <label className="grid gap-1">
          <span className="text-label font-bold">Start from</span>
          <select value={cloneFrom} onChange={(e) => setCloneFrom(e.target.value)} className="min-h-11 rounded-md border border-outline bg-surface-alt px-3 text-body">
            <option value="">A blank role</option>
            {roles.data?.items.map((r) => <option key={r.id} value={r.id}>A copy of {r.name}</option>)}
          </select>
        </label>
        <p className="text-caption text-muted">Key: {keyOf(name) || "…"} (used by the system; it never changes)</p>
        <Button type="submit" disabled={create.isPending || !keyOf(name)}>{create.isPending ? "Creating…" : "Create role"}</Button>
      </form>
    </>
  );
}
