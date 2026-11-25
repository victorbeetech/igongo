// Showcase: the logo shapes and the default staff card, from the brand kit.

import { Logo } from "@/shared/ui/logo/Logo";
import { StaffCard } from "@/shared/ui/staff-card/StaffCard";
import { ShowcaseSection } from "../ShowcaseSection";

/** The logo in each shape (it swaps colourway with the theme), and the black portrait card. */
export function BrandSection() {
  return (
    <ShowcaseSection title="Brand">
      <div className="flex flex-wrap items-center gap-8">
        <Logo shape="mark" height={56} />
        <Logo shape="horizontal" height={48} />
        <Logo shape="stacked" height={72} />
        <StaffCard width={180} />
      </div>
    </ShowcaseSection>
  );
}
