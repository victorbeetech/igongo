"use client";
// The one page of the static preview: reads the address after `#`, finds its
// screen and draws it with the same ScreenPage as the normal build.

import { useSyncExternalStore } from "react";
import { screenFor } from "@/shared/catalog/screenFor";
import { ScreenPage } from "@/shared/page/ScreenPage";
import { HashLinks } from "./HashLinks";
import { readHash, splitAddress, subscribeHash } from "./hashAddress";
import { PREVIEW_START } from "./staticPreview";

/** Draws the screen named after `#`; the start screen when none is named. */
export function PreviewRoot() {
  // Step 1: the address, kept in step with Back, Forward and every link.
  const address = useSyncExternalStore(subscribeHash, readHash, () => PREVIEW_START);
  // Step 2: its screen; an unknown address shows the role switcher.
  const spec = screenFor(splitAddress(address).path) ?? screenFor(PREVIEW_START)!;
  return (
    <>
      <HashLinks />
      <ScreenPage key={spec.id} id={spec.id} />
    </>
  );
}
