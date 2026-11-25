"use client";
// S16-19 My card: my staff card's number, status and QR text, to show at a
// station when the card is not at hand.

import { CARD_STATUS_WORDS, useMyCard } from "@/modules/m16-staff-cards/data/cardsApi";
import { LiveData } from "@/shared/api/LiveData";
import { staffLine } from "@/shared/api/types/staffRef";
import type { ScreenContext } from "@/shared/catalog/types";
import { Card } from "@/shared/ui/card/Card";
import { StatusChip } from "@/shared/ui/chip/StatusChip";

/** My card. */
export function MyCardPage({ screen }: { screen: ScreenContext }) {
  const mine = useMyCard();
  return (
    <LiveData query={mine} name={screen.spec.name}>
      {(d) => (
        <div className="grid gap-3 p-4">
          <Card>
            <p className="text-title font-bold">{staffLine(d.holder)}</p>
            {d.card ? (
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <span className="text-body">Card {d.card.cardNumber}</span>
                <StatusChip status={CARD_STATUS_WORDS[d.card.status]} />
              </div>
            ) : (
              <p className="text-body text-muted">You have no card yet. Ask HR to issue one.</p>
            )}
          </Card>
        </div>
      )}
    </LiveData>
  );
}
