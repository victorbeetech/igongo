// The rows that lead from a page to the pages it opens, so every page is
// connected exactly as the approved flows say.

import { catalog } from "@/shared/catalog/catalogIndex";
import type { ScreenContext } from "@/shared/catalog/types";
import { subtitleFor } from "@/shared/mock/sampleText";
import { hrefFor } from "@/shared/navigation/hrefFor";
import { iconFor } from "@/shared/ui/icons/moduleIcons";
import { ListRow } from "@/shared/ui/list-row/ListRow";
import { SectionHeader } from "@/shared/ui/section/SectionHeader";

/** One row per page this one opens. Pages with Back only draw nothing. */
export function LinkRows({ screen, title = "Go to" }: { screen: ScreenContext; title?: string }) {
  if (screen.links.length === 0) return null;
  const here = catalog.hrefOf(screen.spec);
  return (
    <section>
      <SectionHeader title={title} />
      <div className="mx-4 overflow-hidden rounded-md border border-line bg-surface">
        {screen.links.map((id, i) => {
          const Icon = iconFor(id);
          return <ListRow key={id} title={catalog.nameOf(id)} subtitle={subtitleFor(i)} leading={<Icon size={20} />} href={hrefFor(id, here)} />;
        })}
      </div>
    </section>
  );
}
