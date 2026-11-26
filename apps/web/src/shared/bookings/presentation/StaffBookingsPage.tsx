"use client";
// The staff list for one booking module (front desk, museum, pool, shop
// till, events team): the day's bookings, approve requests (with a quote for
// event enquiries), and check guests in by scanning the QR or typing the code.

import { useState } from "react";
import { LiveData } from "@/shared/api/LiveData";
import type { ScreenContext } from "@/shared/catalog/types";
import { ugx } from "@/shared/format/ugx";
import { hotelToday, words } from "@/shared/format/when";
import { PurposeText } from "@/shared/screens/parts/PurposeText";
import { Button } from "@/shared/ui/button/Button";
import { StatusChip } from "@/shared/ui/chip/StatusChip";
import { TextInput } from "@/shared/ui/field/TextInput";
import { ScanEntry } from "@/shared/ui/scan/ScanEntry";
import { DataTable } from "@/shared/ui/table/DataTable";
import { useApprove, useCheckIn, useDayBookings } from "../data/bookingsApi";
import type { BookingPlace } from "../types/bookingPlace";
import { whenOf } from "./MyBookingsPage";

export function StaffBookingsPage({ screen, place, allDays }: { screen: ScreenContext; place: BookingPlace; allDays?: boolean }) {
  const [date, setDate] = useState(allDays ? "" : hotelToday());
  const list = useDayBookings(place, date);
  const checkIn = useCheckIn(place);
  const approve = useApprove(place);
  const [quote, setQuote] = useState<Record<string, string>>({});
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <div className="grid gap-3 p-4">
        {/* Step 1: scan or type a ticket code to check a guest in. */}
        <ScanEntry action="Check in" busy={checkIn.isPending} onScan={(s) => checkIn.mutate("qr" in s ? s.qr : s.uid)} />
        {checkIn.data && <p role="status" className="text-body">{checkIn.data.guestName}: {checkIn.data.offeringName} x{checkIn.data.units}, checked in.</p>}
        {/* Step 2: the day's list (or every day). */}
        <TextInput label="Day (empty for every day)" type="date" value={date} onChange={setDate} />
        <LiveData query={list} name={screen.spec.name}>
          {(d) => (
            <DataTable
              rows={d.items}
              rowKey={(b) => b.id}
              empty="No bookings."
              columns={[
                { label: "Code", cell: (b) => b.code },
                { label: "Guest", cell: (b) => b.guestName },
                { label: "What", cell: (b) => `${b.offeringName} x${b.units}` },
                { label: "When", cell: (b) => whenOf(b) || "-" },
                { label: "Paid", cell: (b) => `${ugx(b.paid)} / ${ugx(b.total)}` },
                { label: "Status", cell: (b) => <StatusChip status={words(b.status)} /> },
                {
                  label: "Action",
                  cell: (b) =>
                    b.status === "requested" ? (
                      <span className="flex items-end gap-2">
                        <TextInput label="Quote (UGX)" type="number" value={quote[b.id] ?? ""} onChange={(q) => setQuote({ ...quote, [b.id]: q })} />
                        <Button onClick={() => approve.mutate({ id: b.id, ...(quote[b.id] ? { total: Number(quote[b.id]) } : {}) })}>Approve</Button>
                      </span>
                    ) : b.status === "confirmed" ? (
                      <Button variant="secondary" onClick={() => checkIn.mutate(b.code)}>Check in</Button>
                    ) : null,
                },
              ]}
            />
          )}
        </LiveData>
      </div>
    </>
  );
}
