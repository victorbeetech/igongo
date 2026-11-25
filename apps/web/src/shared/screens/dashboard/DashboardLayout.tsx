// The dashboard layout: four numbers, this week's chart and the latest records.

import type { ScreenContext } from "@/shared/catalog/types";
import { BarChart } from "@/shared/ui/chart/BarChart";
import { Card } from "@/shared/ui/card/Card";
import { KpiCard } from "@/shared/ui/kpi/KpiCard";
import { SectionHeader } from "@/shared/ui/section/SectionHeader";
import { DialogButtons } from "../parts/DialogButtons";
import { LinkRows } from "../parts/LinkRows";
import { PurposeText } from "../parts/PurposeText";
import { SampleRows } from "../parts/SampleRows";

// One sample week, the same on every dashboard until real data arrives.
const WEEK = { values: [0.4, 0.7, 0.55, 0.9, 0.65, 0.8, 0.5], labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] };

/** Numbers, a chart and the latest items. */
export function DashboardLayout({ screen }: { screen: ScreenContext }) {
  const mock = screen.module.mock;
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      {/* Two numbers per row on phones, four on wide screens. */}
      <div className="grid grid-cols-2 gap-2 p-4 lg:grid-cols-4">
        {mock.kpis.map(([label, value]) => <KpiCard key={label} label={label!} value={value!} />)}
      </div>
      <SectionHeader title="This week" />
      <Card className="mx-4">
        <BarChart {...WEEK} />
      </Card>
      <SectionHeader title="Latest" />
      <SampleRows mock={mock} count={3} />
      <LinkRows screen={screen} title="Open" />
      <DialogButtons screen={screen} />
    </>
  );
}
