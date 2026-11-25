// Sample records for a list, from the module's sample data.

import type { ModuleMock } from "@/shared/catalog/types";
import { statusFor, subtitleFor } from "@/shared/mock/sampleText";
import { ListRow } from "@/shared/ui/list-row/ListRow";

/** Up to [count] rows of the module's sample records, each linking to [href]. */
export function SampleRows({ mock, count = 6, href }: { mock: ModuleMock; count?: number; href?: string }) {
  return (
    <div className="mx-4 overflow-hidden rounded-md border border-line bg-surface">
      {mock.items.slice(0, count).map((item, i) => (
        <ListRow key={item} title={item} subtitle={subtitleFor(i)} status={statusFor(mock, i)} href={href} />
      ))}
    </div>
  );
}
