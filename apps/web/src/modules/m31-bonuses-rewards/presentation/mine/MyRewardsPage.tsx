"use client";
// S31-01 My rewards: buffet passes I can use now (big number), and every
// cash bonus and pass I have been given.

import { useMyRewards } from "@/modules/m31-bonuses-rewards/data/bonusesApi";
import { LiveData } from "@/shared/api/LiveData";
import type { ScreenContext } from "@/shared/catalog/types";
import { ugx } from "@/shared/format/ugx";
import { words } from "@/shared/format/when";
import { PurposeText } from "@/shared/screens/parts/PurposeText";
import { KpiCard } from "@/shared/ui/kpi/KpiCard";
import { ListRow } from "@/shared/ui/list-row/ListRow";

/** The page. */
export function MyRewardsPage({ screen }: { screen: ScreenContext }) {
  const mine = useMyRewards();
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <LiveData query={mine} name="Rewards">
        {(d) => (
          <div className="grid gap-3 p-4">
            <div className="max-w-xs"><KpiCard label="Buffet passes you can use" value={String(d.passesLeft)} /></div>
            {d.items.length === 0 && <p className="text-body text-muted">No rewards yet.</p>}
            {d.items.map((b) => (
              <ListRow
                key={b.id}
                title={b.kind === "cash" ? `Cash bonus ${ugx(b.amount)}` : `${b.passes} buffet pass${b.passes === 1 ? "" : "es"} (${b.passesUsed} used)`}
                subtitle={`${b.reason} · from ${b.awardedByName}${b.validUntil ? ` · valid until ${b.validUntil}` : ""}`}
                status={words(b.status)}
              />
            ))}
          </div>
        )}
      </LiveData>
    </>
  );
}
