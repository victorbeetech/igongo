// Showcase: the four button variants, with an icon and full width.

import { Plus } from "lucide-react";
import { Button } from "@/shared/ui/button/Button";
import { ShowcaseSection } from "../ShowcaseSection";

/** Every button variant. The buttons only show their look. */
export function ButtonSection() {
  const noop = () => {};
  return (
    <ShowcaseSection title="Buttons">
      <div className="flex flex-wrap gap-2">
        <Button onClick={noop}>Save</Button>
        <Button onClick={noop} icon={<Plus size={16} aria-hidden />}>Add staff</Button>
        <Button onClick={noop} variant="secondary">Export</Button>
        <Button onClick={noop} variant="danger">Block card</Button>
        <Button onClick={noop} variant="text">Cancel</Button>
      </div>
      <Button onClick={noop} block>Full width</Button>
    </ShowcaseSection>
  );
}
