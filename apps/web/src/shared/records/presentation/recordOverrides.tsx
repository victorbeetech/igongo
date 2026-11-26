// Turns a records module's short screen map into its hand-made web pages,
// so each module's overrides.tsx is a few lines of data:
//
//   recordOverrides(PLACE, { "S46-01": ["list", { staff: true }], "S46-02": ["form", { types: ["found"], staff: true }] })

import type { ScreenContext, ScreenOverrides } from "@/shared/catalog/types";
import type { RecordPlace } from "../types/recordPlace";
import { RecordBoardPage } from "./RecordBoardPage";
import { RecordFormPage } from "./RecordFormPage";
import { RecordListPage, type ListView } from "./RecordListPage";
import { RecordScanPage } from "./RecordScanPage";
import { RecordSettingsPage } from "./RecordSettingsPage";

/** Which shared page a screen uses, and how. */
export type RecordScreen = ["list" | "board" | "form", ListView?] | ["settings" | "scan"];

export function recordOverrides(place: RecordPlace, screens: Record<string, RecordScreen>): ScreenOverrides {
  return Object.fromEntries(
    Object.entries(screens).map(([id, [page, view]]) => [
      id,
      (s: ScreenContext) => {
        switch (page) {
          case "list":
            return <RecordListPage screen={s} place={place} {...(view ? { view } : {})} />;
          case "board":
            return <RecordBoardPage screen={s} place={place} {...(view ? { view } : {})} />;
          case "form":
            return <RecordFormPage screen={s} place={place} {...(view?.types ? { types: view.types } : {})} {...(view?.staff ? { staff: true } : {})} />;
          case "settings":
            return <RecordSettingsPage screen={s} place={place} />;
          case "scan":
            return <RecordScanPage screen={s} place={place} />;
        }
      },
    ]),
  );
}
