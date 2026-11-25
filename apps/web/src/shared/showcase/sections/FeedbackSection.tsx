"use client";
// Showcase: banners, toasts, the four kinds of dialog, the loader and skeletons.
// The dialog buttons open real inventory dialogs of each tone, drawn by the
// same dialog host as every portal page.

import { catalog } from "@/shared/catalog/catalogIndex";
import type { DialogTone } from "@/shared/catalog/types";
import { hrefFor } from "@/shared/navigation/hrefFor";
import { StatusBanner } from "@/shared/ui/banner/StatusBanner";
import { Button } from "@/shared/ui/button/Button";
import { SpiralLoader } from "@/shared/ui/loader/SpiralLoader";
import { SkeletonList } from "@/shared/ui/skeleton/SkeletonList";
import { showToast } from "@/shared/ui/toast/toast";
import { ShowcaseSection } from "../ShowcaseSection";

const TONES: DialogTone[] = ["confirm", "danger", "warning", "sheet"];

/** Every kind of feedback the pages give. */
export function FeedbackSection() {
  // The first inventory dialog of each tone, so the samples are real dialogs.
  const samples = TONES.map((tone) => catalog.modules.flatMap((m) => m.dialogs).find((d) => d.tone === tone)!);
  return (
    <ShowcaseSection title="Banners, pop-ups and loading">
      <StatusBanner tone="offline" message="Offline. Changes are saved on this device." />
      <StatusBanner tone="clientView" message="You are seeing the portal as a guest sees it." />
      <StatusBanner tone="info" message="Tip: tap a card to see its holder." />
      <div className="flex flex-wrap gap-2">
        {samples.map((d) => (
          <Button key={d.id} variant="secondary" href={hrefFor(d.id, "/design-system")}>
            <span className="capitalize">{d.tone}</span>
          </Button>
        ))}
        <Button variant="secondary" onClick={() => showToast("Saved")}>Toast</Button>
      </div>
      <SpiralLoader />
      <SkeletonList rows={2} />
    </ShowcaseSection>
  );
}
