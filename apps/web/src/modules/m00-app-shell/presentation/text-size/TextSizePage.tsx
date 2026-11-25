"use client";
// S00-33 Text size setting on the web: Compact to Extra large, with a live
// preview. The browser's own zoom and font size apply on top.

import type { ScreenContext } from "@/shared/catalog/types";
import { setPreferences, usePreferences } from "@/shared/preferences/usePreferences";
import { TEXT_SIZES } from "@/shared/preferences/textSizes";
import { PurposeText } from "@/shared/screens/parts/PurposeText";
import { Card } from "@/shared/ui/card/Card";
import { SectionHeader } from "@/shared/ui/section/SectionHeader";

/** The text size setting. */
export function TextSizePage({ screen }: { screen: ScreenContext }) {
  const prefs = usePreferences();
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      {/* Step 1: the live preview at the chosen size. */}
      <Card className="m-4 max-w-xl">
        <div className="text-subtitle font-bold">Order 3023 is ready</div>
        <div className="text-body">1 kg fried beef, for pick-up at 16:00.</div>
        <div className="text-caption text-muted">Today 15:52</div>
      </Card>
      {/* Step 2: the five sizes; picking one changes every page at once. */}
      <SectionHeader title="Size" />
      <fieldset className="mx-4 max-w-xl rounded-md border border-line bg-surface">
        <legend className="sr-only">Text size</legend>
        {TEXT_SIZES.map((t) => (
          <label key={t.key} className="flex min-h-12 cursor-pointer items-center gap-3 border-b border-line px-4 last:border-b-0">
            <input type="radio" name="text-size" checked={prefs.textSize === t.key} onChange={() => setPreferences({ textSize: t.key })} className="size-4 accent-primary" />
            <span className="flex-1 text-subtitle">{t.label}</span>
            <span className="text-caption text-muted">{Math.round(t.scale * 100)}%</span>
          </label>
        ))}
      </fieldset>
    </>
  );
}
