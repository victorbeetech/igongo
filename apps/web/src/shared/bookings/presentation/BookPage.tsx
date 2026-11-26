"use client";
// The guest's booking page for any booking module (rooms, museum tickets,
// events, pool passes, shop items): everything on sale, each with its own
// booking form. Live from the API; empty until the hotel adds offerings.

import { LiveData } from "@/shared/api/LiveData";
import type { ScreenContext } from "@/shared/catalog/types";
import { PurposeText } from "@/shared/screens/parts/PurposeText";
import { useOfferings } from "../data/bookingsApi";
import type { BookingPlace } from "../types/bookingPlace";
import { OfferingBookForm } from "./OfferingBookForm";

export function BookPage({ screen, place }: { screen: ScreenContext; place: BookingPlace }) {
  const offerings = useOfferings(place);
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <div className="grid gap-3 p-4">
        <LiveData query={offerings} name={screen.spec.name} isEmpty={(d) => d.items.length === 0}>
          {(d) => d.items.map((o) => <OfferingBookForm key={o.id} place={place} offering={o} />)}
        </LiveData>
      </div>
    </>
  );
}
