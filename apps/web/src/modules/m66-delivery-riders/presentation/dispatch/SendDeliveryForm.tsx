"use client";
// "Send a delivery" on the dispatch board: anything that is not a food order
// (shop items, laundry, a room service tray, a parcel) goes to the riders
// with a D- number, a zone fee and time, and a 4-digit code for the guest.
// Picking the guest's account lets them follow it on their phone's tracker.
// Opens folded, so the board stays first.

import { useState } from "react";
import { useGuestSearch, useSendDelivery, useZonesForDispatch } from "@/modules/m66-delivery-riders/data/deliveryApi";
import { ugx } from "@/shared/format/ugx";
import { Button } from "@/shared/ui/button/Button";
import { Card } from "@/shared/ui/card/Card";
import { SelectInput } from "@/shared/ui/field/SelectInput";
import { TextInput } from "@/shared/ui/field/TextInput";
import { SOURCE_WORDS, type DeliverySource } from "../../domain/deliveryJob";

/** The kinds a dispatcher may send by hand (food comes from the kitchen). */
const KINDS = (Object.keys(SOURCE_WORDS) as DeliverySource[]).filter((k): k is Exclude<DeliverySource, "food"> => k !== "food");

/** An empty form. */
const EMPTY = { source: "parcel" as Exclude<DeliverySource, "food">, what: "", name: "", phone: "", place: "", zone: "", cash: "", find: "", userId: "" };

export function SendDeliveryForm() {
  const [open, setOpen] = useState(false);
  const [f, setF] = useState(EMPTY);
  const zones = useZonesForDispatch();
  const send = useSendDelivery();
  const guests = useGuestSearch(f.find);
  // Only guests with the app can follow a delivery.
  const withApp = (guests.data?.items ?? []).filter((g) => g.userId);
  if (!open) return <Button variant="secondary" onClick={() => setOpen(true)}>Send a delivery</Button>;
  const ready = f.what.trim().length >= 2 && f.name.trim() && f.place.trim().length >= 2;
  const submit = () =>
    send.mutate(
      {
        source: f.source, what: f.what.trim(), customer: { name: f.name.trim(), ...(f.phone.trim() ? { phone: f.phone.trim() } : {}), ...(f.userId ? { userId: f.userId } : {}) },
        place: { label: f.place.trim(), zone: f.zone || null, lat: null, lng: null }, cashToCollect: Number(f.cash) || 0,
      },
      { onSuccess: () => { setF(EMPTY); setOpen(false); } },
    );
  return (
    <Card className="grid gap-2">
      <h2 className="text-subtitle font-bold">Send a delivery</h2>
      <div className="grid gap-2 sm:grid-cols-2">
        <SelectInput label="What kind" value={f.source} onChange={(v) => setF({ ...f, source: v as typeof f.source })} options={KINDS.map((k): [string, string] => [k, SOURCE_WORDS[k]])} />
        <TextInput label="What the rider carries" value={f.what} onChange={(what) => setF({ ...f, what })} required />
        <TextInput label="Find the guest's app account (name or phone)" value={f.find} onChange={(find) => setF({ ...f, find, userId: "" })} />
        {withApp.length > 0 && (
          <SelectInput
            label="Guest account"
            value={f.userId}
            onChange={(userId) => {
              const g = withApp.find((x) => x.userId === userId);
              setF({ ...f, userId, name: g?.name ?? f.name, phone: g?.phone ?? f.phone });
            }}
            options={[["", "Not linked"], ...withApp.map((g): [string, string] => [g.userId ?? "", `${g.name}${g.phone ? ` · ${g.phone}` : ""}`])]}
          />
        )}
        <TextInput label="For (guest's name)" value={f.name} onChange={(name) => setF({ ...f, name })} required />
        <TextInput label="Guest's phone" type="tel" value={f.phone} onChange={(phone) => setF({ ...f, phone })} />
        <TextInput label="Deliver to (room, cottage or address)" value={f.place} onChange={(place) => setF({ ...f, place })} required />
        <SelectInput label="Area" value={f.zone} onChange={(zone) => setF({ ...f, zone })} options={[["", "On the grounds"], ...(zones.data?.items ?? []).map((z): [string, string] => [z.zone, `${z.name} (${ugx(z.fee)})`])]} />
        <TextInput label="Cash to collect (UGX)" type="number" value={f.cash} onChange={(cash) => setF({ ...f, cash })} />
      </div>
      <div className="flex gap-2">
        <Button onClick={submit} disabled={!ready || send.isPending}>Send to the board</Button>
        <Button variant="text" onClick={() => setOpen(false)}>Close</Button>
      </div>
    </Card>
  );
}
