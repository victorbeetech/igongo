// The detail layout: one record's header, its details and history.

import { History, StickyNote } from "lucide-react";
import type { ScreenContext } from "@/shared/catalog/types";
import { hintFor, PEOPLE, subtitleFor } from "@/shared/mock/sampleText";
import { InitialsAvatar } from "@/shared/ui/avatar/InitialsAvatar";
import { Card } from "@/shared/ui/card/Card";
import { StatusChip } from "@/shared/ui/chip/StatusChip";
import { ListRow } from "@/shared/ui/list-row/ListRow";
import { SectionHeader } from "@/shared/ui/section/SectionHeader";
import { DialogButtons } from "../parts/DialogButtons";
import { LinkRows } from "../parts/LinkRows";
import { PurposeText } from "../parts/PurposeText";

/** One record with its details and history. */
export function DetailLayout({ screen }: { screen: ScreenContext }) {
  const mock = screen.module.mock;
  const record = mock.items[0]!;
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      {/* The record's header with its status. */}
      <Card className="m-4 flex items-center gap-3">
        <InitialsAvatar name={record} size={56} />
        <div className="grid gap-1">
          <div className="text-title font-bold">{record}</div>
          <div className="text-caption text-muted">{subtitleFor(0)}</div>
          <StatusChip status={mock.statuses[0]!} />
        </div>
      </Card>
      <div className="grid gap-4 lg:grid-cols-2">
        {/* The details, one row per field. */}
        <section>
          <SectionHeader title="Details" />
          <div className="mx-4 rounded-md border border-line bg-surface">
            {mock.fields.map((f) => <ListRow key={f} title={f} subtitle={hintFor(f)} leading={<StickyNote size={18} />} />)}
          </div>
        </section>
        {/* The history, so every change can be traced (Audit Trail). */}
        <section>
          <SectionHeader title="History" />
          <div className="mx-4 rounded-md border border-line bg-surface">
            {[0, 1, 2].map((i) => <ListRow key={i} title={`${PEOPLE[i]} · ${mock.statuses[i % mock.statuses.length]}`} subtitle={subtitleFor(i)} leading={<History size={18} />} />)}
          </div>
        </section>
      </div>
      <LinkRows screen={screen} />
      <DialogButtons screen={screen} />
    </>
  );
}
