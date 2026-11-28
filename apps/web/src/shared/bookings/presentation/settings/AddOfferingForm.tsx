"use client";
// The form that adds something to sell. Saves through the API; on success it clears
// for the next one. Shown only to people with the offerings permission.

import { useState } from "react";
import { Button } from "@/shared/ui/button/Button";
import { Card } from "@/shared/ui/card/Card";
import { useAddOffering } from "../../data/bookingsApi";
import type { BookingPlace } from "../../types/bookingPlace";
import type { OfferingKind } from "../../types/offering";
import { OfferingFields } from "./OfferingFields";
import { blankDraft, bodyOf, type OfferingDraft } from "./offeringDraft";

/** Adds one offering. The first kind the module sells is picked by default. */
export function AddOfferingForm({ place, kinds }: { place: BookingPlace; kinds: OfferingKind[] }) {
  const add = useAddOffering(place);
  const [draft, setDraft] = useState<OfferingDraft>(() => blankDraft(kinds[0] ?? "slot"));
  // A name of at least two letters is needed before the Add button is enabled.
  const ready = draft.name.length >= 2 && !add.isPending;
  return (
    <Card className="grid gap-2">
      <h3 className="text-subtitle font-bold">Add</h3>
      <OfferingFields draft={draft} kinds={kinds} editing={false} onChange={setDraft} />
      <Button onClick={() => add.mutate(bodyOf(draft), { onSuccess: () => setDraft(blankDraft(draft.kind)) })} disabled={!ready}>
        Add
      </Button>
    </Card>
  );
}
