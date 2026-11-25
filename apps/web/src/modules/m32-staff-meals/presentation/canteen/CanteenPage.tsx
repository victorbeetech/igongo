"use client";
// S32-03 Canteen screen (and S32-02 Claim meal): the canteen attendant taps
// or scans each staff card; the meal being served now is recorded, once a
// day per person. A second serving is refused with the person's name.

import { useServe } from "@/modules/m32-staff-meals/data/mealsApi";
import { staffLine } from "@/shared/api/types/staffRef";
import type { ScreenContext } from "@/shared/catalog/types";
import { PurposeText } from "@/shared/screens/parts/PurposeText";
import { Card } from "@/shared/ui/card/Card";
import { StatusChip } from "@/shared/ui/chip/StatusChip";
import { ScanEntry } from "@/shared/ui/scan/ScanEntry";

/** The canteen screen. */
export function CanteenPage({ screen }: { screen: ScreenContext }) {
  const serve = useServe();
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <div className="grid gap-3 p-4">
        <ScanEntry action="Serve meal" busy={serve.isPending} onScan={(scan) => serve.mutate(scan)} />
        {serve.data && (
          <Card>
            <StatusChip status="Given" />
            <p className="mt-1 text-title font-bold">{serve.data.mealName} for {serve.data.staff.name}</p>
            <p className="text-body">{staffLine(serve.data.staff)}</p>
          </Card>
        )}
      </div>
    </>
  );
}
