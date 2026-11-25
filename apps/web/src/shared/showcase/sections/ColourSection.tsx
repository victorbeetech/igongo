// Showcase: every colour token, light and dark side by side, with its value.
// Igongo red and deep red are the same in both columns: the brand never changes.

import { tokens } from "@igongo/design-tokens/tokens";
import { ShowcaseSection } from "../ShowcaseSection";

/** One swatch: a filled box with the hex value under it. */
function Swatch({ colour }: { colour: string }) {
  return (
    <div className="grid gap-1">
      <span className="block h-8 rounded-sm border border-line" style={{ background: colour }} />
      <span className="text-caption text-muted tabular-nums">{colour}</span>
    </div>
  );
}

/** A row per token: its name, then the light and dark swatches. */
export function ColourSection() {
  const names = Object.keys(tokens.color.light) as (keyof typeof tokens.color.light)[];
  return (
    <ShowcaseSection title="Colours">
      <div className="grid grid-cols-[minmax(0,1fr)_5rem_5rem] items-end gap-x-3 gap-y-2 sm:grid-cols-[12rem_6rem_6rem]">
        <span className="text-label font-bold">Token</span>
        <span className="text-label font-bold">Light</span>
        <span className="text-label font-bold">Dark</span>
        {names.map((n) => (
          <div key={n} className="contents">
            <span className="truncate text-label">{n}</span>
            <Swatch colour={tokens.color.light[n]} />
            <Swatch colour={tokens.color.dark[n]} />
          </div>
        ))}
      </div>
    </ShowcaseSection>
  );
}
