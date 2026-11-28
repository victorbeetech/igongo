"use client";
// One venue in the super admin's venues list (S61-01): a rename box, the guest
// switch, and a remove button that asks once more before it removes anything.

import { useState } from "react";
import { useEditOutlet, useRemoveOutlet } from "@/modules/m61-menu-catalogue/data/menuApi";
import type { Outlet } from "@/shared/api/types/outlet";
import { Button } from "@/shared/ui/button/Button";
import { TextInput } from "@/shared/ui/field/TextInput";
import { SwitchRow } from "@/shared/ui/switch/SwitchRow";

/** One venue. [clientVisible] is true when guests can order from it. */
export function OutletRow({ outlet, clientVisible }: { outlet: Outlet; clientVisible: boolean }) {
  const edit = useEditOutlet();
  const remove = useRemoveOutlet();
  // Step 1: the name being typed, and whether the remove button has asked "are you sure?" yet.
  const [name, setName] = useState(outlet.name);
  const [asking, setAsking] = useState(false);
  const trimmed = name.trim();
  // Step 2: the guest switch saves straight away, so the carousel changes without another button.
  const switchFor = (on: boolean) => edit.mutate({ key: outlet.key, patch: { clientVisible: on } });
  // Step 3: save a new name only when it is valid and different.
  const rename = () => edit.mutate({ key: outlet.key, patch: { name: trimmed } });
  const canRename = !edit.isPending && trimmed.length >= 2 && trimmed !== outlet.name;
  return (
    <div className="grid gap-2 border-t border-line pt-3">
      <TextInput label="Venue name" value={name} onChange={setName} />
      <SwitchRow
        label="Show to guests"
        hint={clientVisible ? "Guests can order here" : "Hidden from guests"}
        on={clientVisible}
        onChange={switchFor}
        disabled={edit.isPending}
      />
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" onClick={rename} disabled={!canRename}>
          Save name
        </Button>
        {/* Step 4: removing takes two taps; the first only asks. */}
        {asking ? (
          <>
            <Button variant="danger" onClick={() => remove.mutate(outlet.key)} disabled={remove.isPending}>
              Yes, remove {outlet.name}
            </Button>
            <Button variant="text" onClick={() => setAsking(false)}>
              Keep it
            </Button>
          </>
        ) : (
          <Button variant="danger" onClick={() => setAsking(true)} disabled={remove.isPending}>
            Remove
          </Button>
        )}
      </div>
    </div>
  );
}
