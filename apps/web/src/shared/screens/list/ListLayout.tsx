// The list layout: search, status filters, the module's records and links on.

import { catalog } from "@/shared/catalog/catalogIndex";
import type { ScreenContext } from "@/shared/catalog/types";
import { hrefFor } from "@/shared/navigation/hrefFor";
import { FilterChips } from "@/shared/ui/chip/FilterChips";
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
      <FilterChips label="Filter by status" options={["All", ...mock.statuses]} />
      <SampleRows mock={mock} href={first ? hrefFor(first, catalog.hrefOf(screen.spec)) : undefined} />
      <LinkRows screen={screen} />
      <DialogButtons screen={screen} />
    </>
  );
}
