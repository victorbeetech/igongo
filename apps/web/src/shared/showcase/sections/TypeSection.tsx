// Showcase: the seven text styles, each written in itself, with its size.

import { tokens } from "@igongo/design-tokens/tokens";
import { ShowcaseSection } from "../ShowcaseSection";

// Each style's Tailwind class (from globals.css) and its token.
const STYLES = [
  ["Display", "font-brand text-display", tokens.type.display],
  ["Headline", "text-headline font-bold", tokens.type.headline],
  ["Title", "text-title font-semibold", tokens.type.title],
  ["Subtitle", "text-subtitle font-semibold", tokens.type.subtitle],
  ["Body", "text-body", tokens.type.body],
  ["Label", "text-label font-medium", tokens.type.label],
  ["Caption", "text-caption text-muted", tokens.type.caption],
] as const;

/** Every text style at the current text size. */
export function TypeSection() {
  return (
    <ShowcaseSection title="Type">
      {STYLES.map(([name, cls, t]) => (
        <p key={name} className={cls}>
          {name} · {t.size}/{t.lineHeight}
        </p>
      ))}
    </ShowcaseSection>
  );
}
