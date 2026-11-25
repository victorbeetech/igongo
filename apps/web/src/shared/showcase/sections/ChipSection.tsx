// Showcase: status chips in every tone. Each has a dot and a word, never colour alone.

import { StatusChip } from "@/shared/ui/chip/StatusChip";
import { ShowcaseSection } from "../ShowcaseSection";

/** One chip per status tone: success, warning, error, info and neutral. */
export function ChipSection() {
  return (
    <ShowcaseSection title="Status chips">
      <div className="flex flex-wrap gap-2">
        {["Paid", "Pending", "Blocked", "Scheduled", "Archived"].map((s) => <StatusChip key={s} status={s} />)}
      </div>
    </ShowcaseSection>
  );
}
