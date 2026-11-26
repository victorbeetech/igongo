"use client";
// Guests' ratings and reviews of their orders, under the orders board, for
// staff: stars for the food and the delivery, the words (always shown as
// plain text, never run), and a button to hide a review that breaks the
// rules or show it again. Hidden reviews are not shown to guests.

import { useHideReview, useStaffReviews } from "@/modules/m62-food-ordering/data/ordersApi";
import { LiveData } from "@/shared/api/LiveData";
import { dayTimeOf } from "@/shared/format/when";
import { Button } from "@/shared/ui/button/Button";
import { StatusChip } from "@/shared/ui/chip/StatusChip";
import { SectionHeader } from "@/shared/ui/section/SectionHeader";
import { DataTable } from "@/shared/ui/table/DataTable";

/** Stars as text, such as "4 of 5". */
const stars = (n: number | null) => (n === null ? "-" : `${n} of 5`);

export function ReviewsPanel({ outlet }: { outlet: string }) {
  const reviews = useStaffReviews(outlet);
  const hide = useHideReview();
  return (
    <section aria-label="Ratings and reviews">
      <SectionHeader title="Ratings and reviews" />
      <LiveData query={reviews} name="Reviews">
        {(d) => (
          <DataTable
            rows={d.items}
            rowKey={(r) => r.orderId}
            empty="No reviews yet."
            columns={[
              { label: "When", cell: (r) => dayTimeOf(r.createdAt) },
              { label: "Guest", cell: (r) => r.name },
              { label: "Food", cell: (r) => stars(r.food) },
              { label: "Delivery", cell: (r) => stars(r.delivery) },
              { label: "Review", cell: (r) => r.comment ?? "-" },
              { label: "Shown", cell: (r) => <StatusChip status={r.hidden ? "Hidden" : "Shown"} /> },
              { label: "", cell: (r) => <Button variant="text" disabled={hide.isPending} onClick={() => hide.mutate({ orderId: r.orderId, hidden: !r.hidden })}>{r.hidden ? "Show" : "Hide"}</Button> },
            ]}
          />
        )}
      </LiveData>
    </section>
  );
}
