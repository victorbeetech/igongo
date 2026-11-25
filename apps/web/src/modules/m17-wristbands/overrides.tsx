// The hand-made web pages of module 17 (Wristbands), connected to the live API.

import type { ScreenOverrides } from "@/shared/catalog/types";
import { BandScannerPage } from "./presentation/band-scanner/BandScannerPage";
import { WristbandsHomePage } from "./presentation/wristbands-home/WristbandsHomePage";

/** Module 17's hand-made web pages. */
export const m17Overrides: ScreenOverrides = {
  "S17-01": (s) => <WristbandsHomePage screen={s} />,
  "S17-03": (s) => <WristbandsHomePage screen={s} />,
  "S17-06": (s) => <WristbandsHomePage screen={s} />,
  "S17-07": (s) => <BandScannerPage screen={s} />,
};
