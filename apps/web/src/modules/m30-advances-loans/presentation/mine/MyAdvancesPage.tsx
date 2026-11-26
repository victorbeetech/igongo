"use client";
// S30-01 My advances: my advances and loans, what is left to repay, and a
// way to take back a request nobody has decided yet.

import { useCancelAdvance, useMyAdvances } from "@/modules/m30-advances-loans/data/advancesApi";
import { LiveData } from "@/shared/api/LiveData";
import { catalog } from "@/shared/catalog/catalogIndex";
import type { ScreenContext } from "@/shared/catalog/types";
import { ugx } from "@/shared/format/ugx";
import { words } from "@/shared/format/when";
import { PurposeText } from "@/shared/screens/parts/PurposeText";
import { Button } from "@/shared/ui/button/Button";
import { Card } from "@/shared/ui/card/Card";
import { StatusChip } from "@/shared/ui/chip/StatusChip";

/** The page. */
export function MyAdvancesPage({ screen }: { screen: ScreenContext }) {
  const mine = useMyAdvances();
  const cancel = useCancelAdvance();
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <div className="grid gap-3 p-4">
        <div><Button href={catalog.hrefOf(catalog.screen("S30-02")!)}>Ask for an advance</Button></div>
        <LiveData query={mine} name="Advances" isEmpty={(d) => d.items.length === 0}>
          {(d) => (
            <>
              {d.items.map((a) => (
                <Card key={a.id}>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-subtitle font-bold">{`${a.number} · ${words(a.kind)} of ${ugx(a.amount)}`}</span>
                    <StatusChip status={words(a.status)} />
                  </div>
                  <p className="text-caption text-muted">{`${a.instalments} × ${ugx(a.instalmentAmount)} from ${a.startPeriod} · repaid ${ugx(a.repaid)} · left ${ugx(Math.max(0, a.amount - a.repaid))}`}</p>
                  <p className="text-body">{a.reason}</p>
                  {a.decisionNote && <p className="text-caption">{`${a.decidedByName ?? ""}: ${a.decisionNote}`}</p>}
                  {a.status === "requested" && <Button variant="text" disabled={cancel.isPending} onClick={() => cancel.mutate(a.id)}>Take back</Button>}
                </Card>
              ))}
            </>
          )}
        </LiveData>
      </div>
    </>
  );
}
