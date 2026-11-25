// The target for an NFC tap or QR scan: a pulsing ring around a card icon.

import { Nfc } from "lucide-react";

/** A pulsing ring that asks for a card, wristband or QR code. */
export function ScanFrame() {
  return (
    <div className="flex flex-col items-center gap-3 py-8 text-center">
      <div className="pulse flex size-40 items-center justify-center rounded-full border-4 border-primary bg-primary-container text-primary">
        <Nfc size={64} aria-hidden />
      </div>
      <p className="text-subtitle font-bold">Hold the card, wristband or QR code here</p>
      <p className="text-caption text-muted">NFC reader or camera</p>
    </div>
  );
}
