"use client";
// S62-09 Order placed, S62-10 Track order and S62-11 My orders: my orders
// with their status and timeline, Pay while money is owed, Cancel in the
// cancel window, and for a delivery on its way the rider and my door code.

import { useCancelOrder, useMyOrders, useTrack } from "@/modules/m62-food-ordering/data/ordersApi";
import { TYPE_WORDS, type Order } from "@/modules/m62-food-ordering/domain/order";
import { LiveData } from "@/shared/api/LiveData";
import { PayButton } from "@/shared/ui/pay/PayButton";
import type { ScreenContext } from "@/shared/catalog/types";
import { ugx } from "@/shared/format/ugx";
import { dayTimeOf, timeOf, words } from "@/shared/format/when";
import { PurposeText } from "@/shared/screens/parts/PurposeText";
import { Button } from "@/shared/ui/button/Button";
import { Card } from "@/shared/ui/card/Card";
import { StatusChip } from "@/shared/ui/chip/StatusChip";

export function MyOrdersPage({ screen }: { screen: ScreenContext }) {
  const mine = useMyOrders();
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <div className="grid gap-3 p-4">
        <LiveData query={mine} name="Your orders" isEmpty={(d) => d.length === 0}>
          {(d) => d.map((o) => <OrderCard key={o.id} order={o} />)}
        </LiveData>
      </div>
    </>
  );
}

/** One of my orders. */
function OrderCard({ order: o }: { order: Order }) {
  const cancel = useCancelOrder();
  const track = useTrack(o.id, o.type === "delivery" && (o.status === "ready" || o.status === "on_the_way"));
  return (
    <Card className="grid gap-1">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="text-subtitle font-bold">{o.number}</h3>
        <span className="text-label text-muted">{TYPE_WORDS[o.type]}</span>
        <StatusChip status={words(o.status)} />
      </div>
      <p className="text-body">{o.lines.map((l) => `${l.quantity} x ${l.name}${l.options.length ? ` (${l.options.map((x) => x.name).join(", ")})` : ""}`).join("; ")}</p>
      <p className="text-label">{ugx(o.paid)} paid of {ugx(o.total)} · ready about {dayTimeOf(o.readyAt)}</p>
      {track.data && <p className="text-body" role="status">{track.data.riderName ? `${track.data.riderName} is bringing it.` : "Waiting for a rider."} Give the rider this code: <b>{track.data.code}</b></p>}
      <ol className="text-caption text-muted">{o.history.map((h, i) => <li key={i}>{timeOf(h.at)} {words(h.status)}{h.note ? `: ${h.note}` : ""}</li>)}</ol>
      <div className="flex flex-wrap gap-2">
        <PayButton module="food-ordering" recordId={o.id} owed={o.status === "cancelled" ? 0 : o.total - o.paid} />
        {(o.status === "awaiting_payment" || o.status === "received") && <Button variant="secondary" disabled={cancel.isPending} onClick={() => cancel.mutate({ id: o.id, reason: "Cancelled by the guest" })}>Cancel</Button>}
      </div>
    </Card>
  );
}
