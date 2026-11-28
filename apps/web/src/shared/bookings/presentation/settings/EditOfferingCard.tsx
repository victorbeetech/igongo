"use client";
// The change form for one offering that is already on sale: its name, price, capacity,
// times, date and description. It opens under the offerings table when staff press
// Change on a row, and closes when saved or cancelled.

import { useState } from "react";
import { Button } from "@/shared/ui/button/Button";
import { Card } from "@/shared/ui/card/Card";
import { useEditOffering } from "../../data/bookingsApi";
import type { BookingPlace } from "../../types/bookingPlace";
import type { Offering, OfferingKind } from "../../types/offering";
import { OfferingFields } from "./OfferingFields";
import { bodyOf, draftOf, type OfferingDraft } from "./offeringDraft";

interface EditOfferingCardProps {
  place: BookingPlace;
  /** The kinds this module sells (passed on to the shared fields). */
  kinds: OfferingKind[];
  /** The offering being changed. */
  offering: Offering;
  /** Called after a save or a cancel, to close the card. */
  onDone: () => void;
}

/** Changes one existing offering. The form starts with its current values. */
export function EditOfferingCard({ place, kinds, offering, onDone }: EditOfferingCardProps) {
  const edit = useEditOffering(place);
  // Starts from the offering's current values; the card is keyed by offering, so it restarts for another one.
  const [draft, setDraft] = useState<OfferingDraft>(() => draftOf(offering));
  const ready = draft.name.length >= 2 && !edit.isPending;
  return (
    <Card className="grid gap-2">
      <h3 className="text-subtitle font-bold">Change {offering.name}</h3>
      <OfferingFields draft={draft} kinds={kinds} editing onChange={setDraft} />
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => edit.mutate({ id: offering.id, patch: bodyOf(draft) }, { onSuccess: onDone })} disabled={!ready}>
          Save
        </Button>
        <Button variant="secondary" onClick={onDone}>
          Cancel
        </Button>
      </div>
    </Card>
  );
}
