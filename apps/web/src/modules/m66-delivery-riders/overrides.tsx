// The hand-made web pages of module 66 (Delivery & Riders), live from the API.

import type { ScreenOverrides } from "@/shared/catalog/types";
import { DispatchPage } from "./presentation/dispatch/DispatchPage";
import { RiderHomePage } from "./presentation/rider-home/RiderHomePage";
import { ZonesPage } from "./presentation/zones/ZonesPage";

/** The rider's steps all live on the rider home on the web. */
const rider = (s: Parameters<ScreenOverrides[string]>[0]) => <RiderHomePage screen={s} />;

/** Module 66's hand-made web pages. */
export const m66Overrides: ScreenOverrides = {
  "S66-01": (s) => <DispatchPage screen={s} />,
  "S66-02": (s) => <ZonesPage screen={s} />,
  "S66-03": rider, "S66-04": rider, "S66-05": rider, "S66-06": rider, "S66-07": rider, "S66-08": rider, "S66-09": rider,
  "S66-11": (s) => <DispatchPage screen={s} />,
};
