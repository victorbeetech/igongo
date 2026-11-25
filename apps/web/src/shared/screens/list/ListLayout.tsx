// The list layout: search, status filters, the module's records and links on.

import { catalog } from "@/shared/catalog/catalogIndex";
import type { ScreenContext } from "@/shared/catalog/types";
import { hrefFor } from "@/shared/navigation/hrefFor";
import { SearchField } from "@/shared/ui/search/SearchField";
import { DialogButtons } from "../parts/DialogButtons";
import { LinkRows } from "../parts/LinkRows";
import { PurposeText } from "../parts/PurposeText";
import { SampleRows } from "../parts/SampleRows";

/** A searchable, filterable list of records. */
export function ListLayout({ screen }: { screen: ScreenContext }) {
  const mock = screen.module.mock;
  // A record opens the first page this list leads to, if any.
  const first = screen.links[0];
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <div className="px-4 py-2">
        <SearchField hint={`Search ${screen.spec.name.toLowerCase()}`} />
      </div>
      {/* The status filters; "All" is selected. */}
      <div className="flex gap-2 overflow-x-auto px-4 pb-3">
        {["All", ...mock.statuses].map((s, i) => (
          <span key={s} aria-pressed={i === 0} className={`shrink-0 rounded-full border px-3 py-1 text-label ${i === 0 ? "border-primary bg-primary-container text-on-primary-container" : "border-line"}`}>
            {s}
          </span>
        ))}
      </div>
      <SampleRows mock={mock} href={first ? hrefFor(first, catalog.hrefOf(screen.spec)) : undefined} />
      <LinkRows screen={screen} />
      <DialogButtons screen={screen} />
    </>
  );
}
