"use client";
// The booking form for one offering: the fields its kind needs (dates for a
// stay, a date and time for a ticket, just a quantity for a shop item, a date
// and guest count for an event request), the price shown live, then Book.

import { useState } from "react";
import { ugx } from "@/shared/format/ugx";
import { hotelToday } from "@/shared/format/when";
import { Button } from "@/shared/ui/button/Button";
import { Card } from "@/shared/ui/card/Card";
import { SelectInput } from "@/shared/ui/field/SelectInput";
import { TextInput } from "@/shared/ui/field/TextInput";
import { useBook, type BookInput } from "../data/bookingsApi";
import type { BookingPlace } from "../types/bookingPlace";
import type { Offering } from "../types/offering";
import { PayButton } from "@/shared/ui/pay/PayButton";

/** Nights between two `YYYY-MM-DD` dates. */
const nights = (a: string, b: string) => Math.max(0, Math.round((Date.parse(b) - Date.parse(a)) / 86_400_000));

export function OfferingBookForm({ place, offering }: { place: BookingPlace; offering: Offering }) {
  const book = useBook(place);
  const [v, setV] = useState({ date: offering.onDate ?? hotelToday(), endDate: "", slot: offering.slots[0] ?? "", units: "1" });
  const units = Math.max(1, Number(v.units) || 1);
  // The same sum the API makes (it has the last word).
  const price = offering.kind === "enquiry" ? null : offering.price * units * (offering.kind === "nights" ? nights(v.date, v.endDate) : 1);
  const submit = () => {
    const body: BookInput = { offeringId: offering.id, units };
    if (offering.kind !== "stock") body.date = v.date;
    if (offering.kind === "nights") body.endDate = v.endDate;
    if (offering.kind === "slot" && offering.slots.length) body.slot = v.slot;
    book.mutate(body);
  };
  const done = book.data;
  return (
    <Card className="grid gap-2">
      <div className="flex flex-wrap items-baseline gap-2">
        <h3 className="text-subtitle font-bold">{offering.name}</h3>
        <span className="text-label text-muted">{offering.kind === "enquiry" ? "Priced on request" : `${ugx(offering.price)} per ${place.unit}${offering.kind === "nights" ? " per night" : ""}`}</span>
      </div>
      {offering.description && <p className="text-body text-muted">{offering.description}</p>}
      {Object.entries(offering.details).map(([k, d]) => <p key={k} className="text-caption text-muted">{k}: {d}</p>)}
      <div className="grid gap-2 sm:grid-cols-4">
        {offering.kind !== "stock" && !offering.onDate && <TextInput label={offering.kind === "nights" ? "Check-in" : "Date"} type="date" value={v.date} onChange={(date) => setV({ ...v, date })} />}
        {offering.kind === "nights" && <TextInput label="Check-out" type="date" value={v.endDate} onChange={(endDate) => setV({ ...v, endDate })} />}
        {offering.kind === "slot" && offering.slots.length > 0 && <SelectInput label="Time" value={v.slot} onChange={(slot) => setV({ ...v, slot })} options={offering.slots.map((s) => [s, s])} />}
        <TextInput label={offering.kind === "enquiry" ? "Guests" : `${place.unit[0]?.toUpperCase()}${place.unit.slice(1)}s`} type="number" value={v.units} onChange={(u) => setV({ ...v, units: u })} />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        {price !== null && price > 0 && <span className="text-subtitle font-bold">{ugx(price)}</span>}
        <Button onClick={submit} disabled={book.isPending}>{offering.kind === "enquiry" ? "Send request" : "Book"}</Button>
      </div>
      {done && (
        <p className="text-body" role="status">
          Booking <b>{done.code}</b> is {done.status.replace(/_/g, " ")}. <PayButton module={place.module} recordId={done.id} owed={done.status === "requested" ? 0 : done.total - done.paid} />
        </p>
      )}
    </Card>
  );
}
