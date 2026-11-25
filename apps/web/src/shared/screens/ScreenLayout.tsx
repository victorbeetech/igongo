// Picks the shared layout for a page from its kind. This is the only place
// that knows which layout draws which kind.

import type { ScreenContext, ScreenKind } from "@/shared/catalog/types";
import type { ComponentType } from "react";
import { BuilderLayout } from "./builder/BuilderLayout";
import { DashboardLayout } from "./dashboard/DashboardLayout";
import { DetailLayout } from "./detail/DetailLayout";
import { FormLayout } from "./form/FormLayout";
import { HubLayout } from "./home/HubLayout";
import { ListLayout } from "./list/ListLayout";
import { MapLayout } from "./map/MapLayout";
import { ResultLayout } from "./result/ResultLayout";
import { ScannerLayout } from "./scanner/ScannerLayout";
import { SettingsLayout } from "./settings/SettingsLayout";

// One layout per kind.
const LAYOUTS: Record<ScreenKind, ComponentType<{ screen: ScreenContext }>> = {
  home: HubLayout, dashboard: DashboardLayout, scanner: ScannerLayout, map: MapLayout, settings: SettingsLayout,
  builder: BuilderLayout, form: FormLayout, detail: DetailLayout, result: ResultLayout, list: ListLayout,
};

/** Draws [screen] with the shared layout for its kind. */
export function ScreenLayout({ screen }: { screen: ScreenContext }) {
  const Layout = LAYOUTS[screen.spec.kind];
  return <Layout screen={screen} />;
}
