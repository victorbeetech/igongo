// The hub layout: a module home or the guest home, as tiles, one per page it opens.

import { catalog } from "@/shared/catalog/catalogIndex";
import type { ScreenContext } from "@/shared/catalog/types";
import { hrefFor } from "@/shared/navigation/hrefFor";
import { iconFor } from "@/shared/ui/icons/moduleIcons";
import { HomeTile } from "@/shared/ui/tile/HomeTile";
import { DialogButtons } from "../parts/DialogButtons";
import { PurposeText } from "../parts/PurposeText";
import { TileGrid } from "./TileGrid";

/** A grid of tiles that open the hub's pages. */
export function HubLayout({ screen }: { screen: ScreenContext }) {
  const here = catalog.hrefOf(screen.spec);
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <div className="p-4">
        <TileGrid>
          {screen.links.map((id) => {
            const Icon = iconFor(id);
            return <HomeTile key={id} label={catalog.nameOf(id)} icon={<Icon size={20} />} href={hrefFor(id, here)} />;
          })}
        </TileGrid>
      </div>
      <DialogButtons screen={screen} />
    </>
  );
}
