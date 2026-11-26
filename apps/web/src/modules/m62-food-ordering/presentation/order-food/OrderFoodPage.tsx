"use client";
// S62-01 to S62-09, one page for the whole ordering flow on the web: pick
// an outlet, add items with their options, choose how to get it (delivery,
// room service, dine-in, takeaway, or pre-order with an arrival time, such
// as "1 kg fried beef, we arrive at 4 PM"), check the price and ready time,
// place the order, and pay when the order type needs money first.

import { useState } from "react";
import { useClientOutlets, useOrderingRules, useOutletMenu, usePlaceOrder, useQuote, useZones, type CartBody } from "@/modules/m62-food-ordering/data/ordersApi";
import type { CartLine } from "@/modules/m62-food-ordering/domain/cartLine";
import { TYPE_WORDS, type OrderType } from "@/modules/m62-food-ordering/domain/order";
import { LiveData } from "@/shared/api/LiveData";
import { PayButton } from "@/shared/ui/pay/PayButton";
import type { ScreenContext } from "@/shared/catalog/types";
import { ugx } from "@/shared/format/ugx";
import { dayTimeOf, words } from "@/shared/format/when";
import { PurposeText } from "@/shared/screens/parts/PurposeText";
import { Button } from "@/shared/ui/button/Button";
import { Card } from "@/shared/ui/card/Card";
import { SelectInput } from "@/shared/ui/field/SelectInput";
import { TextInput } from "@/shared/ui/field/TextInput";
import { SectionHeader } from "@/shared/ui/section/SectionHeader";
import { ItemPicker } from "./ItemPicker";

export function OrderFoodPage({ screen }: { screen: ScreenContext }) {
  const outlets = useClientOutlets();
  const [outlet, setOutlet] = useState("");
  const menu = useOutletMenu(outlet);
  const rules = useOrderingRules();
  const zones = useZones();
  const quote = useQuote();
  const place = usePlaceOrder();
  const [cart, setCart] = useState<CartLine[]>([]);
  const [d, setD] = useState({ type: "dine_in" as OrderType, arriveAt: "", zone: "", address: "", table: "", notes: "", allergies: "" });
  // Order types switched on at this outlet.
  const types = (Object.keys(TYPE_WORDS) as OrderType[]).filter((t) => {
    const r = rules.data?.types[t];
    return r?.enabled && (!r.outlets.length || r.outlets.includes(outlet));
  });
  const body = (): CartBody => ({
    outlet, type: d.type, lines: cart.map((l) => ({ itemId: l.itemId, quantity: l.quantity, options: l.options })),
    ...(d.type === "pre_order" && d.arriveAt ? { arriveAt: new Date(d.arriveAt).toISOString() } : {}),
    ...(d.type === "delivery" ? { deliverTo: { label: d.address, zone: d.zone || null, lat: null, lng: null } } : {}),
    ...(d.table ? { table: d.table } : {}), ...(d.notes ? { notes: d.notes } : {}), ...(d.allergies ? { allergies: d.allergies } : {}),
  });
  const order = place.data;
  if (order) {
    return (
      <Card className="m-4 grid gap-2">
        <h2 className="text-title font-bold">Order {order.number}</h2>
        <p className="text-body">{words(order.status)} · ready about {dayTimeOf(order.readyAt)} · {ugx(order.total)}</p>
        <div className="flex gap-2">
          <PayButton module="food-ordering" recordId={order.id} owed={order.total - order.paid} />
          <Button variant="secondary" href="/food-ordering/my-orders">My orders</Button>
        </div>
      </Card>
    );
  }
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <div className="grid gap-3 p-4">
        {/* Step 1: the outlet and its menu. */}
        <LiveData query={outlets} name="Outlets" isEmpty={(o) => o.items.length === 0}>
          {(o) => <SelectInput label="Order from" value={outlet} onChange={(v) => { setOutlet(v); setCart([]); }} options={[["", "Choose an outlet"], ...o.items.map((x): [string, string] => [x.key, x.name])]} />}
        </LiveData>
        {outlet && (
          <LiveData query={menu} name="The menu" isEmpty={(m) => m.items.length === 0}>
            {(m) => <ul className="rounded-md border border-line bg-surface">{m.items.map((i) => <ItemPicker key={i.id} item={i} onAdd={(l) => setCart([...cart, l])} />)}</ul>}
          </LiveData>
        )}
        {/* Step 2: the cart. */}
        {cart.length > 0 && (
          <Card className="grid gap-2">
            <SectionHeader title="Your order" />
            {cart.map((l, i) => (
              <div key={`${l.itemId}-${i}`} className="flex items-center gap-2">
                <TextInput label={l.name} type="number" value={String(l.quantity)} onChange={(q) => setCart(cart.map((x, j) => (j === i ? { ...x, quantity: Math.max(1, Number(q) || 1) } : x)))} />
                <span className="text-label">{ugx(l.unitPrice * l.quantity)}</span>
                <Button variant="text" onClick={() => setCart(cart.filter((_, j) => j !== i))}>Remove</Button>
              </div>
            ))}
            {/* Step 3: how to get it. */}
            <SelectInput label="How" value={d.type} onChange={(type) => setD({ ...d, type: type as OrderType })} options={types.map((t) => [t, TYPE_WORDS[t]])} />
            {d.type === "pre_order" && <TextInput label={`Arrival time (at least ${rules.data?.preorderMinNoticeMinutes ?? 0} minutes from now)`} type="datetime-local" value={d.arriveAt} onChange={(arriveAt) => setD({ ...d, arriveAt })} />}
            {d.type === "delivery" && (
              <>
                <SelectInput label="Area" value={d.zone} onChange={(zone) => setD({ ...d, zone })} options={[["", "Choose an area"], ...(zones.data?.items ?? []).map((z): [string, string] => [z.zone, `${z.name} (${ugx(z.fee)}, about ${z.minutes} min)`])]} />
                <TextInput label="Address or spot on the grounds" value={d.address} onChange={(address) => setD({ ...d, address })} />
              </>
            )}
            {(d.type === "dine_in" || d.type === "room_service") && <TextInput label={d.type === "dine_in" ? "Table" : "Room"} value={d.table} onChange={(table) => setD({ ...d, table })} />}
            <TextInput label="Notes for the kitchen" value={d.notes} onChange={(notes) => setD({ ...d, notes })} />
            <TextInput label="Allergies" value={d.allergies} onChange={(allergies) => setD({ ...d, allergies })} />
            {/* Step 4: price, then order. */}
            {quote.data && <p className="text-body" role="status">{ugx(quote.data.total)}{quote.data.deliveryFee ? ` with ${ugx(quote.data.deliveryFee)} delivery` : ""} · ready about {dayTimeOf(quote.data.readyAt)}</p>}
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" onClick={() => quote.mutate(body())} disabled={quote.isPending}>Check price and time</Button>
              <Button onClick={() => place.mutate(body())} disabled={place.isPending}>Place order</Button>
            </div>
          </Card>
        )}
      </div>
    </>
  );
}
