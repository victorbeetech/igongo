"use client";
// S66-03 to S66-09, the rider's screens on the web (the app has the same):
// go online, share location, current deliveries with each step (accept,
// pick up, navigate in Google Maps, call the guest, deliver with the guest's
// code and cash collected, or report a problem), today's trips, earnings and
// cash in hand.

import { useState } from "react";
import { useGoOnline, useJobStep, useMyShift, usePing } from "@/modules/m66-delivery-riders/data/deliveryApi";
import type { DeliveryJob } from "@/modules/m66-delivery-riders/domain/deliveryJob";
import { mapsLink } from "@/modules/m66-delivery-riders/domain/mapsLink";
import { LiveData } from "@/shared/api/LiveData";
import type { ScreenContext } from "@/shared/catalog/types";
import { ugx } from "@/shared/format/ugx";
import { words } from "@/shared/format/when";
import { PurposeText } from "@/shared/screens/parts/PurposeText";
import { Button } from "@/shared/ui/button/Button";
import { Card } from "@/shared/ui/card/Card";
import { StatusChip } from "@/shared/ui/chip/StatusChip";
import { TextInput } from "@/shared/ui/field/TextInput";
import { KpiCard } from "@/shared/ui/kpi/KpiCard";
import { SwitchRow } from "@/shared/ui/switch/SwitchRow";

export function RiderHomePage({ screen }: { screen: ScreenContext }) {
  const shift = useMyShift();
  const online = useGoOnline();
  const ping = usePing();
  // The browser's location, sent once per press (the app sends it on its own).
  const share = () => navigator.geolocation?.getCurrentPosition((p) => ping.mutate({ lat: p.coords.latitude, lng: p.coords.longitude }));
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <div className="grid gap-3 p-4">
        <LiveData query={shift} name="Your shift">
          {(s) => (
            <>
              <SwitchRow label="Online for deliveries" on={!!s.status?.online} onChange={(on) => online.mutate(on)} />
              {s.status?.online && <Button variant="secondary" onClick={share}>Share my location</Button>}
              <div className="grid grid-cols-3 gap-2">
                <KpiCard label="Trips today" value={String(s.tripsToday)} />
                <KpiCard label="Earned today" value={ugx(s.earningsToday)} />
                <KpiCard label="Cash in hand" value={ugx(s.cashInHand)} />
              </div>
              {s.current.length === 0 && <p className="text-body text-muted">No deliveries for you right now.</p>}
              {s.current.map((j) => <JobCard key={j.id} job={j} />)}
            </>
          )}
        </LiveData>
      </div>
    </>
  );
}

/** One current delivery and its next step. */
function JobCard({ job: j }: { job: DeliveryJob }) {
  const step = useJobStep();
  const [code, setCode] = useState("");
  const [cash, setCash] = useState(String(j.cashToCollect));
  return (
    <Card className="grid gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="text-subtitle font-bold">{j.orderNumber}</h3>
        <StatusChip status={words(j.status)} />
      </div>
      <p className="text-body">{j.customerName} · {j.place.label}</p>
      {j.cashToCollect > 0 && <p className="text-label">Collect {ugx(j.cashToCollect)}</p>}
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" href={mapsLink(j)}>Navigate</Button>
        {j.customerPhone && <Button variant="secondary" href={`tel:${j.customerPhone}`}>Call guest</Button>}
        {j.status === "assigned" && <Button onClick={() => step.mutate({ jobId: j.id, step: "accept" })}>Accept</Button>}
        {(j.status === "assigned" || j.status === "accepted") && <Button onClick={() => step.mutate({ jobId: j.id, step: "pickup" })}>Picked up</Button>}
        {(j.status === "assigned" || j.status === "accepted") && <Button variant="text" onClick={() => step.mutate({ jobId: j.id, step: "decline" })}>Hand back</Button>}
      </div>
      {j.status === "picked_up" && (
        <div className="grid gap-2 sm:grid-cols-3">
          <TextInput label="Guest's code" value={code} onChange={setCode} />
          <TextInput label="Cash collected (UGX)" type="number" value={cash} onChange={setCash} />
          <Button onClick={() => step.mutate({ jobId: j.id, step: "deliver", body: { ...(code ? { code } : {}), cashCollected: Number(cash) || 0 } })}>Delivered</Button>
          <Button variant="danger" onClick={() => step.mutate({ jobId: j.id, step: "fail", body: { reason: "Guest not found" } })}>Could not deliver</Button>
        </div>
      )}
    </Card>
  );
}
