// Showcase: the brand kit's state illustrations, in the tone each state uses.

import { StateIllustration } from "@/shared/ui/illustration/StateIllustration";
import type { IllustrationKind } from "@/shared/ui/illustration/illustrations.g";
import { ShowcaseSection } from "../ShowcaseSection";

// Each drawing and the text colour class it takes on the pages.
const DRAWINGS: [IllustrationKind, string][] = [
  ["empty", "text-muted"],
  ["error", "text-error"],
  ["offline", "text-warning"],
  ["success", "text-success"],
  ["denied", "text-warning"],
  ["not-found", "text-muted"],
];

/** Every state drawing with its name. */
export function IllustrationSection() {
  return (
    <ShowcaseSection title="Illustrations">
      <div className="flex flex-wrap gap-4">
        {DRAWINGS.map(([kind, cls]) => (
          <figure key={kind} className="grid justify-items-center gap-1">
            <StateIllustration kind={kind} className={cls} />
            <figcaption className="text-caption text-muted">{kind}</figcaption>
          </figure>
        ))}
      </div>
    </ShowcaseSection>
  );
}
