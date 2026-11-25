// The scanner layout: the NFC and QR target, typing the number by hand, and
// where the page goes after a tap.

import { catalog } from "@/shared/catalog/catalogIndex";
import type { ScreenContext } from "@/shared/catalog/types";
import { hrefFor } from "@/shared/navigation/hrefFor";
import { Button } from "@/shared/ui/button/Button";
import { ScanFrame } from "@/shared/ui/scan/ScanFrame";
import { DialogButtons } from "../parts/DialogButtons";
import { LinkRows } from "../parts/LinkRows";
import { PurposeText } from "../parts/PurposeText";

/** Waits for a card, wristband or QR code. */
export function ScannerLayout({ screen }: { screen: ScreenContext }) {
  // In the prototype, "Simulate a tap" stands in for a real card.
  const next = screen.links[0];
  const href = next ? hrefFor(next, catalog.hrefOf(screen.spec)) : "/home";
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <ScanFrame />
      <div className="mx-auto grid max-w-sm gap-2 px-4">
        <Button href={href} block>Simulate a tap</Button>
        <Button href={href} variant="secondary" block>Enter number by hand</Button>
      </div>
      <LinkRows screen={screen} title="After the tap" />
      <DialogButtons screen={screen} />
    </>
  );
}
