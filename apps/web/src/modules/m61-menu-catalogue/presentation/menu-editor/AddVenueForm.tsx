"use client";
// The form that adds a venue (S61-01): a name, and whether guests see it at once.
// The API makes the venue's key from the name, so the form never asks for one.

import { useState } from "react";
import { useAddOutlet } from "@/modules/m61-menu-catalogue/data/menuApi";
import { Button } from "@/shared/ui/button/Button";
import { SwitchRow } from "@/shared/ui/switch/SwitchRow";
import { TextInput } from "@/shared/ui/field/TextInput";

/** Adds one venue, then clears the name box. */
export function AddVenueForm() {
  const add = useAddOutlet();
  // Step 1: what the super admin has typed so far, and whether guests see the new venue straight away.
  const [name, setName] = useState("");
  const [visible, setVisible] = useState(true);
  const trimmed = name.trim();
  // Step 2: send the venue; on success, clear the name so the next venue can be typed.
  const submit = () => add.mutate({ name: trimmed, clientVisible: visible }, { onSuccess: () => setName("") });
  return (
    <div className="grid gap-2 border-t border-line pt-3">
      <h3 className="text-label font-bold">Add a venue</h3>
      <TextInput label="Venue name, such as Pool bar" value={name} onChange={setName} />
      <SwitchRow label="Show to guests" on={visible} onChange={setVisible} disabled={add.isPending} />
      <Button onClick={submit} disabled={add.isPending || trimmed.length < 2}>
        Add venue
      </Button>
    </div>
  );
}
