"use client";
// The guest's own bookings for one module: code and QR text, dates, status,
// what is owed with a Pay button, and Cancel while the rules allow it.

import { LiveData } from "@/shared/api/LiveData";
import type { ScreenContext } from "@/shared/catalog/types";
import { ugx } from "@/shared/format/ugx";
import { words } from "@/shared/format/when";
import { PurposeText } from "@/shared/screens/parts/PurposeText";
import { Button } from "@/shared/ui/button/Button";
import { Card } from "@/shared/ui/card/Card";
import { StatusChip } from "@/shared/ui/chip/StatusChip";
import { useCancelBooking, useMyBookings } from "../data/bookingsApi";
import type { Booking } from "../types/booking";
import type { BookingPlace } from "../types/bookingPlace";
import { PayButton } from "@/shared/ui/pay/PayButton";

/** When a booking is for, in words. */
export const whenOf = (b: Booking) => [b.date, b.endDate && `to ${b.endDate}`, b.slot && `at ${b.slot}`].filter(Boolean).join(" ");

export function MyBookingsPage({ screen, place }: { screen: ScreenContext; place: BookingPlace }) {
  const mine = useMyBookings(place);
  const cancel = useCancelBooking(place);
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <div className="grid gap-3 p-4">
        <LiveData query={mine} name={screen.spec.name} isEmpty={(d) => d.items.length === 0}>
          {(d) =>
            d.items.map((b) => (
              <Card key={b.id} className="grid gap-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-subtitle font-bold">{b.offeringName}</h3>
                  <StatusChip status={words(b.status)} />
                </div>
                <p className="text-body">{b.code} · {b.units} {place.unit}{b.units > 1 ? "s" : ""} {whenOf(b)}</p>
                <p className="text-caption text-muted">Show this code at the door: {b.qr}</p>
                {b.total > 0 && <p className="text-label">{ugx(b.paid)} paid of {ugx(b.total)}</p>}
                <div className="flex flex-wrap gap-2">
                  <PayButton module={place.module} recordId={b.id} owed={b.status === "requested" || b.status === "cancelled" ? 0 : b.total - b.paid} />
                  {(b.status === "confirmed" || b.status === "awaiting_payment" || b.status === "requested") && (
                    <Button variant="secondary" disabled={cancel.isPending} onClick={() => cancel.mutate({ id: b.id, reason: "Cancelled by the guest" })}>Cancel</Button>
                  )}
                </div>
              </Card>
            ))
          }
        </LiveData>
      </div>
    </>
  );
}
