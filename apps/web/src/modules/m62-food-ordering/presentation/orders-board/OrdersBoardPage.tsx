"use client";
// S62-12 Orders board and S62-13 Order detail: every open order by status
// (refreshes every 15 s), soonest ready first, with the next step as a
// button for the kitchen and front of house, and cancel with a reason.

import { useState } from "react";
import { useBoard, useCancelOrder, useClientOutlets, useMoveOrder } from "@/modules/m62-food-ordering/data/ordersApi";
import { TYPE_WORDS, type OrderStatus } from "@/modules/m62-food-ordering/domain/order";
import { LiveData } from "@/shared/api/LiveData";
import type { ScreenContext } from "@/shared/catalog/types";
import { ugx } from "@/shared/format/ugx";
import { dayTimeOf, timeOf, words } from "@/shared/format/when";
import { PurposeText } from "@/shared/screens/parts/PurposeText";
import { Button } from "@/shared/ui/button/Button";
import { Card } from "@/shared/ui/card/Card";
import { SelectInput } from "@/shared/ui/field/SelectInput";
import { SectionHeader } from "@/shared/ui/section/SectionHeader";
import { ReviewsPanel } from "./ReviewsPanel";

/** The board's columns, in kitchen order. */
const COLUMNS: OrderStatus[] = ["awaiting_payment", "received", "preparing", "ready", "on_the_way", "delivered"];

export function OrdersBoardPage({ screen }: { screen: ScreenContext }) {
  const [outlet, setOutlet] = useState("");
  const outlets = useClientOutlets();
  const board = useBoard(outlet);
  const move = useMoveOrder();
  const cancel = useCancelOrder();
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <div className="grid gap-3 p-4">
        <SelectInput label="Outlet" value={outlet} onChange={setOutlet} options={[["", "Every outlet"], ...(outlets.data?.items ?? []).map((o): [string, string] => [o.key, o.name])]} />
        <LiveData query={board} name="Orders">
          {(d) => (
            <div className="grid gap-3 lg:grid-cols-3">
              {COLUMNS.map((status) => (
                <section key={status} aria-label={words(status)}>
                  <SectionHeader title={`${words(status)} (${d.items.filter((o) => o.status === status).length})`} />
                  {d.items.filter((o) => o.status === status).map((o) => (
                    <Card key={o.id} className="mb-2 grid gap-1">
                      <p className="text-subtitle font-bold">{o.number} · {TYPE_WORDS[o.type]}{o.table ? ` · ${o.table}` : ""}</p>
                      <p className="text-caption text-muted">{o.customerName} · ready {timeOf(o.readyAt)} · {ugx(o.paid)} of {ugx(o.total)} paid</p>
                      {o.arriveAt && <p className="text-label font-bold">Scheduled for {dayTimeOf(o.arriveAt)}</p>}
                      {o.promoCode && <p className="text-caption">Code {o.promoCode}: {ugx(o.discount)} off</p>}
                      <p className="text-body">{o.lines.map((l) => `${l.quantity} x ${l.name}${l.options.length ? ` (${l.options.map((x) => x.name).join(", ")})` : ""}`).join("; ")}</p>
                      {o.allergies && <p className="text-label text-error">Allergies: {o.allergies}</p>}
                      {o.notes && <p className="text-caption">{o.notes}</p>}
                      <div className="flex flex-wrap gap-2">
                        {o.next.map((n) => <Button key={n} disabled={move.isPending} onClick={() => move.mutate({ id: o.id, status: n })}>{words(n)}</Button>)}
                        {status !== "delivered" && status !== "on_the_way" && <Button variant="text" onClick={() => cancel.mutate({ id: o.id, reason: "Cancelled by staff" })}>Cancel</Button>}
                      </div>
                    </Card>
                  ))}
                </section>
              ))}
            </div>
          )}
        </LiveData>
        <ReviewsPanel outlet={outlet} />
      </div>
    </>
  );
}
