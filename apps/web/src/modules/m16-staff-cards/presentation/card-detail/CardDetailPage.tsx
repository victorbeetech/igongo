"use client";
// S16-09 Card detail (with S16-10 Issue card, S16-13 Encode, S16-17 Lost and
// S16-18 Reset): one card, its holder, its QR text and its whole history.

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { CARD_STATUS_WORDS, useCard, useCardAction, type CardHistoryEntry, type StaffCardRecord } from "@/modules/m16-staff-cards/data/cardsApi";
import { api } from "@/shared/api/apiClient";
import { LiveData } from "@/shared/api/LiveData";
import { staffLine, type StaffRef } from "@/shared/api/types/staffRef";
import type { ScreenContext } from "@/shared/catalog/types";
import { recordIdOf } from "@/shared/navigation/recordId";
import { useAddress } from "@/shared/navigation/useAddress";
import { Button } from "@/shared/ui/button/Button";
import { Card } from "@/shared/ui/card/Card";
import { StatusChip } from "@/shared/ui/chip/StatusChip";
import { CopyField } from "@/shared/ui/field/CopyField";
import { SelectInput } from "@/shared/ui/field/SelectInput";
import { TextInput } from "@/shared/ui/field/TextInput";
import { SectionHeader } from "@/shared/ui/section/SectionHeader";
import { DataTable } from "@/shared/ui/table/DataTable";

/** The card detail page; the card ID is the last part of the address. */
export function CardDetailPage({ screen }: { screen: ScreenContext }) {
  const card = useCard(recordIdOf(useAddress().path));
  return <LiveData query={card} name={screen.spec.name}>{(d) => <CardBody card={d.card} holder={d.holder} history={d.history} />}</LiveData>;
}

/** The loaded card and its actions. */
function CardBody({ card, holder, history }: { card: StaffCardRecord; holder: StaffRef | null; history: CardHistoryEntry[] }) {
  const act = useCardAction(card.cardId);
  const [uid, setUid] = useState(card.uid ?? "");
  return (
    <div className="grid gap-4 p-4">
      <Card>
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-title font-bold">Card {card.cardNumber}</h2>
          <StatusChip status={CARD_STATUS_WORDS[card.status]} />
        </div>
        <p className="mt-1 text-body">{holder ? `Held by ${staffLine(holder)}` : "In stock, no holder"}</p>
        <p className="text-caption text-muted">Chip {card.uid ?? "not encoded yet"} · {card.cardType} · design {card.templateKey}</p>
        <div className="mt-2"><CopyField label="QR code text (printed on the card)" value={card.qr} /></div>
        <div className="mt-3 flex flex-wrap gap-2">
          {card.status !== "unassigned" && <Button variant="secondary" onClick={() => act.mutate({ action: "reset" })}>Reset to stock</Button>}
          {card.status === "active" && <Button variant="danger" onClick={() => act.mutate({ action: "lost" })}>Report lost</Button>}
        </div>
      </Card>
      {card.status === "unassigned" && <IssueForm onIssue={(staffId) => act.mutate({ action: "issue", body: { staffId } })} busy={act.isPending} />}
      <form className="flex flex-wrap items-end gap-2" onSubmit={(e) => { e.preventDefault(); act.mutate({ action: "encode", body: { uid } }); }}>
        <div className="min-w-56 flex-1"><TextInput label="Chip UID (tap the card on the encoder)" value={uid} onChange={setUid} /></div>
        <Button type="submit" variant="secondary">Save chip UID</Button>
      </form>
      <SectionHeader title="History" />
      <DataTable rows={history} rowKey={(h) => h.id} columns={[{ label: "When", cell: (h) => new Date(h.at).toLocaleString() }, { label: "What", cell: (h) => h.action }]} />
    </div>
  );
}

/** Picks an active staff member to give the card to. */
function IssueForm({ onIssue, busy }: { onIssue: (staffId: string) => void; busy: boolean }) {
  const staff = useQuery({ queryKey: ["hr-staff", "active"], queryFn: () => api<{ items: StaffRef[] }>("/api/hr/staff?status=active&limit=200") });
  const [staffId, setStaffId] = useState("");
  const options: [string, string][] = [["", "Choose a staff member"], ...(staff.data?.items ?? []).map((s): [string, string] => [s.staffId, staffLine(s)])];
  return (
    <form className="flex flex-wrap items-end gap-2" onSubmit={(e) => { e.preventDefault(); if (staffId) onIssue(staffId); }}>
      <div className="min-w-56 flex-1"><SelectInput label="Issue this card to" value={staffId} onChange={setStaffId} options={options} /></div>
      <Button type="submit" disabled={busy || !staffId}>Issue card</Button>
    </form>
  );
}
