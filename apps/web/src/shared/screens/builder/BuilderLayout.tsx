// The builder layout: parts to drag, a canvas and Preview. Used by the super
// admin's role, layout, form, card and workflow builders. On the web the
// parts sit beside the canvas.

import { GripVertical } from "lucide-react";
import { catalog } from "@/shared/catalog/catalogIndex";
import type { ScreenContext } from "@/shared/catalog/types";
import { hrefFor } from "@/shared/navigation/hrefFor";
import { Button } from "@/shared/ui/button/Button";
import { SectionHeader } from "@/shared/ui/section/SectionHeader";
import { DialogButtons } from "../parts/DialogButtons";
import { LinkRows } from "../parts/LinkRows";
import { PurposeText } from "../parts/PurposeText";

/** A drag and drop builder: parts, canvas and actions. */
export function BuilderLayout({ screen }: { screen: ScreenContext }) {
  const fields = screen.module.mock.fields;
  const preview = screen.links[0];
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <div className="grid gap-4 p-4 lg:grid-cols-[240px_1fr]">
        {/* The parts that can be dragged onto the canvas. */}
        <div>
          <SectionHeader title="Parts" />
          <div className="flex flex-wrap gap-2 lg:flex-col">
            {fields.map((f) => (
              <span key={f} className="inline-flex items-center gap-1 rounded-full border border-line bg-surface-alt px-3 py-1 text-label">
                <GripVertical size={14} aria-hidden /> {f}
              </span>
            ))}
          </div>
        </div>
        {/* The canvas, with parts already placed. */}
        <div>
          <SectionHeader title="Canvas" />
          <div className="grid gap-2 rounded-md border border-dashed border-line bg-surface-alt p-3">
            {fields.slice(0, 3).map((f) => <div key={f} className="rounded-sm border border-line bg-surface p-3 text-label font-bold">{f}</div>)}
            <div className="text-center text-caption text-muted">Drag a part here</div>
          </div>
          <div className="mt-3 flex gap-2">
            <Button href={preview ? hrefFor(preview, catalog.hrefOf(screen.spec)) : "/home"}>Preview</Button>
          </div>
        </div>
      </div>
      <LinkRows screen={screen} />
      <DialogButtons screen={screen} />
    </>
  );
}
