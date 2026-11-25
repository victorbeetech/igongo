// The buttons that open a page's dialogs: confirmations, sheets and warnings.

import { catalog } from "@/shared/catalog/catalogIndex";
import type { ScreenContext } from "@/shared/catalog/types";
import { hrefFor } from "@/shared/navigation/hrefFor";
import { Button } from "@/shared/ui/button/Button";

/** One button per dialog the page opens. */
export function DialogButtons({ screen }: { screen: ScreenContext }) {
  if (screen.spec.dialogs.length === 0) return null;
  const here = catalog.hrefOf(screen.spec);
  return (
    <div className="flex flex-wrap gap-2 p-4">
      {screen.spec.dialogs.map((id) => (
        <Button key={id} variant="secondary" href={hrefFor(id, here)}>
          {catalog.nameOf(id)}
        </Button>
      ))}
    </div>
  );
}
