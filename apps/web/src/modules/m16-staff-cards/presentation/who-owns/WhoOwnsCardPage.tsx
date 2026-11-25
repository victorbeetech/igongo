"use client";
// S16-15 Who owns this card: tap or scan any card to see its holder and
// status (gate, security, HR). Unknown and lost cards say so clearly.

import { CARD_STATUS_WORDS, useResolveCard } from "@/modules/m16-staff-cards/data/cardsApi";
import { staffLine } from "@/shared/api/types/staffRef";
import type { ScreenContext } from "@/shared/catalog/types";
import { PurposeText } from "@/shared/screens/parts/PurposeText";
import { Card } from "@/shared/ui/card/Card";
import { StatusChip } from "@/shared/ui/chip/StatusChip";
import { ScanEntry } from "@/shared/ui/scan/ScanEntry";

/** The card lookup page. */
export function WhoOwnsCardPage({ screen }: { screen: ScreenContext }) {
  const resolve = useResolveCard();
  const found = resolve.data;
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <div className="grid gap-3 p-4">
        <ScanEntry action="Find card" busy={resolve.isPending} onScan={(scan) => resolve.mutate(scan)} />
        {found && (
          <Card>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-title font-bold">Card {found.card.cardNumber}</h2>
              <StatusChip status={CARD_STATUS_WORDS[found.card.status]} />
            </div>
            <p className="text-body">{found.holder ? staffLine(found.holder) : "Nobody holds this card."}</p>
          </Card>
        )}
      </div>
    </>
  );
}
