// The hand-made web pages of module 39 (Inspections), live from the API.

import type { ScreenOverrides } from "@/shared/catalog/types";
import { DuePage } from "./presentation/due/DuePage";
import { RunsListPage } from "./presentation/list/RunsListPage";
import { ResultPage } from "./presentation/result/ResultPage";
import { RunPage } from "./presentation/run/RunPage";
import { SchedulePage } from "./presentation/schedule/SchedulePage";

/** Module 39's hand-made web pages. */
export const m39Overrides: ScreenOverrides = {
  "S39-01": (s) => <DuePage screen={s} />,
  "S39-02": (s) => <RunPage screen={s} />,
  "S39-03": (s) => <ResultPage screen={s} />,
  "S39-04": (s) => <RunsListPage screen={s} />,
  "S39-05": (s) => <SchedulePage screen={s} />,
};
