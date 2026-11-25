"use client";
// S16-08 Cards list (and S16-01 Cards home): counts per status, every card
// with its holder, and adding a blank card to stock (with its chip UID when
// a reader is plugged in).

import { useState } from "react";
import { CARD_STATUS_WORDS, useCards, useCardSummary, useRegisterCard } from "@/modules/m16-staff-cards/data/cardsApi";
import { LiveData } from "@/shared/api/LiveData";
import { staffLine } from "@/shared/api/types/staffRef";
import { catalog } from "@/shared/catalog/catalogIndex";
import type { ScreenContext } from "@/shared/catalog/types";
import { recordHref } from "@/shared/navigation/recordId";
import { PurposeText } from "@/shared/screens/parts/PurposeText";
import { Button } from "@/shared/ui/button/Button";
import { FilterChips } from "@/shared/ui/chip/FilterChips";
import { TextInput } from "@/shared/ui/field/TextInput";
import { KpiCard } from "@/shared/ui/kpi/KpiCard";
import { ListRow } from "@/shared/ui/list-row/ListRow";

const FILTERS: [string, string][] = [["All", ""], ["Active", "active"], ["In stock", "unassigned"], ["Lost", "lost"]];

/** The cards list. */
export function CardsListPage({ screen }: { screen: ScreenContext }) {
  const [filter, setFilter] = useState("All");
  const cards = useCards(FILTERS.find(([w]) => w === filter)?.[1] ?? "");
  const summary = useCardSummary();
  const register = useRegisterCard();
  const [uid, setUid] = useState("");
  const detail = catalog.screen("S16-09")!;
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <div className="grid gap-3 p-4">
        {summary.data && (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {(Object.keys(CARD_STATUS_WORDS) as (keyof typeof CARD_STATUS_WORDS)[]).map((k) => <KpiCard key={k} label={CARD_STATUS_WORDS[k]} value={String(summary.data[k])} />)}
          </div>
        )}
        <form className="flex flex-wrap items-end gap-2" onSubmit={(e) => { e.preventDefault(); register.mutate(uid ? { uid } : {}, { onSuccess: () => setUid("") }); }}>
          <div className="min-w-56 flex-1"><TextInput label="New blank card: chip UID (optional, tap it on the reader)" value={uid} onChange={setUid} /></div>
          <Button type="submit" disabled={register.isPending}>Add card to stock</Button>
        </form>
        <FilterChips label="Status" options={FILTERS.map(([w]) => w)} value={filter} onChange={setFilter} />
        <LiveData query={cards} name="Cards" isEmpty={(d) => d.items.length === 0}>
          {(d) => (
            <ul className="grid rounded-md border border-line bg-surface">
              {d.items.map((c) => (
                <li key={c.cardId}>
                  <ListRow title={c.cardNumber} subtitle={c.holder ? staffLine(c.holder) : "No holder"} status={CARD_STATUS_WORDS[c.status]} href={recordHref(detail, c.cardId)} />
                </li>
              ))}
            </ul>
          )}
        </LiveData>
      </div>
    </>
  );
}
