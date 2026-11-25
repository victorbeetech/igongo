// The map layout: the site map, then the places on it.

import type { ScreenContext } from "@/shared/catalog/types";
import { MapPlaceholder } from "@/shared/ui/map/MapPlaceholder";
import { DialogButtons } from "../parts/DialogButtons";
import { LinkRows } from "../parts/LinkRows";
import { PurposeText } from "../parts/PurposeText";
import { SampleRows } from "../parts/SampleRows";

/** A map or floor plan with the places on it. */
export function MapLayout({ screen }: { screen: ScreenContext }) {
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <div className="p-4">
        <MapPlaceholder />
      </div>
      <SampleRows mock={screen.module.mock} count={3} />
      <LinkRows screen={screen} />
      <DialogButtons screen={screen} />
    </>
  );
}
